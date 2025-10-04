export const fetchThomasResume = async (supabase) => {
  const { data, error } = await supabase
    .from('resumes')
    .select('username, embedding, resume')
    .eq('username', 'thomasdavis')
    .single();

  if (error) {
    console.error('Error fetching thomasdavis resume:', error);
  }

  return data;
};

export const fetchOtherResumes = async (supabase, limit) => {
  const { data, error } = await supabase
    .from('resumes')
    .select('username, embedding, resume')
    .not('embedding', 'is', null)
    .neq('username', 'thomasdavis')
    .limit(limit)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching resume similarity data:', error);
    throw error;
  }

  return data;
};
