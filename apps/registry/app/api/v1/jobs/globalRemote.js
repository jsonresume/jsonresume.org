import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

// Module-level cache for global remote classification (persists in warm instances)
const globalRemoteCache = new Map();

/**
 * Classify whether "Full" remote jobs are globally remote or region-restricted.
 * Uses heuristics for obvious cases and a single batched LLM call for ambiguous ones.
 * Cost: ~$0.003 per batch of ~30 jobs (only ambiguous ones hit the LLM).
 */
export async function classifyGlobalRemote(jobs) {
  const fullRemote = jobs.filter((j) => j.remote === 'Full');
  if (fullRemote.length === 0) {
    for (const job of jobs) job.global_remote = false;
    return;
  }

  const needsLLM = [];

  for (const job of fullRemote) {
    if (globalRemoteCache.has(job.id)) {
      job.global_remote = globalRemoteCache.get(job.id);
      continue;
    }

    const loc = job.location || {};
    const addr = (loc.address || '').toLowerCase();
    const region = (loc.region || '').toLowerCase();
    const city = (loc.city || '').toLowerCase();
    const cc = (loc.countryCode || '').toUpperCase();
    const allText = [addr, region, city].join(' ');

    // Clear global signals
    if (/worldwide|global|anywhere|hiring worldwide/.test(allText)) {
      job.global_remote = true;
      globalRemoteCache.set(job.id, true);
      continue;
    }

    // Clear restriction signals
    if (
      /us only|usa only|us-based|americas|emea|pst preferred|est |et overlap|us & ca|remote \(us|remote \(eu|us\)/.test(
        allText
      ) ||
      (cc && !/(worldwide|global|anywhere)/.test(allText))
    ) {
      job.global_remote = false;
      globalRemoteCache.set(job.id, false);
      continue;
    }

    needsLLM.push(job);
  }

  // Batch LLM classification for ambiguous jobs
  if (needsLLM.length > 0) {
    try {
      const jobList = needsLLM
        .map((j, i) => {
          const loc = j.location
            ? JSON.stringify(j.location)
            : 'no location data';
          const co =
            typeof j.company === 'string' ? j.company.slice(0, 80) : 'unknown';
          return `${i + 1}. "${
            j.title
          }" at ${co} | Location: ${loc} | Description: ${(
            j.description || ''
          ).slice(0, 200)}`;
        })
        .join('\n');

      const { text } = await generateText({
        model: openai('gpt-4.1-mini'),
        system:
          'You classify whether remote jobs accept applicants from anywhere in the world (global) or are restricted to specific countries/regions. Output ONLY a JSON array of booleans, one per job. true = accepts applicants globally, false = restricted to specific regions. If unclear, lean toward false.',
        prompt: `Classify these ${needsLLM.length} remote jobs:\n${jobList}`,
        maxTokens: needsLLM.length * 8,
      });

      const parsed = JSON.parse(text);
      needsLLM.forEach((job, i) => {
        const isGlobal = Boolean(parsed[i]);
        job.global_remote = isGlobal;
        globalRemoteCache.set(job.id, isGlobal);
      });
    } catch {
      needsLLM.forEach((job) => {
        job.global_remote = null;
        globalRemoteCache.set(job.id, null);
      });
    }
  }

  // Mark non-Full-remote jobs
  for (const job of jobs) {
    if (job.remote !== 'Full') {
      job.global_remote = false;
    }
  }
}
