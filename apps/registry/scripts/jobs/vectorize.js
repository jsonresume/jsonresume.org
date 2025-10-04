// load all the resumes from the database
// and pass it to a template function for openai to turn a job description schema in a json representation

require('dotenv').config({ path: __dirname + '/./../../.env' });

const {
  createSupabaseClient,
  createOpenAIClient,
} = require('./vectorize/initClients');
const { createEmbedding } = require('./vectorize/createEmbedding');

// Log environment variables for debugging
console.log('Environment variables:', {
  NODE_ENV: process.env.NODE_ENV,
  SUPABASE_KEY_EXISTS: !!process.env.SUPABASE_KEY,
  OPENAI_API_KEY_EXISTS: !!process.env.OPENAI_API_KEY,
  ENV_PATH: __dirname + '/./../../.env',
  CURRENT_DIR: __dirname,
});

const supabase = createSupabaseClient();
const openai = createOpenAIClient();

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
      await createEmbedding(openai, job, supabase);
    } else {
      console.log(`Embedding already exists for job ID: ${job.id}`);
    }
  }

  console.log('Main function finished.');
}

main().catch((e) => console.error('Error in main function:', e));
