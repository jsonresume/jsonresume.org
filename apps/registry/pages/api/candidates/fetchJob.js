export const fetchJob = async (supabase, jobId) => {
  const { data: jobData, error: jobError } = await supabase
    .from('jobs')
    .select('*')
    .eq('uuid', jobId)
    .single();

  if (jobError || !jobData) {
    console.error('Error fetching job:', jobError);
    return { error: 'Job not found', status: 404 };
  }

  if (!jobData.embedding_v5) {
    return { error: 'Job has no embedding', status: 400 };
  }

  return { jobData };
};
