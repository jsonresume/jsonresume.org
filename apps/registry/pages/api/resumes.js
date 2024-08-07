// @todo - shows a list of all cached github gists

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const gravatar = require('gravatar');

export default async function handler(req, res) {
  const { limit } = req.query;
  console.time('getResumes');
  const { data } = await supabase
    .from('resumes')
    .select()
    .order('created_at', { ascending: false })
    .limit(limit || 3000);
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
  resumes.sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });
  console.timeEnd('sortResumes');

  return res.status(200).send(resumes);
}
