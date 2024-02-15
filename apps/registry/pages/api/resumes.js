// @todo - shows a list of all cached github gists

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const gravatar = require('gravatar');

export default async function handler(req, res) {
  const { data } = await supabase.from('resumes').select();

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
      updated_at: row.updated_at,
    };
  });

  return res.status(200).send(resumes);
}
