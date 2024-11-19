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
  console.log('Starting main function...');

  const { data, error } = await supabase
    .from('jobs')
    .select('id::text, gpt_content, embedding_v5')
    // .is('embedding_v5', null)
    .gte(
      'created_at',
      new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    );

  if (error) {
    console.error('Error fetching jobs:', error);
    return;
  }

  console.log('Fetched jobs:', data);

  for (const job of data) {
    if (true || !job.embedding_v5) {
      console.log(`Creating embedding for job ID: ${job.id}`);
      try {
        console.log({ job });
        const completion1 = await openai.embeddings.create({
          model: 'text-embedding-3-large',
          input: job.gpt_content,
        });

        const desiredLength = 3072;
        let embedding = completion1.data[0].embedding;

        if (embedding.length < desiredLength) {
          console.log(`Padding embedding for job ID: ${job.id}`);
          embedding = embedding.concat(
            Array(desiredLength - embedding.length).fill(0)
          );
        }

        const { error: updateError } = await supabase
          .from('jobs')
          .update({
            embedding_v5: embedding,
          })
          .eq('id', job.id);

        if (updateError) {
          console.error(`Error updating job ID: ${job.id}`, updateError);
        } else {
          console.log(`Successfully updated job ID: ${job.id}`);
        }
      } catch (e) {
        console.error(`Error creating embedding for job ID: ${job.id}`, e);
      }
    } else {
      console.log(`Embedding already exists for job ID: ${job.id}`);
    }
  }

  console.log('Main function finished.');
}

main().catch((e) => console.error('Error in main function:', e));
