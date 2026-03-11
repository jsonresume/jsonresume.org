/**
 * Fetch unprocessed jobs from database.
 * Filters server-side for jobs needing processing (null or FAILED with retries left).
 */
async function fetchJobs(supabase, limit = 500) {
  const { data, error } = await supabase
    .from('jobs')
    .select()
    .or('gpt_content.is.null,gpt_content.eq.FAILED')
    .lt('retry_count', 3)
    .order('posted_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Error fetching jobs from database: ${error.message}`);
  }

  return data;
}

/**
 * Update job with processed data
 */
async function updateJob(supabase, jobId, updates) {
  const { error } = await supabase.from('jobs').update(updates).eq('id', jobId);

  if (error) {
    console.error(`Error updating job ${jobId}:`, error);
    return false;
  }

  return true;
}

/**
 * Mark job as failed with error tracking
 */
async function markJobAsFailed(supabase, jobId, errorMessage = '') {
  // Get current retry count
  const { data: currentJob } = await supabase
    .from('jobs')
    .select('retry_count')
    .eq('id', jobId)
    .single();

  const retryCount = (currentJob?.retry_count || 0) + 1;

  console.log(`❌ Job ${jobId} failed (attempt ${retryCount})`);

  await supabase
    .from('jobs')
    .update({
      gpt_content: 'FAILED',
      retry_count: retryCount,
      error_message: errorMessage,
    })
    .eq('id', jobId);
}

module.exports = { fetchJobs, updateJob, markJobAsFailed };
