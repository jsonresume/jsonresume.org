const jobDescriptionToSchemaFunction = require('../openaiFunction');
const { getCompanyContextPrompt } = require('../prompts');
const { getCompanyData } = require('../database');

/**
 * Enrich job with company data
 */
async function companyEnrichment(
  openaiClient,
  supabase,
  job,
  messages,
  company
) {
  const companyDetails = await getCompanyData(supabase, company);
  if (companyDetails) {
    console.log({ jobId: job.id, companyDetails });
    messages.push({
      role: 'system',
      content: getCompanyContextPrompt(companyDetails),
    });
  }

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

  return jobJson2;
}

module.exports = { companyEnrichment };
