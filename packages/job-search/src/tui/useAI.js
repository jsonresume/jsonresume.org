import { useState, useCallback } from 'react';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export function useAI(resume) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasKey = Boolean(process.env.OPENAI_API_KEY);

  const summarizeJob = useCallback(
    async (job) => {
      if (!hasKey) {
        setError('Set OPENAI_API_KEY to enable AI features');
        return;
      }
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

  const batchReview = useCallback(
    async (jobs) => {
      if (!hasKey) {
        setError('Set OPENAI_API_KEY to enable AI features');
        return;
      }
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

  return {
    text,
    loading,
    error,
    hasKey,
    summarizeJob,
    batchReview,
    clear: () => setText(''),
  };
}
