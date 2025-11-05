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
  const isRetry = job.gpt_content === 'FAILED';

  if (job.gpt_content && job.gpt_content !== 'FAILED') {
    return;
  }

  console.log(
    `\n🔄 ${isRetry ? 'Retrying' : 'Processing'} job #${job.id} (${
      job.content?.length || 0
    } chars)`
  );

  try {
    // Step 1: Parse job description
    const { messages, details1, jobJson } = await initialProcessing(job);
    console.log(`  ✓ Parsed: ${jobJson.title} at ${jobJson.company}`);

    // Step 2 & 3: Enrich with company data
    const jobJson2 = await companyEnrichment(
      supabase,
      job,
      messages,
      jobJson.company
    );
    console.log(`  ✓ Enriched company data`);

    // Step 4: Generate natural language description
    const content = await naturalLanguageGeneration(job, messages);
    console.log(`  ✓ Generated description`);

    // Step 5: Save to database
    const success = await updateJob(supabase, job.id, {
      gpt_content: details1,
      gpt_content_json_extended: jobJson2,
      gpt_content_full: content,
    });

    if (success) {
      console.log(`✅ Job #${job.id} complete`);
    }
  } catch (e) {
    const errorMsg = e.message || e.toString();
    console.error(`  ✗ Failed: ${errorMsg.substring(0, 100)}`);
    await markJobAsFailed(supabase, job.id, errorMsg);
  }
}

module.exports = processJob;
