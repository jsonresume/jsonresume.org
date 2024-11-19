import { createClient } from '@supabase/supabase-js';
import ClientResumes from './ClientResumes';
import gravatar from 'gravatar';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const metadata = {
  title: 'Explore JSON Resumes | JSON Resume Registry',
  description: 'Browse and discover professional resumes created using the JSON Resume standard. Find inspiration for your own resume or connect with other professionals.',
  openGraph: {
    title: 'Explore JSON Resumes',
    description: 'Browse and discover professional resumes created using the JSON Resume standard.',
    type: 'website',
  },
};

async function getResumes() {
  try {
    console.time('getResumes');
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3000);

    if (error) throw error;
    console.timeEnd('getResumes');

    console.time('mapResumes');
    const resumes = data.map((row) => {
      const resume = JSON.parse(row.resume);
      return {
        username: row.username,
        label: resume?.basics?.label,
        image:
          resume?.basics?.image ||
          gravatar.url(
            resume?.basics?.email,
            { s: '200', r: 'x', d: 'retro' },
            true
          ),
        name: resume?.basics?.name,
        location: resume?.basics?.location,
        updated_at: row.updated_at,
        created_at: row.created_at,
      };
    });
    console.timeEnd('mapResumes');

    console.time('sortResumes');
    resumes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    console.timeEnd('sortResumes');

    return resumes;
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return [];
  }
}

export default async function ExplorePage() {
  const resumes = await getResumes();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Explore JSON Resumes</h1>
      <p className="text-gray-600 mb-8">
        Browse through professional resumes created using the JSON Resume standard. Get inspired or connect with other professionals.
      </p>
      <ClientResumes initialResumes={resumes} />
    </div>
  );
}
