export const matchResumes = async (supabase, embedding) => {
  const { data: matches, error: matchError } = await supabase.rpc(
    'match_resumes_v5',
    {
      query_embedding: embedding,
      match_threshold: 0.14,
      match_count: 100,
    }
  );

  if (matchError) {
    console.error('Error matching resumes:', matchError);
    return { error: 'Error matching resumes', status: 500 };
  }

  return { matches };
};
