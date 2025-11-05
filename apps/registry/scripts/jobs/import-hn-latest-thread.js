/**
 * Fetch and import the latest "Who is Hiring?" thread from Hacker News
 * Finds the most recent thread by @whoishiring and imports all job postings
 */

require('dotenv').config({ path: __dirname + '/./../../.env' });

const axios = require('axios');
const async = require('async');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// API endpoints
const HN_SEARCH_BY_DATE = 'https://hn.algolia.com/api/v1/search_by_date';

/**
 * Find and import the most recent "Who is hiring" thread
 */
async function findLatestWhoIsHiringThread() {
  console.log('\n🔍 Latest HN "Who is Hiring?" Importer');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    console.log('📡 Searching for latest thread...');
    const response = await axios.get(HN_SEARCH_BY_DATE, {
      params: {
        tags: 'story,author_whoishiring',
        hitsPerPage: 10,
        query: 'Who is Hiring',
      },
    });

    const hits = response.data.hits || [];

    if (hits.length === 0) {
      console.log('❌ No threads found');
      return null;
    }

    const latestThread = hits[0];
    const threadId = latestThread.objectID;

    console.log(`✓ Found thread #${threadId}: "${latestThread.title}"`);
    console.log(`📅 Posted: ${latestThread.created_at}`);

    // Fetch all comments for this thread
    console.log('📡 Fetching job postings...');
    const commentsResponse = await axios.get(HN_SEARCH_BY_DATE, {
      params: {
        tags: `comment,story_${threadId}`,
        hitsPerPage: 1000,
        numericFilters: 'parent_id=' + threadId,
      },
    });

    let comments = commentsResponse.data.hits || [];
    console.log(`📊 Found ${comments.length} job postings\n`);

    comments = comments.map((comment) => ({
      id: comment.objectID,
      author: comment.author,
      created_at: comment.created_at,
      created_at_i: comment.created_at_i,
      text: comment.comment_text,
      points: comment.points,
      url: `https://news.ycombinator.com/item?id=${comment.objectID}`,
    }));

    // Save to file
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const result = {
      thread: {
        id: threadId,
        title: latestThread.title,
        url: `https://news.ycombinator.com/item?id=${threadId}`,
        created_at: latestThread.created_at,
        author: latestThread.author,
      },
      comments,
    };

    const outputPath = path.join(outputDir, 'whoIsHiring.json');
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log(`💾 Saved to: ${outputPath}\n`);

    // Import into database with concurrency limit
    let insertedCount = 0;
    let duplicateCount = 0;
    let errorCount = 0;

    await async.eachLimit(comments, 5, async (post) => {
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
          if (error.code === '23505') {
            duplicateCount++;
          } else {
            errorCount++;
            console.error(`  ✗ Job #${post.id}: ${error.message}`);
          }
        } else {
          insertedCount++;
          console.log(`  ✓ Imported job #${post.id}`);
        }
      } catch (err) {
        errorCount++;
        console.error(`  ✗ Job #${post.id}: ${err.message}`);
      }
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ ${insertedCount} jobs imported`);
    if (duplicateCount > 0) {
      console.log(`⏭️  ${duplicateCount} duplicates skipped`);
    }
    if (errorCount > 0) {
      console.log(`❌ ${errorCount} errors`);
    }
    console.log('✨ Import complete!\n');

    return result;
  } catch (error) {
    console.error('🚨 Fatal error:', error.message);
    process.exit(1);
  }
}

findLatestWhoIsHiringThread();
