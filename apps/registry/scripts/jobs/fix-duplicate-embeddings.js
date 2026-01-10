/**
 * Fix duplicate embeddings in the jobs table
 *
 * This script:
 * 1. Identifies jobs with duplicate embeddings
 * 2. Clears their embedding_v5 column
 * 3. The regular embedding generation script will then regenerate them
 *
 * Run with: node scripts/jobs/fix-duplicate-embeddings.js
 */

require('dotenv').config({ path: __dirname + '/../../.env.local' });

const { createSupabaseClient } = require('./embeddings/supabase');

const supabase = createSupabaseClient();

async function findDuplicateEmbeddings() {
  console.log('\n🔍 Finding duplicate embeddings...\n');

  // Fetch all jobs with embeddings from last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('id, uuid, gpt_content, embedding_v5')
    .not('embedding_v5', 'is', null)
    .gte('created_at', thirtyDaysAgo.toISOString())
    .limit(500);

  if (error) {
    console.error('❌ Error fetching jobs:', error.message);
    return [];
  }

  console.log(`📊 Fetched ${jobs.length} jobs with embeddings`);

  // Hash embeddings to find duplicates
  const embeddingGroups = new Map();

  jobs.forEach((job) => {
    if (!job.embedding_v5) return;

    // Use first 20 values as fingerprint
    const emb = Array.isArray(job.embedding_v5)
      ? job.embedding_v5
      : JSON.parse(job.embedding_v5);

    const hash = emb
      .slice(0, 20)
      .map((v) => v.toFixed(6))
      .join(',');

    if (!embeddingGroups.has(hash)) {
      embeddingGroups.set(hash, []);
    }
    embeddingGroups.get(hash).push(job.id);
  });

  // Find groups with duplicates
  const duplicateGroups = [...embeddingGroups.entries()]
    .filter(([hash, ids]) => ids.length > 1)
    .sort((a, b) => b[1].length - a[1].length);

  console.log(
    `\n📋 Found ${duplicateGroups.length} groups with duplicate embeddings`
  );

  let totalDuplicates = 0;
  duplicateGroups.forEach(([hash, ids], i) => {
    console.log(`   Group ${i + 1}: ${ids.length} jobs with same embedding`);
    totalDuplicates += ids.length;
  });

  console.log(`\n📈 Total jobs with duplicate embeddings: ${totalDuplicates}`);

  // Collect all job IDs that need fixing (all but one from each group)
  const idsToFix = [];
  duplicateGroups.forEach(([hash, ids]) => {
    // Keep the first one, fix the rest
    idsToFix.push(...ids.slice(1));
  });

  return idsToFix;
}

async function clearDuplicateEmbeddings(jobIds) {
  if (jobIds.length === 0) {
    console.log('\n✨ No duplicate embeddings to fix!');
    return;
  }

  console.log(`\n🔧 Clearing embeddings for ${jobIds.length} jobs...`);

  // Update in batches of 50
  const batchSize = 50;
  let cleared = 0;

  for (let i = 0; i < jobIds.length; i += batchSize) {
    const batch = jobIds.slice(i, i + batchSize);

    const { error } = await supabase
      .from('jobs')
      .update({ embedding_v5: null })
      .in('id', batch);

    if (error) {
      console.error(
        `❌ Error clearing batch ${i / batchSize + 1}:`,
        error.message
      );
    } else {
      cleared += batch.length;
      console.log(`   ✓ Cleared ${cleared}/${jobIds.length} embeddings`);
    }
  }

  console.log(`\n✅ Cleared ${cleared} duplicate embeddings`);
  console.log('🔄 Run generate-embeddings-jobs.js to regenerate them');
}

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔧 Duplicate Embedding Fixer');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const idsToFix = await findDuplicateEmbeddings();

  if (idsToFix.length > 0) {
    console.log(`\n⚠️  Will clear ${idsToFix.length} duplicate embeddings`);
    console.log('   (keeping one job from each duplicate group)');

    // Add a confirmation prompt for safety
    if (process.argv.includes('--dry-run')) {
      console.log('\n🔍 DRY RUN - no changes made');
      console.log('   Run without --dry-run to actually fix the embeddings');
    } else if (process.argv.includes('--yes')) {
      await clearDuplicateEmbeddings(idsToFix);
    } else {
      console.log('\n⚠️  Run with --yes to actually clear the embeddings');
      console.log('   Or use --dry-run to just see what would be fixed');
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main().catch((e) => {
  console.error('🚨 Fatal error:', e.message);
  process.exit(1);
});
