require('dotenv').config({ path: __dirname + '/./../../.env' });
/**
 * Script to query Hacker News API and find the latest "Who is hiring" thread
 * posted by the user "whoishiring" and output all comments to stdout
 */
const { createClient } = require('@supabase/supabase-js');

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
// API endpoints
const HN_SEARCH_API = 'https://hn.algolia.com/api/v1/search';
const HN_SEARCH_BY_DATE = 'https://hn.algolia.com/api/v1/search_by_date';

/**
 * Find and output the most recent "Who is hiring" thread by "whoishiring" user
 */
async function findLatestWhoIsHiringThread() {
  try {
    // Query for stories with "Who is hiring" in the title by user "whoishiring"
    // Only need 1 result - the most recent one
    // Use search_by_date to get results chronologically (newest first)
    const response = await axios.get(HN_SEARCH_BY_DATE, {
      params: {
        tags: 'story,author_whoishiring',
        hitsPerPage: 10, // Get recent results
        query: 'Who is Hiring', // Search for posts with this title
      },
    });

    const hits = response.data.hits || [];

    if (hits.length > 0) {
      // search_by_date already returns results chronologically (newest first)
      // Get the latest thread
      const latestThread = hits[0];

      // Get the thread ID
      const threadId = latestThread.objectID;
      // Get all comments for this thread (only top-level comments)
      const commentsResponse = await axios.get(HN_SEARCH_BY_DATE, {
        params: {
          tags: `comment,story_${threadId}`,
          hitsPerPage: 1000,
          numericFilters: 'parent_id=' + threadId, // Only direct replies to the thread
        },
      });

      let comments = commentsResponse.data.hits || [];

      comments = comments.map((comment) => ({
        id: comment.objectID,
        author: comment.author,
        created_at: comment.created_at,
        created_at_i: comment.created_at_i,
        text: comment.comment_text,
        points: comment.points,
        url: `https://news.ycombinator.com/item?id=${comment.objectID}`,
      }));

      // Format the output with thread info and all comments
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

      // Create outputs directory if it doesn't exist
      const outputDir = path.join(__dirname, 'output');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Write results to outputs/whoIsHiring.json
      const outputPath = path.join(outputDir, 'whoIsHiring.json');
      fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

      // Output the result to stdout
      console.log(JSON.stringify(result));
      console.log(`\nResults written to ${outputPath}`);

      // Now insert into Supabase
      let insertedCount = 0;
      let duplicateCount = 0;
      let errorCount = 0;

      for (const post of comments) {
        try {
          const { data, error } = await supabase.from('jobs').insert({
            uuid: post.id,
            content: post.text,
            posted_at: new Date(post.created_at_i * 1000),
            type: 'hackernews',
            raw: JSON.stringify(post),
            url: `https://news.ycombinator.com/item?id=${post.id}`,
          });

          if (error) {
            // Ignore duplicate key errors (23505)
            if (error.code === '23505') {
              duplicateCount++;
            } else {
              console.error(`Error inserting job ${post.id}:`, error);
              errorCount++;
            }
          } else {
            console.log(`✅ Inserted job ${post.id}`);
            insertedCount++;
          }
        } catch (err) {
          console.error(`Failed to insert job ${post.id}:`, err);
          errorCount++;
        }
      }

      console.log(
        `\n📊 Summary: ${insertedCount} inserted, ${duplicateCount} duplicates, ${errorCount} errors`
      );
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

// Execute the main function
findLatestWhoIsHiringThread();
