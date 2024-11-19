import { Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import dynamic from 'next/dynamic';

const ClientJobBoard = dynamic(() => import('./ClientJobBoard'), {
  ssr: false,
});

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getJobs() {
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .gte('created_at', ninetyDaysAgo.toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }

  return jobs || [];
}

export default async function JobsPage() {
  const initialJobs = await getJobs();

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
          <ClientJobBoard initialJobs={initialJobs} />
        </Suspense>
      </div>
    </div>
  );
}
