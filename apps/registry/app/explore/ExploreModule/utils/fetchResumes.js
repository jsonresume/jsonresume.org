import { createClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import { SUPABASE_URL, ITEMS_PER_PAGE } from '../constants';
import { parseResumeRow } from './parseResume';

export async function fetchResumes(page = 1, search = '') {
  try {
    // During build time, return empty data
    if (!process.env.SUPABASE_KEY) {
      return { resumes: [], totalCount: 0, totalPages: 0 };
    }

    const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_KEY);

    // First get the total count
    let countQuery = supabase
      .from('resumes')
      .select('*', { count: 'exact', head: true });

    if (search && search.trim() !== '') {
      countQuery = countQuery.textSearch('resume', search.trim(), {
        config: 'english',
        type: 'websearch',
      });
    }

    const { count: totalCount } = await countQuery;

    // Then get the actual data
    let dataQuery = supabase.from('resumes').select('*');

    if (search && search.trim() !== '') {
      dataQuery = dataQuery.textSearch('resume', search.trim(), {
        config: 'english',
        type: 'websearch',
      });
    }

    const queryStart = Date.now();
    const { data, error } = await dataQuery
      .order('created_at', { ascending: false })
      .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

    if (error) throw error;

    const queryDuration = Date.now() - queryStart;
    logger.debug(
      { duration: queryDuration, page, search },
      'Fetched resumes from database'
    );

    if (!data) {
      throw new Error('No data returned from query');
    }

    const parseStart = Date.now();
    const resumes = data
      .map(parseResumeRow)
      .filter((resume) => resume.meta?.public !== false);

    const parseDuration = Date.now() - parseStart;
    logger.debug(
      { duration: parseDuration, count: resumes.length },
      'Parsed and filtered resumes'
    );

    return {
      resumes,
      totalCount: totalCount || 0,
      totalPages: Math.ceil((totalCount || 0) / ITEMS_PER_PAGE),
    };
  } catch (error) {
    logger.error(
      { error: error.message, page, search },
      'Error fetching resumes'
    );
    return { resumes: [], totalCount: 0, totalPages: 0 };
  }
}
