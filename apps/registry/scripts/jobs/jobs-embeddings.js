require('dotenv').config({ path: __dirname + '/./../../.env' });

const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const { data, error } = await supabase
    .from('resumes')
    .select('id::text, username, resume, embedding')
    .is('embedding', null);
  // .limit(300);
  console.log({ data, error });

  for (let i = 0; i < data.length; i++) {
    const resume = data[i];
    if (!resume.embedding) {
      console.log('Create embedding for');
      console.log('Username:', resume.username);
      console.log('ID:', resume.id);

      const completion1 = await openai.embeddings.create({
        model: 'text-embedding-3-large',
        input: resume.resume.substr(0, 8192),
      });
      console.log('Embedding done');

      const desiredLength = 3072;

      let embedding = completion1.data[0].embedding;

      if (embedding.length < desiredLength) {
        embedding = embedding.concat(
          Array(desiredLength - embedding.length).fill(0)
        );
      }

      console.log('Embedding to be saved:', embedding);

      try {
        console.log('Saving embedding for ID:', resume.id);

        const updateResponse = await supabase
          .from('resumes')
          .update({ embedding })
          .eq('id', resume.id);

        console.log('Update response:', updateResponse);

        if (updateResponse.error) {
          console.log('Error updating embedding:', updateResponse.error);
        } else {
          console.log('Embedding updated successfully:', updateResponse.data);
        }

        await sleep(2000); // Sleep for 2 seconds
      } catch (e) {
        console.error(e);
      }
    }
  }
}

main();
