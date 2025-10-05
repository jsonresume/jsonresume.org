import { Suspense } from 'react';
import { logger } from '@/lib/logger';
import { createClient } from '@supabase/supabase-js';
import dynamic from 'next/dynamic';

const ClientJobBoard = dynamic(() => import('./ClientJobBoard'), {
  ssr: false,
});

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

// Force dynamic rendering - Next.js route config
export const dynamicParams = true;
export const revalidate = 0;

async function getJobs() {
  // During build time or when SUPABASE_KEY is not available
  if (!process.env.SUPABASE_KEY) {
    return { jobs: [], error: null };
  }

  try {
    const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('*')
      .gte('created_at', ninetyDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      logger.error({ error: error.message }, 'Error fetching jobs:');
      return { jobs: [], error };
    }

    return { jobs: jobs || [], error: null };
  } catch (error) {
    logger.error({ error: error.message }, 'Error:');
    return { jobs: [], error };
  }
}

export default async function JobsPage() {
  const { jobs } = await getJobs();

  // Show error message if SUPABASE_KEY is missing
  if (!process.env.SUPABASE_KEY) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-black mb-8">Job Board</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">
              Configuration Required
            </h2>
            <p className="text-yellow-700">
              The job board is currently unavailable due to missing
              configuration. Please contact the administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-8">Job Board</h1>
        <Suspense
          fallback={
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          }
        >
          <ClientJobBoard initialJobs={jobs} />
        </Suspense>
      </div>
    </div>
  );
}
