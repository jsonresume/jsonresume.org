#!/usr/bin/env node
/**
 * Cleanup Deleted Gists Script
 *
 * This script removes cached resume data for users whose GitHub gists have been deleted.
 * It helps keep the /explore page clean and up-to-date by removing stale entries.
 *
 * Usage:
 *   node scripts/cleanup-deleted-gists.js [--dry-run] [--limit=N]
 *
 * Options:
 *   --dry-run    Show what would be deleted without actually deleting
 *   --limit=N    Only process N users (useful for testing)
 *
 * Example:
 *   node scripts/cleanup-deleted-gists.js --dry-run --limit=10
 */

import { createClient } from '@supabase/supabase-js';
import logger from '../lib/logger.js';

const SUPABASE_URL = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const GITHUB_GIST_URL = 'https://gist.githubusercontent.com';

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const limitArg = args.find((arg) => arg.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : null;

/**
 * Check if a gist exists by making a HEAD request
 * @param {string} username - GitHub username
 * @returns {Promise<boolean>} - True if gist exists, false otherwise
 */
async function gistExists(username) {
  try {
    // Try to fetch the gist (using HEAD request for efficiency)
    const response = await fetch(
      `${GITHUB_GIST_URL}/${username}/raw/resume.json`,
      {
        method: 'HEAD',
        // Don't follow redirects - a redirect means the gist doesn't exist
        redirect: 'manual',
      }
    );

    // 200 = exists, 404 = deleted, 3xx = might be deleted or renamed
    if (response.status === 200) {
      return true;
    }

    // Log non-200 responses for debugging
    logger.debug(
      { username, status: response.status },
      'Gist check returned non-200 status'
    );
    return false;
  } catch (error) {
    logger.error(
      { error: error.message, username },
      'Error checking gist existence'
    );
    // Assume gist exists on error to avoid accidental deletion
    return true;
  }
}

/**
 * Main cleanup function
 */
async function cleanupDeletedGists() {
  // Validate environment
  const supabaseKey = process.env.SUPABASE_KEY;
  if (!supabaseKey) {
    logger.error('SUPABASE_KEY environment variable not set');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, supabaseKey);

  logger.info(
    {
      isDryRun,
      limit: limit || 'unlimited',
    },
    'Starting cleanup of deleted gists'
  );

  try {
    // Fetch all cached resumes
    let query = supabase.from('resumes').select('username, created_at');

    if (limit) {
      query = query.limit(limit);
    }

    const { data: resumes, error: fetchError } = await query;

    if (fetchError) {
      logger.error({ error: fetchError.message }, 'Failed to fetch resumes');
      process.exit(1);
    }

    if (!resumes || resumes.length === 0) {
      logger.info('No resumes found in database');
      return;
    }

    logger.info({ count: resumes.length }, 'Checking gists for users');

    const deletedUsers = [];
    const existingUsers = [];
    let checkedCount = 0;

    // Check each gist
    for (const resume of resumes) {
      const { username } = resume;
      checkedCount++;

      if (checkedCount % 10 === 0) {
        logger.info(
          { checked: checkedCount, total: resumes.length },
          'Progress update'
        );
      }

      const exists = await gistExists(username);

      if (!exists) {
        deletedUsers.push(username);
        logger.info(
          { username, createdAt: resume.created_at },
          'Found deleted gist'
        );
      } else {
        existingUsers.push(username);
      }

      // Add small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    logger.info(
      {
        total: resumes.length,
        existing: existingUsers.length,
        deleted: deletedUsers.length,
      },
      'Gist check complete'
    );

    // Delete entries for non-existent gists
    if (deletedUsers.length > 0) {
      if (isDryRun) {
        logger.info(
          { usernames: deletedUsers },
          'DRY RUN: Would delete these users'
        );
      } else {
        logger.info(
          { count: deletedUsers.length },
          'Deleting cached data for users with deleted gists'
        );

        const { error: deleteError, count } = await supabase
          .from('resumes')
          .delete({ count: 'exact' })
          .in('username', deletedUsers);

        if (deleteError) {
          logger.error(
            { error: deleteError.message },
            'Failed to delete cached resumes'
          );
          process.exit(1);
        }

        logger.info(
          { deletedCount: count || 0, usernames: deletedUsers },
          'Successfully deleted cached data for users with deleted gists'
        );
      }
    } else {
      logger.info('No deleted gists found - database is clean!');
    }

    logger.info('Cleanup complete');
  } catch (error) {
    logger.error({ error: error.message }, 'Unexpected error during cleanup');
    process.exit(1);
  }
}

// Run the cleanup
cleanupDeletedGists();
