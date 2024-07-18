const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing env var from OpenAI');
}

// This API route is used to match candidates to a job

export default async function handler(req, res) {
  const jobId = 40224903;

  const { data } = await supabase.from('jobs').select().eq('uuid', jobId);

  const jdEmbedding = data[0].embedding_v5;

  const { data: documents } = await supabase.rpc('match_resumes_v5', {
    query_embedding: jdEmbedding,
    match_threshold: 0.14, // Choose an appropriate threshold for your data
    match_count: 40, // Choose the number of matches
  });

  return res.status(200).send(documents);
}
