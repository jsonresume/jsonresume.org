// Process job descriptions using Vercel AI SDK to create structured JSON data

require('dotenv').config({ path: __dirname + '/../../../../.env' });

const async = require('async');
const { initializeSupabase, fetchJobs } = require('./job-parser/database');
const processJob = require('./job-parser/processJob');

// Initialize Supabase
const supabase = initializeSupabase();

async function main() {
  console.log('\n🚀 Job Processing System v2.0');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  let jobsToProcess = [];
  try {
    const data = await fetchJobs(supabase, 1000);

    // Filter jobs that don't have gpt_content or failed previously (with retry limit)
    jobsToProcess = data.filter(
      (job) => !job.gpt_content || job.gpt_content === 'FAILED'
    );

    console.log(
      `📊 Found ${data.length} jobs, ${jobsToProcess.length} need processing`
    );
    console.log(`⚙️  Processing up to 5 jobs concurrently\n`);
  } catch (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  }

  if (jobsToProcess.length === 0) {
    console.log('✨ All jobs are up to date!');
    return;
  }

  // Process jobs in parallel with a concurrency limit of 5
  await async.eachLimit(jobsToProcess, 5, async (job) => {
    await processJob(job, supabase);
    // Small delay between starting jobs to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✨ All jobs processed successfully!\n');
}

main();
