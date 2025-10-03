const OpenAI = require('openai');
const jobDescriptionToSchemaFunction = require('./openaiFunction');
const {
  getJobProcessingPrompt,
  getCompanyContextPrompt,
  getNaturalLanguagePrompt,
} = require('./prompts');
const { getCompanyData, updateJob, markJobAsFailed } = require('./database');

/**
 * Process a single job with OpenAI
 */
async function processJob(job, openaiClient, supabase) {
  console.log('======================================');
  console.log(`Starting to process job: ${job.id}`);
  console.log('Job details:', {
    id: job.id,
    author: job.author,
    contentLength: job.content ? job.content.length : 0,
    created_at: job.created_at,
    url: job.url,
  });

  if (job.gpt_content) {
    console.log(`Job ${job.id} already has gpt_content, skipping`);
    return;
  }

  try {
    // Step 1: Initial processing
    const messages = [
      {
        role: 'system',
        content: getJobProcessingPrompt(job.content),
      },
    ];

    console.log('Starting OpenAI processing for job:', job.id);
    const chat1 = await openaiClient.chat.completions.create({
      model: 'gpt-4.1',
      temperature: 0.75,
      messages,
      functions: [jobDescriptionToSchemaFunction],
      function_call: 'auto',
    });

    const details1 = chat1.choices[0].message.function_call?.arguments;
    console.log(JSON.stringify(details1, null, 2));
    const jobJson = JSON.parse(details1);
    console.log({ jobId: job.id, jobJson });

    const { company } = jobJson;
    console.log({ jobId: job.id, company });

    // Step 2: Enrich with company data if available
    const companyDetails = await getCompanyData(supabase, company);
    if (companyDetails) {
      console.log({ jobId: job.id, companyDetails });
      messages.push({
        role: 'system',
        content: getCompanyContextPrompt(companyDetails),
      });
    }

    // Step 3: Regenerate with company context
    console.log({ jobId: job.id, messages });
    const chat2 = await openaiClient.chat.completions.create({
      model: 'gpt-4.1',
      temperature: 0.75,
      messages,
      functions: [jobDescriptionToSchemaFunction],
      function_call: 'auto',
    });

    const details2 = chat2.choices[0].message.function_call?.arguments;
    const jobJson2 = JSON.parse(details2);
    console.log({ jobId: job.id, jobJson2 });

    // Step 4: Generate natural language description
    messages.push({
      role: 'system',
      content: getNaturalLanguagePrompt(),
    });

    const chat3 = await openaiClient.chat.completions.create({
      model: 'gpt-4.1',
      temperature: 0.75,
      messages,
    });

    const content = chat3.choices[0].message.content;
    console.log({ jobId: job.id, content });

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
