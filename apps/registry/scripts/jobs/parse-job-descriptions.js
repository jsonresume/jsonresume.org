// Process job descriptions using Vercel AI SDK to create structured JSON data

require('dotenv').config({ path: __dirname + '/./../../.env' });

const async = require('async');
const { initializeSupabase, fetchJobs } = require('./job-parser/database');
const processJob = require('./job-parser/processJob');

// Time budget: exit gracefully before GH Actions timeout (default 40min)
const TIME_BUDGET_MS = parseInt(process.env.TIME_BUDGET_MS, 10) || 40 * 60 * 1000;
const startTime = Date.now();
let stopAccepting = false;

const supabase = initializeSupabase();

async function main() {
  console.log('\n🚀 Job Processing System v2.1');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`⏱️  Time budget: ${Math.round(TIME_BUDGET_MS / 60000)}min`);

  let jobsToProcess = [];
  try {
    jobsToProcess = await fetchJobs(supabase, 500);
    console.log(`📊 Found ${jobsToProcess.length} jobs needing processing`);
    console.log(`⚙️  Processing up to 10 jobs concurrently\n`);
  } catch (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  }

  if (jobsToProcess.length === 0) {
    console.log('✨ All jobs are up to date!');
    return;
  }

  let processed = 0;
  let failed = 0;

  await async.eachLimit(jobsToProcess, 10, async (job) => {
    if (stopAccepting) return;

    const elapsed = Date.now() - startTime;
    if (elapsed > TIME_BUDGET_MS) {
      stopAccepting = true;
      console.log(`\n⏱️  Time budget reached (${Math.round(elapsed / 60000)}min). Stopping gracefully.`);
      return;
    }

    try {
      await processJob(job, supabase);
      processed++;
    } catch (e) {
      failed++;
    }
  });

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ ${processed} jobs processed, ${failed} failed`);
  const remaining = jobsToProcess.length - processed - failed;
  if (remaining > 0) {
    console.log(`⏭️  ${remaining} deferred to next run`);
  }
  console.log(`⏱️  Elapsed: ${Math.round((Date.now() - startTime) / 60000)}min`);
  console.log('✨ Done!\n');
}

main();
