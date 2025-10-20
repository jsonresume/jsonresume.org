const { updateJob, markJobAsFailed } = require('./database');
const { initialProcessing } = require('./processJob/initialProcessing');
const { companyEnrichment } = require('./processJob/companyEnrichment');
const {
  naturalLanguageGeneration,
} = require('./processJob/naturalLanguageGeneration');

/**
 * Process a single job using Vercel AI SDK
 */
async function processJob(job, supabase) {
  console.log('======================================');
  console.log(`Starting to process job: ${job.id}`);
  console.log('Job details:', {
    id: job.id,
    author: job.author,
    contentLength: job.content ? job.content.length : 0,
    created_at: job.created_at,
    url: job.url,
  });

  if (job.gpt_content && job.gpt_content !== 'FAILED') {
    console.log(`Job ${job.id} already has gpt_content, skipping`);
    return;
  }

  if (job.gpt_content === 'FAILED') {
    console.log(`Job ${job.id} previously failed, retrying...`);
  }

  try {
    // Step 1: Initial processing
    const { messages, details1, jobJson } = await initialProcessing(job);
    const { company } = jobJson;
    console.log({ jobId: job.id, company });

    // Step 2 & 3: Enrich with company data and regenerate
    const jobJson2 = await companyEnrichment(supabase, job, messages, company);

    // Step 4: Generate natural language description
    const content = await naturalLanguageGeneration(job, messages);

    // Step 5: Update database
    console.log(`Updating job ${job.id} in database`);
    const success = await updateJob(supabase, job.id, {
      gpt_content: details1,
      gpt_content_json_extended: jobJson2,
      gpt_content_full: content,
    });

    if (success) {
      console.log(`Successfully processed job: ${job.id}`);
    }

    console.log('======================================');
  } catch (e) {
    console.error(`Error processing job ${job.id}:`, e);
    console.error('Stack trace:', e.stack);
    await markJobAsFailed(supabase, job.id);
  }
}

module.exports = processJob;
