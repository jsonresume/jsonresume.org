/**
 * Generate vector embeddings for job descriptions
 * Uses OpenAI's text-embedding-3-large model to create semantic search vectors
 */

require('dotenv').config({ path: __dirname + '/../../.env.local' });

const async = require('async');
const { createSupabaseClient } = require('./embeddings/supabase');
const { createEmbedding } = require('./embeddings/createJobEmbedding');

const supabase = createSupabaseClient();

async function main() {
  console.log('\n🔮 Vector Embedding System');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const processAll = process.argv.includes('--all');

  let query = supabase
    .from('jobs')
    .select('id::text, gpt_content')
    .is('embedding_v5', null)
    .not('gpt_content', 'is', null);

  if (!processAll) {
    // Default: only process jobs from last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    console.log(
      `📅 Processing jobs since: ${twentyFourHoursAgo.toISOString()}`
    );
    query = query.gte('created_at', twentyFourHoursAgo.toISOString());
  } else {
    console.log('📅 Processing ALL jobs without embeddings');
  }

  const { data, error } = await query.limit(500);

  if (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log('✨ All jobs already have embeddings!');
    return;
  }

  console.log(`📊 Found ${data.length} jobs needing embeddings`);
  console.log(`⚙️  Processing up to 3 jobs concurrently\n`);

  let successCount = 0;
  let errorCount = 0;

  // Process jobs with concurrency limit of 3
  await async.eachLimit(data, 3, async (job) => {
    try {
      await createEmbedding(job, supabase);
      successCount++;
    } catch (e) {
      errorCount++;
      console.error(`  ✗ Failed job #${job.id}: ${e.message}`);
    }
  });

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ ${successCount} embeddings created`);
  if (errorCount > 0) {
    console.log(`❌ ${errorCount} failed`);
  }
  console.log('✨ Vector embedding complete!\n');
}

main().catch((e) => {
  console.error('🚨 Fatal error:', e.message);
  process.exit(1);
});
