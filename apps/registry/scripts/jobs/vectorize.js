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
  const { data, error } = await supabase.from('jobs').select();
  console.log({ data, error });
  data.forEach(async (job) => {
    if (!job.embedding_v5) {
      console.log('create embedding');
      const completion1 = await openai.embeddings.create({
        model: 'text-embedding-3-large',
        input: JSON.stringify(job.gpt_content),
      });

      const desiredLength = 3072;

      let embedding = completion1.data[0].embedding;

      if (embedding.length < desiredLength) {
        embedding = embedding.concat(
          Array(desiredLength - embedding.length).fill(0)
        );
      }

      try {
        const { error } = await supabase
          .from('jobs')
          .update({
            embedding_v5: embedding,
          })
          .eq('id', job.id);
        console.log({ error });
      } catch (e) {
        console.error(e);
      }
    }
  });
}

main();
