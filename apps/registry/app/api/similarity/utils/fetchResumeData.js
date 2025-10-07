import { logger } from '@/lib/logger';

export const fetchThomasResume = async (supabase) => {
  const { data, error } = await supabase
    .from('resumes')
    .select('username, embedding, resume')
    .eq('username', 'thomasdavis')
    .single();

  if (error) {
    logger.error({ error: error.message }, 'Error fetching thomasdavis resume');
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
    logger.error(
      { error: error.message, limit },
      'Error fetching resume similarity data'
    );
    throw error;
  }

  return data;
};
