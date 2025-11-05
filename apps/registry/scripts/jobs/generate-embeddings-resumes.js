/**
 * Generate vector embeddings for user resumes
 * Uses OpenAI's text-embedding-3-large model for semantic search
 */

require('dotenv').config({ path: __dirname + '/./../../.env' });

const async = require('async');
const { createClient } = require('@supabase/supabase-js');
const { embed } = require('ai');
const { openai } = require('@ai-sdk/openai');

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createResumeEmbedding(resume) {
  // Truncate resume to 8192 chars max for embedding model
  const resumeText = resume.resume.substring(0, 8192);

  const { embedding: rawEmbedding } = await embed({
    model: openai.embedding('text-embedding-3-large'),
    value: resumeText,
  });

  const desiredLength = 3072;
  let embedding = rawEmbedding;

  // Pad if needed (rare case)
  if (embedding.length < desiredLength) {
    embedding = embedding.concat(
      Array(desiredLength - embedding.length).fill(0)
    );
  }

  const { error } = await supabase
    .from('resumes')
    .update({ embedding })
    .eq('id', resume.id);

  if (error) {
    throw new Error(`Database update failed: ${error.message}`);
  }

  console.log(
    `  ✓ @${resume.username} (${resumeText.length} chars, ${embedding.length}D vector)`
  );
}

async function main() {
  console.log('\n🔮 Resume Embedding System');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const { data, error } = await supabase
    .from('resumes')
    .select('id::text, username, resume')
    .is('embedding', null);

  if (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log('✨ All resumes already have embeddings!');
    return;
  }

  console.log(`📊 Found ${data.length} resumes needing embeddings`);
  console.log(`⚙️  Processing up to 3 resumes concurrently\n`);

  let successCount = 0;
  let errorCount = 0;

  // Process with concurrency limit of 3
  await async.eachLimit(data, 3, async (resume) => {
    try {
      await createResumeEmbedding(resume);
      successCount++;
    } catch (e) {
      errorCount++;
      console.error(`  ✗ @${resume.username}: ${e.message}`);
    }
  });

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ ${successCount} embeddings created`);
  if (errorCount > 0) {
    console.log(`❌ ${errorCount} failed`);
  }
  console.log('✨ Embedding complete!\n');
}

main().catch((e) => {
  console.error('🚨 Fatal error:', e.message);
  process.exit(1);
});
