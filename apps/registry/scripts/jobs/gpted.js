// Process job descriptions using Vercel AI SDK to create structured JSON data

require('dotenv').config({ path: __dirname + '/./../../.env' });

const async = require('async');
const { initializeSupabase, fetchJobs } = require('./gpted/database');
const processJob = require('./gpted/processJob');

// Log environment variables for debugging
console.log('Environment variables:', {
  NODE_ENV: process.env.NODE_ENV,
  SUPABASE_KEY_EXISTS: !!process.env.SUPABASE_KEY,
  OPENAI_API_KEY_EXISTS: !!process.env.OPENAI_API_KEY,
  ENV_PATH: __dirname + '/./../../.env',
  CURRENT_DIR: __dirname,
});

// Initialize Supabase
const supabase = initializeSupabase();

async function main() {
  console.log('======================================');
  console.log('STARTING JOB PROCESSING');
  console.log('======================================');
  console.log('Script version: 1.0.0');
  console.log('Current directory:', __dirname);

  let jobsToProcess = [];
  try {
    const data = await fetchJobs(supabase, 1000);
    console.log(
      `Found ${data.length} jobs in database, processing up to 5 at a time`
    );

    // Filter jobs that don't have gpt_content or failed previously
    jobsToProcess = data.filter(
      (job) => !job.gpt_content || job.gpt_content === 'FAILED'
    );
    console.log(`${jobsToProcess.length} jobs need processing`);
  } catch (error) {
    console.error('Error in database query:', error);
    process.exit(1);
  }

  // Process jobs in parallel with a concurrency limit of 5
  await async.eachLimit(jobsToProcess, 5, async (job) => {
    await processJob(job, supabase);
    // Small delay between starting jobs to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  console.log('All jobs processed successfully!');
}

main();
