import { Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import dynamic from 'next/dynamic';

const CosmicJobsGame = dynamic(() => import('./CosmicJobsGame'), {
  ssr: false,
});

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

async function getJobsAndResumes() {
  // During build time or when SUPABASE_KEY is not available
  if (!process.env.SUPABASE_KEY) {
    return { jobs: [], resumes: [], error: null };
  }

  try {
    const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);

    // Get recent jobs
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .gte('created_at', ninetyDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(50);

    // Get some resumes for cosmic cats
    const { data: resumeData, error: resumesError } = await supabase
      .from('resumes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (jobsError || resumesError) {
      console.error('Error fetching data:', jobsError || resumesError);
      return { jobs: [], resumes: [], error: jobsError || resumesError };
    }

    // Parse resumes
    const resumes =
      resumeData?.map((row) => {
        try {
          const resume = JSON.parse(row.resume);
          return {
            username: row.username,
            name: resume?.basics?.name || row.username,
            label: resume?.basics?.label || 'Cosmic Cat',
            location: resume?.basics?.location,
            skills: resume?.skills || [],
          };
        } catch (e) {
          return {
            username: row.username,
            name: row.username,
            label: 'Cosmic Cat',
            location: null,
            skills: [],
          };
        }
      }) || [];

    return { jobs: jobs || [], resumes, error: null };
  } catch (error) {
    console.error('Error:', error);
    return { jobs: [], resumes: [], error };
  }
}

export const metadata = {
  title: 'Cosmic Jobs - Particle Physics Game | JSON Resume Registry',
  description:
    'A sci-fi physics-based game where jobs are particles in a cosmic simulation with cats!',
};

export default async function CosmicJobsPage() {
  const { jobs, resumes } = await getJobsAndResumes();

  return (
    <div className="min-h-screen bg-black">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-white text-xl">
              Loading Cosmic Simulation...
            </div>
          </div>
        }
      >
        <CosmicJobsGame jobs={jobs} resumes={resumes} />
      </Suspense>
    </div>
  );
}
