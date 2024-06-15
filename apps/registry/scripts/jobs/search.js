require('dotenv').config({ path: __dirname + '/./../../.env' });

const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  //   const { data, error } = await supabase.from('jobs').select();
  const completion1 = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: JSON.stringify('haskell computer vision'),
  });

  const desiredLength = 2048;

  let embedding = completion1.data.data[0].embedding;

  if (embedding.length < desiredLength) {
    embedding = embedding.concat(
      Array(desiredLength - embedding.length).fill(0)
    );
  }

  const { data: documents, error } = await supabase.rpc('match_jobs', {
    query_embedding: embedding,
    match_threshold: 0.78, // Choose an appropriate threshold for your data
    match_count: 10, // Choose the number of matches
  });

  console.log({ documents, error });
}

main();
