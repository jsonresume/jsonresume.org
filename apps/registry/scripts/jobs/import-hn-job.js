/**
 * Import job postings from Hacker News "Who is Hiring?" threads
 * Fetches posts from the monthly thread and stores them in the database
 */

require('dotenv').config({ path: __dirname + '/./../../.env' });
const axios = require('axios');
const async = require('async');
const { createClient } = require('@supabase/supabase-js');

const { SUPABASE_URL: supabaseUrl } = require('../../lib/supabaseConfig');
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const HN_API = 'https://hn.algolia.com/api/v1/items/';
const WHO_IS_HIRING_ITEM_ID = 43858554;

async function main() {
  console.log('\n💼 Hacker News Job Importer');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  console.log(`📡 Fetching thread #${WHO_IS_HIRING_ITEM_ID}...`);
  const response = await axios.get(`${HN_API}${WHO_IS_HIRING_ITEM_ID}`);
  const { data } = response;

  const posts = data.children || [];
  console.log(`📊 Found ${posts.length} job postings\n`);

  let successCount = 0;
  let duplicateCount = 0;
  let errorCount = 0;

  // Process posts with concurrency limit of 5
  await async.eachLimit(posts, 5, async (post) => {
    try {
      const { error } = await supabase.from('jobs').insert({
        uuid: post.id,
        content: post.text,
        posted_at: new Date(post.created_at_i * 1000),
        type: 'hackernews',
        raw: JSON.stringify(post),
        url: `https://news.ycombinator.com/item?id=${post.id}`,
      });

      if (error) {
        // Check if it's a duplicate key error
        if (error.code === '23505') {
          duplicateCount++;
        } else {
          errorCount++;
          console.error(`  ✗ Job #${post.id}: ${error.message}`);
        }
      } else {
        successCount++;
        console.log(`  ✓ Imported job #${post.id}`);
      }
    } catch (e) {
      errorCount++;
      console.error(`  ✗ Job #${post.id}: ${e.message}`);
    }
  });

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ ${successCount} jobs imported`);
  if (duplicateCount > 0) {
    console.log(`⏭️  ${duplicateCount} duplicates skipped`);
  }
  if (errorCount > 0) {
    console.log(`❌ ${errorCount} errors`);
  }
  console.log('✨ Import complete!\n');
}

main().catch((e) => {
  console.error('🚨 Fatal error:', e.message);
  process.exit(1);
});
