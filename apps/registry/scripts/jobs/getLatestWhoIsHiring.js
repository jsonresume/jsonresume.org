/**
 * Script to query Hacker News API and find the latest "Who is hiring" thread
 * posted by the user "whoishiring" and output all comments to stdout
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

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
    // Use a broader query to ensure we get all "Who is hiring" threads
    const response = await axios.get(HN_SEARCH_API, {
      params: {
        tags: 'story,author_whoishiring',
        hitsPerPage: 1000, // Get all results to ensure we get the latest
        // Filter for 2020 (Unix timestamps for Jan 1, 2020 to Dec 31, 2020)
        numericFilters: 'created_at_i>=1577836800,created_at_i<=1609459199',
      },
    });

    const hits = response.data.hits || [];

    if (hits.length > 0) {
      // Sort by date (newest first)
      hits.sort((a, b) => b.created_at_i - a.created_at_i);

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

      const comments = commentsResponse.data.hits || [];

      // Format the output with thread info and all comments
      const result = {
        thread: {
          id: threadId,
          title: latestThread.title,
          url: `https://news.ycombinator.com/item?id=${threadId}`,
          created_at: latestThread.created_at,
          author: latestThread.author,
        },
        comments: comments.map((comment) => ({
          id: comment.objectID,
          author: comment.author,
          created_at: comment.created_at,
          text: comment.comment_text,
          points: comment.points,
          url: `https://news.ycombinator.com/item?id=${comment.objectID}`,
        })),
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
