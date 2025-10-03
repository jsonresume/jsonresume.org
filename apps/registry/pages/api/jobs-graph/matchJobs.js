/**
 * Matches jobs based on embedding similarity
 * @param {number[]} embedding - Resume embedding vector
 * @returns {Promise<Array>} Sorted array of jobs with similarity scores
 */
export async function matchJobs(embedding) {
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
  const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);

  // Match jobs using vector similarity
  const { data: documents } = await supabase.rpc('match_jobs_v5', {
    query_embedding: embedding,
    match_threshold: -1,
    match_count: 200,
    created_after: new Date(
      Date.now() - 65 * 24 * 60 * 60 * 1000
    ).toISOString(),
  });

  const sortedDocuments = documents.sort((a, b) => b.similarity - a.similarity);
  const jobIds = documents ? sortedDocuments.map((doc) => doc.id) : [];

  // Fetch full job data
  const { data: jobsData } = await supabase
    .from('jobs')
    .select('*')
    .in('id', jobIds)
    .gte(
      'created_at',
      new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString()
    )
    .order('created_at', { ascending: false });

  // Add similarity scores to jobs
  const sortedJobs = jobsData.map((job) => {
    const doc = sortedDocuments.find((d) => d.id === job.id);
    return {
      ...job,
      similarity: doc ? doc.similarity : 0,
    };
  });

  return sortedJobs;
}
