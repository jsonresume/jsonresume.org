import { retryWithBackoff } from '@/lib/retry';

const TIME_RANGE_DAYS = {
  '1m': 35,
  '2m': 65,
  '3m': 95,
};

const MAX_JOBS = 300;

/**
 * Check if parsed content has valid title and company
 */
function isValidContent(content) {
  const title = content?.title?.toLowerCase() || '';
  const company = content?.company?.toLowerCase() || '';

  if (!content?.title || !content?.company) return false;
  if (title === 'unknown' || title === 'unknown job') return false;
  if (company === 'unknown' || company === 'unknown company') return false;
  return true;
}

/**
 * Match jobs based on embedding similarity.
 * Parses gpt_content once and stores as parsedContent on each job.
 */
export async function matchJobs(supabase, embedding, timeRange = '1m') {
  const days = TIME_RANGE_DAYS[timeRange] || 35;
  const createdAfter = new Date(
    Date.now() - days * 24 * 60 * 60 * 1000
  ).toISOString();

  const documents = await retryWithBackoff(
    async () => {
      const { data, error } = await supabase.rpc('match_jobs_v5', {
        query_embedding: embedding,
        match_threshold: -1,
        match_count: MAX_JOBS,
        created_after: createdAfter,
      });
      if (error) throw new Error(error.message);
      return data;
    },
    { maxAttempts: 3 }
  );

  const sortedDocuments =
    documents?.sort((a, b) => b.similarity - a.similarity) || [];
  const jobIds = sortedDocuments.map((doc) => doc.id);

  if (jobIds.length === 0) return [];

  const jobsData = await retryWithBackoff(
    async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .in('id', jobIds)
        .gte('created_at', createdAfter)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
    { maxAttempts: 3 }
  );

  // Parse gpt_content once, validate, and store as parsedContent
  return (jobsData || [])
    .map((job) => {
      try {
        const parsedContent = JSON.parse(job.gpt_content);
        if (!isValidContent(parsedContent)) return null;
        const doc = sortedDocuments.find((d) => d.id === job.id);
        return { ...job, parsedContent, similarity: doc?.similarity || 0 };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

/**
 * Build job info map using pre-parsed content
 */
export function buildJobInfoMap(jobs) {
  const jobInfoMap = {};
  jobs.forEach((job) => {
    if (job.parsedContent) {
      jobInfoMap[job.uuid] = {
        ...job.parsedContent,
        salaryUsd: job.salary_usd,
        salaryMin: job.salary_min,
        salaryMax: job.salary_max,
        salaryCurrency: job.salary_currency,
      };
    } else {
      jobInfoMap[job.uuid] = { title: 'Unknown Job', error: 'No content' };
    }
  });
  return jobInfoMap;
}
