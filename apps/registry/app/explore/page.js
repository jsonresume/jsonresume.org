import { createClient } from '@supabase/supabase-js';
import ClientResumes from './ClientResumes';
import gravatar from 'gravatar';
import { Users, Globe2, Code2 } from 'lucide-react';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

const ITEMS_PER_PAGE = 100;

export const metadata = {
  title: 'Explore JSON Resumes | JSON Resume Registry',
  description:
    'Browse and discover professional resumes created using the JSON Resume standard. Find inspiration for your own resume or connect with other professionals.',
  openGraph: {
    title: 'Explore JSON Resumes',
    description:
      'Browse and discover professional resumes created using the JSON Resume standard.',
    type: 'website',
  },
};

// This makes the page static at build time
export const dynamic = 'force-dynamic';

async function getResumes(page = 1, search = '') {
  try {
    // During build time, return empty data
    if (!process.env.SUPABASE_KEY) {
      return { resumes: [], totalCount: 0, totalPages: 0 };
    }

    const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);

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

    console.time('getResumes');
    const { data, error } = await dataQuery
      .order('created_at', { ascending: false })
      .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

    if (error) throw error;
    console.timeEnd('getResumes');

    if (!data) {
      throw new Error('No data returned from query');
    }

    console.time('mapResumes');
    const resumes = data.map((row) => {
      try {
        const resume = JSON.parse(row.resume);
        return {
          username: row.username,
          label: resume?.basics?.label,
          image:
            resume?.basics?.image ||
            gravatar.url(
              resume?.basics?.email || '',
              { s: '200', r: 'x', d: 'retro' },
              true
            ),
          name: resume?.basics?.name,
          location: resume?.basics?.location,
          updated_at: row.updated_at,
          created_at: row.created_at,
        };
      } catch (e) {
        console.error('Error parsing resume:', e);
        return {
          username: row.username,
          label: 'Error parsing resume',
          image: gravatar.url('', { s: '200', r: 'x', d: 'retro' }, true),
          name: row.username,
          location: null,
          updated_at: row.updated_at,
          created_at: row.created_at,
        };
      }
    });
    console.timeEnd('mapResumes');

    return {
      resumes,
      totalCount: totalCount || 0,
      totalPages: Math.ceil((totalCount || 0) / ITEMS_PER_PAGE),
    };
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return { resumes: [], totalCount: 0, totalPages: 0 };
  }
}

export default async function ExplorePage({ searchParams }) {
  const page = Number(searchParams?.page) || 1;
  const search = searchParams?.search || '';
  const { resumes, totalCount, totalPages } = await getResumes(page, search);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gray-100/50 bg-[size:20px_20px] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          
          <div className="relative">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
              Explore JSON Resumes
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mb-8 leading-relaxed">
              Discover how professionals present their careers using the JSON Resume standard. 
              Get inspired and see how others structure their experiences.
            </p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{totalCount.toLocaleString()} Resumes</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4" />
                <span>Global Community</span>
              </div>
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                <span>Open Source</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-sm text-gray-600 mb-6">
          {search ? (
            <span>
              Found {totalCount.toLocaleString()} resumes matching "{search}"
            </span>
          ) : (
            <span>Browsing {totalCount.toLocaleString()} professional resumes</span>
          )}
        </div>
        
        <ClientResumes
          initialResumes={resumes}
          currentPage={page}
          totalPages={totalPages}
          currentSearch={search}
        />
      </div>
    </div>
  );
}
