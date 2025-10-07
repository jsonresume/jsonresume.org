/**
 * Fetch jobs from database
 */
async function fetchJobs(supabase, limit = 1000) {
  console.log('Fetching jobs from database...');
  const { data, error } = await supabase
    .from('jobs')
    .select()
    .order('id', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Error fetching jobs from database: ${error.message}`);
  }

  console.log(`Found ${data.length} jobs in database`);
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
 * Mark job as failed
 */
async function markJobAsFailed(supabase, jobId) {
  console.log(`Marking job ${jobId} as FAILED in database`);
  await supabase.from('jobs').update({ gpt_content: 'FAILED' }).eq('id', jobId);
}

module.exports = { fetchJobs, updateJob, markJobAsFailed };
