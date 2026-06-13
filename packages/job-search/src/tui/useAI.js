import { useState, useCallback, useRef } from 'react';
import { writeFileSync } from 'fs';
import {
  buildResumeText,
  buildJobText,
  buildDossierPrompt,
  extractEnrichment,
  dossierFilename,
} from './aiHelpers.js';
import { resolveClaudePath, runClaudeDossier } from './claudeDossier.js';
import { runJobSummary, runBatchReview } from './gptReview.js';
import { dossierStatus, seedDossierFlags } from './dossierCache.js';

export function useAI(resume) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('ai'); // 'ai' | 'cover'
  const hasKey = Boolean(process.env.OPENAI_API_KEY);
  const childRef = useRef(null);
  const dossierJobId = useRef(null);
  // Local cache: jobId → { text, done, loading }
  const dossierCache = useRef(new Map());
  // Bump to trigger re-renders when dossier status changes
  const [, setDossierTick] = useState(0);
  const bumpTick = () => setDossierTick((t) => t + 1);

  const summarizeJob = useCallback(
    async (job) => {
      if (!hasKey) {
        setError(
          'AI requires OPENAI_API_KEY — run: export OPENAI_API_KEY=sk-...'
        );
        return;
      }
      setMode('ai');
      setLoading(true);
      setError(null);
      setText('');
      try {
        setText(await runJobSummary(resume, job));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [resume, hasKey]
  );

  const dossier = useCallback(
    async (job, api) => {
      const cached = dossierCache.current.get(job.id);

      // If dossier is already loading or loaded for this job, just show it
      if (cached && (cached.loading || cached.done)) {
        setMode('cover');
        setText(cached.text || '');
        setLoading(cached.loading || false);
        setError(null);
        dossierJobId.current = job.id;
        return;
      }

      setMode('cover');
      setError(null);
      setText('');
      dossierJobId.current = job.id;
      dossierCache.current.set(job.id, {
        text: '',
        done: false,
        loading: true,
      });
      bumpTick();

      // Helper to update both state and cache
      // Only updates visible state if this job is still the active dossier
      const updateText = (val) => {
        const entry = dossierCache.current.get(job.id);
        if (entry) entry.text = val;
        if (dossierJobId.current === job.id) setText(val);
      };

      // Check server for existing dossier
      try {
        const { content } = await api.fetchDossier(job.id);
        if (content) {
          updateText(content);
          dossierCache.current.set(job.id, {
            text: content,
            done: true,
            loading: false,
          });
          bumpTick();
          return;
        }
      } catch {
        /* no cached dossier */
      }

      // Check if claude CLI is available
      let claudePath;
      try {
        claudePath = await resolveClaudePath();
      } catch {
        setError(
          'Claude Code CLI not found. Install it: npm install -g @anthropic-ai/claude-code'
        );
        return;
      }

      // Kill any existing claude process
      if (childRef.current) {
        try {
          childRef.current.kill();
        } catch {}
        childRef.current = null;
      }

      setLoading(true);

      // Fetch resume if not available yet
      let currentResume = resume;
      if (!currentResume) {
        try {
          const me = await api.fetchMe();
          currentResume = me.resume;
        } catch {
          /* proceed without resume */
        }
      }

      // Fetch full job detail for raw content
      let rawContent = '';
      try {
        const detail = await api.fetchJobDetail(job.id);
        rawContent = detail.raw_content || detail.full_description || '';
      } catch {}

      const resumeText = buildResumeText(currentResume);
      const jobText = buildJobText(job, rawContent);
      const prompt = buildDossierPrompt(resumeText, jobText);

      try {
        const finalResult = await runClaudeDossier({
          claudePath,
          prompt,
          onText: updateText,
          onChild: (child) => {
            childRef.current = child;
          },
          onEnd: (child) => {
            // Only clear childRef if it's still our process
            if (childRef.current === child) childRef.current = null;
          },
        });

        // Save to server if we got output
        if (finalResult.trim()) {
          try {
            await api.saveDossier(job.id, finalResult);
          } catch {}
          // Extract and save enrichment data if present
          const enriched = extractEnrichment(finalResult);
          if (enriched) {
            try {
              await api.enrichJob(job.id, enriched);
            } catch {}
          }
        }
      } catch (err) {
        if (err.message?.includes('exited with code')) {
          setError(`Claude failed — ${err.message}`);
        } else if (err.message !== 'killed') {
          setError(err.message);
        }
      } finally {
        const entry = dossierCache.current.get(job.id);
        if (entry) {
          entry.done = true;
          entry.loading = false;
        }
        bumpTick();
        if (dossierJobId.current === job.id) {
          childRef.current = null;
          setLoading(false);
        }
      }
    },
    [resume]
  );

  const batchReview = useCallback(
    async (jobs) => {
      if (!hasKey) {
        setError(
          'AI requires OPENAI_API_KEY — run: export OPENAI_API_KEY=sk-...'
        );
        return;
      }
      setMode('ai');
      setLoading(true);
      setError(null);
      setText('');
      try {
        setText(await runBatchReview(resume, jobs));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [resume, hasKey]
  );

  const cancel = useCallback(() => {
    if (childRef.current) {
      try {
        childRef.current.kill();
      } catch {}
      childRef.current = null;
    }
  }, []);

  const textRef = useRef('');
  textRef.current = text;

  const exportDossier = useCallback((job) => {
    // Use visible text state, or fall back to cache
    const content =
      textRef.current || dossierCache.current.get(job?.id)?.text || '';
    if (!content) return null;
    const filename = dossierFilename(job);
    writeFileSync(filename, content, 'utf-8');
    return filename;
  }, []);

  // Seed cache with server-side dossier flags from job list
  const seedFlags = useCallback((jobs) => {
    if (seedDossierFlags(dossierCache.current, jobs)) bumpTick();
  }, []);

  // Expose dossier status for job list icons
  // Returns: 'generating' | 'done' | null
  const getDossierStatus = useCallback(
    (jobId) => dossierStatus(dossierCache.current, jobId),
    []
  );

  const regenerateDossier = useCallback(
    (job, api) => {
      // Clear cached dossier so dossier() starts fresh
      dossierCache.current.delete(job.id);
      cancel();
      setText('');
      setError(null);
      bumpTick();
      dossier(job, api);
    },
    [dossier, cancel]
  );

  return {
    text,
    loading,
    error,
    hasKey,
    mode,
    hasActiveProcess: Boolean(childRef.current),
    getDossierStatus,
    seedDossierFlags: seedFlags,
    summarizeJob,
    dossier,
    regenerateDossier,
    batchReview,
    exportDossier,
    cancel,
    clear: () => {
      cancel();
      setText('');
      dossierJobId.current = null;
    },
  };
}
