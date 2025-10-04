export const buildResumesQuery = (supabase, searchParams) => {
  const limit = parseInt(searchParams.get('limit')) || 2000;
  const page = parseInt(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';

  const query = supabase
    .from('resumes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
    .range((page - 1) * limit, page * limit - 1);

  if (search && search.trim() !== '') {
    query.textSearch('resume', search.trim(), {
      config: 'english',
      type: 'websearch',
    });
  }

  return query;
};
