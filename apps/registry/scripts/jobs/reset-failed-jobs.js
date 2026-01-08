// Reset FAILED jobs from the last 20 days so they can be reprocessed
// Usage: SUPABASE_KEY=your_key node reset-failed-jobs.js

require('dotenv').config({ path: __dirname + '/../../../../.env' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_API_KEY || process.env.SUPABASE_KEY;

if (!supabaseKey) {
  console.error('❌ SUPABASE_API_KEY or SUPABASE_KEY is required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const twentyDaysAgo = new Date(
    Date.now() - 20 * 24 * 60 * 60 * 1000
  ).toISOString();

  console.log('\n🔍 Finding FAILED jobs from the last 20 days...\n');

  // First, count how many we'll update
  const { count, error: countError } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('gpt_content', 'FAILED')
    .gte('created_at', twentyDaysAgo);

  if (countError) {
    console.error('❌ Error counting jobs:', countError.message);
    process.exit(1);
  }

  console.log(`📊 Found ${count} FAILED jobs in the last 20 days`);

  if (count === 0) {
    console.log('✨ No jobs to reset!');
    return;
  }

  // Reset gpt_content to null and retry_count to 0
  const { error: updateError } = await supabase
    .from('jobs')
    .update({
      gpt_content: null,
      retry_count: 0,
      error_message: null,
    })
    .eq('gpt_content', 'FAILED')
    .gte('created_at', twentyDaysAgo);

  if (updateError) {
    console.error('❌ Error resetting jobs:', updateError.message);
    process.exit(1);
  }

  console.log(`✅ Reset ${count} jobs - they will be reprocessed on next run`);
  console.log('\n📝 Now run: node parse-job-descriptions.js');
}

main();
