require('dotenv').config({ path: __dirname + '/../../.env.local' });

const { createSupabaseClient } = require('./embeddings/supabase');

const supabase = createSupabaseClient();

async function check() {
  const { data, error } = await supabase
    .from('jobs')
    .select('id, gpt_content')
    .is('embedding_v5', null)
    .limit(5);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Jobs without embeddings:');
  data.forEach((job) => {
    console.log(`\nJob #${job.id}:`);
    console.log(`  gpt_content length: ${job.gpt_content?.length || 0}`);
    console.log(
      `  gpt_content preview: ${JSON.stringify(job.gpt_content?.slice(0, 300))}`
    );
  });
}

check();
