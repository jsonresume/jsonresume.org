// load all the resumes from the database
// and pass it to a template function for openai to turn a job description schema in a json representation

require('dotenv').config({ path: __dirname + '/./../../.env' });

const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

// Log environment variables for debugging
console.log('Environment variables:', {
  NODE_ENV: process.env.NODE_ENV,
  SUPABASE_KEY_EXISTS: !!process.env.SUPABASE_KEY,
  OPENAI_API_KEY_EXISTS: !!process.env.OPENAI_API_KEY,
  ENV_PATH: __dirname + '/./../../.env',
  CURRENT_DIR: __dirname,
});

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey =
  process.env.SUPABASE_KEY || 'MISSING_KEY_USING_FILE_ONLY_MODE';

let supabase;
try {
  console.log('Attempting to create Supabase client with:', {
    supabaseUrl,
    keyLength: supabaseKey ? supabaseKey.length : 0,
  });
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('Supabase client created successfully');
} catch (error) {
  console.error('Failed to create Supabase client:', error.message);
  console.log('Will continue in file-only mode without database access');
  supabase = {
    from: () => ({
      select: () => ({ data: [] }),
      update: () => ({ error: null }),
    }),
  };
}

let openai;

try {
  console.log('Attempting to create OpenAI client');
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log('OpenAI client created successfully');
} catch (error) {
  console.error('Failed to create OpenAI client:', error.message);
  process.exit(1); // Exit if OpenAI fails as it's essential
}

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
    if (!job.embedding_v5) {
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
