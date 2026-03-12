import { useState, useCallback, useRef } from 'react';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

function buildResumeText(resume) {
  return [
    resume?.basics?.name,
    resume?.basics?.label,
    resume?.basics?.summary,
    ...(resume?.skills || []).map(
      (s) => `${s.name}: ${(s.keywords || []).join(', ')}`
    ),
    ...(resume?.work || [])
      .slice(0, 5)
      .map(
        (w) =>
          `${w.position} at ${w.name}${
            w.startDate ? ` (${w.startDate})` : ''
          }: ${w.summary || ''}`
      ),
    ...(resume?.projects || [])
      .slice(0, 3)
      .map((p) => `Project: ${p.name} — ${p.description || ''}`),
  ]
    .filter(Boolean)
    .join('\n');
}

function buildJobText(job, rawContent) {
  return [
    `Title: ${job.title}`,
    `Company: ${job.company}`,
    `Salary: ${job.salary || 'Not listed'}`,
    `Remote: ${job.remote || 'Not specified'}`,
    job.experience ? `Experience: ${job.experience}` : '',
    job.type ? `Type: ${job.type}` : '',
    job.url ? `HN Post: ${job.url}` : '',
    `Description: ${job.description || ''}`,
    `Skills: ${(job.skills || []).map((s) => s.name || s).join(', ')}`,
    ...(job.qualifications || []).map((q) => `Qualification: ${q}`),
    ...(job.responsibilities || []).map((r) => `Responsibility: ${r}`),
    rawContent ? `\nFull original posting:\n${rawContent}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

export function useAI(resume) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('ai'); // 'ai' | 'cover'
  const hasKey = Boolean(process.env.OPENAI_API_KEY);
  const childRef = useRef(null);
  const dossierJobId = useRef(null);
  const dossierDone = useRef(false);

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
        const resumeText = [
          resume?.basics?.label,
          resume?.basics?.summary,
          ...(resume?.skills || []).map(
            (s) => `${s.name}: ${(s.keywords || []).join(', ')}`
          ),
        ]
          .filter(Boolean)
          .join('\n');

        const jobText = [
          `Title: ${job.title}`,
          `Company: ${job.company}`,
          `Salary: ${job.salary || 'Not listed'}`,
          `Remote: ${job.remote || 'Not specified'}`,
          `Description: ${job.description || ''}`,
          `Skills: ${(job.skills || []).map((s) => s.name).join(', ')}`,
        ].join('\n');

        const { text: result } = await generateText({
          model: openai('gpt-4o-mini'),
          system:
            'You are a career advisor. Given a job posting and resume, provide a concise fit analysis in 4-5 bullet points. Cover: why it fits, skill gaps, salary assessment, and remote compatibility. Be direct and opinionated.',
          prompt: `Resume:\n${resumeText}\n\nJob:\n${jobText}`,
          maxTokens: 400,
        });
        setText(result);
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
      // If dossier is already loading or loaded for this job, just show it
      if (
        dossierJobId.current === job.id &&
        (childRef.current || dossierDone.current)
      ) {
        setMode('cover');
        return;
      }

      setMode('cover');
      setError(null);
      setText('');
      dossierJobId.current = job.id;
      dossierDone.current = false;

      // Check server for existing dossier
      try {
        const { content } = await api.fetchDossier(job.id);
        if (content) {
          setText(content);
          dossierDone.current = true;
          return;
        }
      } catch {
        /* no cached dossier */
      }

      // Check if claude CLI is available
      const { execSync } = await import('child_process');
      let claudePath;
      try {
        claudePath = execSync('which claude', { encoding: 'utf-8' }).trim();
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

      const prompt = `You are a job search research assistant. A candidate is considering applying to this role. Do thorough research and produce a comprehensive dossier.

## Candidate Resume
${resumeText}

## Job Posting
${jobText}

## Your Task

Research everything you can and produce a complete dossier covering:

### 1. Company Deep Dive
- What the company does, their products/services
- Funding stage, size, recent news
- Tech stack and engineering culture
- Leadership team
- Employee sentiment and Glassdoor/Blind highlights
- Any red flags or concerns

### 2. Role Analysis
- What you'd actually be doing day-to-day
- Team context — who you'd work with
- Growth trajectory for this role
- How this role fits into the company's current priorities

### 3. Fit Assessment
- Matching skills and experience (be specific, reference the candidate's actual background)
- Skill gaps to acknowledge or address
- Adjacent experience that transfers
- Overall fit rating: Strong / Good / Stretch

### 4. Cover Letter Talking Points
- 5-7 specific bullet points to mention, each referencing the candidate's real experience
- What angle to take (technical depth? leadership? domain expertise?)
- What to emphasize vs. downplay

### 5. Contact Info
- Email addresses from the posting
- Who posted (HN username from the URL if available)
- Best way to reach out

### 6. Interview Prep
- Questions they'll likely ask for this role
- Questions the candidate should ask
- Topics to research before interviewing

### 7. Compensation Context
- Market rate for this role/level/location
- How the listed salary compares
- Negotiation leverage points

Be thorough, specific, and opinionated. Reference the candidate's actual experience when making recommendations.`;

      try {
        const { spawn } = await import('child_process');
        // Remove CLAUDECODE env var to allow nested claude sessions
        const env = { ...process.env };
        delete env.CLAUDECODE;
        delete env.CLAUDE_CODE_ENTRYPOINT;
        delete env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS;

        const child = spawn(
          claudePath,
          [
            '--print',
            '--output-format',
            'stream-json',
            '--verbose',
            '--allowedTools',
            'WebSearch',
            'WebFetch',
            '--',
            prompt,
          ],
          { stdio: ['ignore', 'pipe', 'pipe'], env }
        );
        childRef.current = child;

        let finalResult = '';
        let buffer = '';
        let statusLine = '';

        function processLine(line) {
          if (!line.trim()) return;
          try {
            const event = JSON.parse(line);

            if (event.type === 'assistant') {
              // Extract text from assistant message content
              const content = event.message?.content || [];
              for (const block of content) {
                if (block.type === 'text' && block.text) {
                  finalResult = block.text;
                  setText(
                    statusLine ? `${statusLine}\n\n${finalResult}` : finalResult
                  );
                } else if (block.type === 'tool_use') {
                  // Show what Claude is doing (e.g. WebSearch, WebFetch)
                  const name = block.name || 'tool';
                  const input = block.input || {};
                  if (name === 'WebSearch' || name === 'WebFetch') {
                    statusLine = `🔍 ${name}: ${
                      input.query || input.url || ''
                    }`;
                  } else {
                    statusLine = `⚙ Using ${name}…`;
                  }
                  setText(
                    finalResult ? `${statusLine}\n\n${finalResult}` : statusLine
                  );
                }
              }
            }

            if (event.type === 'result' && event.result) {
              finalResult = event.result;
              setText(finalResult);
            }
          } catch {
            // Not valid JSON, skip
          }
        }

        child.stdout.on('data', (chunk) => {
          buffer += chunk.toString();
          // Process complete JSON lines
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            processLine(line);
          }
        });

        child.stderr.on('data', () => {});

        await new Promise((resolve, reject) => {
          child.on('close', (code) => {
            childRef.current = null;
            // Process any remaining buffer
            if (buffer.trim()) processLine(buffer);
            if (code === 0) {
              resolve();
            } else if (code !== null) {
              reject(new Error(`Claude exited with code ${code}`));
            } else {
              resolve(); // killed
            }
          });
          child.on('error', (err) => {
            childRef.current = null;
            reject(err);
          });
        });

        // Save to server if we got output
        if (finalResult.trim()) {
          try {
            await api.saveDossier(job.id, finalResult);
          } catch {}
        }
      } catch (err) {
        if (err.message?.includes('exited with code')) {
          setError(`Claude failed — ${err.message}`);
        } else if (err.message !== 'killed') {
          setError(err.message);
        }
      } finally {
        childRef.current = null;
        dossierDone.current = true;
        setLoading(false);
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
        const resumeText = [resume?.basics?.label, resume?.basics?.summary]
          .filter(Boolean)
          .join('\n');

        const jobsList = jobs
          .slice(0, 15)
          .map(
            (j, i) =>
              `${i + 1}. [${j.similarity}] ${j.title} at ${j.company} | ${
                j.salary || 'no salary'
              } | ${j.remote || 'no remote info'}`
          )
          .join('\n');

        const { text: result } = await generateText({
          model: openai('gpt-4o-mini'),
          system:
            'You are a career advisor. Rank these jobs by fit for the candidate. For each, give a 1-line verdict. Be direct.',
          prompt: `Resume:\n${resumeText}\n\nJobs:\n${jobsList}`,
          maxTokens: 600,
        });
        setText(result);
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

  const exportDossier = useCallback(
    (job) => {
      if (!text) return null;
      const { writeFileSync } = require('fs');
      const company = (job?.company || 'unknown')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .toLowerCase();
      const filename = `dossier-${company}.md`;
      writeFileSync(filename, text, 'utf-8');
      return filename;
    },
    [text]
  );

  return {
    text,
    loading,
    error,
    hasKey,
    mode,
    summarizeJob,
    dossier,
    batchReview,
    exportDossier,
    cancel,
    clear: () => {
      cancel();
      setText('');
      dossierJobId.current = null;
      dossierDone.current = false;
    },
  };
}
