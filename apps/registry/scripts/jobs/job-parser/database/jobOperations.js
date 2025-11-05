/**
 * Fetch jobs from database (excludes jobs that have already been retried)
 */
async function fetchJobs(supabase, limit = 1000) {
  const { data, error } = await supabase
    .from('jobs')
    .select()
    .or('retry_count.is.null,retry_count.lt.1') // Only get jobs with 0 retries or NULL
    .order('id', { ascending: false })
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
