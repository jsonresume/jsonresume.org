import { Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import ResumeChessWrapper from './ResumeChessWrapper';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';

async function getResumeData() {
  // During build time or when SUPABASE_KEY is not available
  if (!process.env.SUPABASE_KEY) {
    return { resumes: [], jobs: [], error: null };
  }

  try {
    const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);

    // Get some resumes for piece customization
    const { data: resumeData, error: resumesError } = await supabase
      .from('resumes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(32); // 32 pieces on a chess board

    // Get some jobs for game context
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (resumesError || jobsError) {
      console.error('Error fetching data:', resumesError || jobsError);
      return { resumes: [], jobs: [], error: resumesError || jobsError };
    }

    // Parse resumes
    const resumes =
      resumeData?.map((row) => {
        try {
          const resume = JSON.parse(row.resume);
          return {
            username: row.username,
            name: resume?.basics?.name || row.username,
            label: resume?.basics?.label || 'Professional',
            skills: resume?.skills || [],
            experience: resume?.work || [],
            location: resume?.basics?.location,
            email: resume?.basics?.email,
          };
        } catch (e) {
          return {
            username: row.username,
            name: row.username,
            label: 'Professional',
            skills: [],
            experience: [],
            location: null,
            email: null,
          };
        }
      }) || [];

    return { resumes, jobs: jobs || [], error: null };
  } catch (error) {
    console.error('Error:', error);
    return { resumes: [], jobs: [], error };
  }
}

export const metadata = {
  title: 'Resume Chess - Strategic Career Game | JSON Resume Registry',
  description:
    'Play chess where each piece represents different career roles and skills from real resumes!',
};

export default async function ResumeChessPage() {
  const { resumes, jobs } = await getResumeData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-amber-800 text-xl">
              Loading Resume Chess...
            </div>
          </div>
        }
      >
        <ResumeChessWrapper resumes={resumes} jobs={jobs} />
      </Suspense>
    </div>
  );
}
