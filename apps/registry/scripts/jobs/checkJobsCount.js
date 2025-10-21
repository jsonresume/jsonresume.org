#!/usr/bin/env node
require('dotenv').config({ path: __dirname + '/./../../.env' });
/**
 * Check the status of jobs in the Supabase database
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_KEY:', !!supabaseKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkJobsStatus() {
  try {
    // Total jobs
    const { count: totalJobs, error: totalError } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true });

    if (totalError) throw totalError;

    // Jobs with GPT content
    const { count: gptJobs, error: gptError } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .not('gpt_content', 'is', null);

    if (gptError) throw gptError;

    // Jobs with embeddings
    const { count: embeddedJobs, error: embeddingError } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .not('embedding_v5', 'is', null);

    if (embeddingError) throw embeddingError;

    // Jobs with dates
    const { count: datedJobs, error: dateError } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .not('posted_at', 'is', null);

    if (dateError) throw dateError;

    // Recent jobs (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: recentJobs, error: recentError } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .gte('posted_at', thirtyDaysAgo.toISOString());

    if (recentError) throw recentError;

    console.log('\n📊 Jobs Database Status:\n');
    console.log(`Total jobs: ${totalJobs || 0}`);
    console.log(`Jobs with GPT content: ${gptJobs || 0}`);
    console.log(`Jobs with embeddings (v5): ${embeddedJobs || 0}`);
    console.log(`Jobs with posted_at dates: ${datedJobs || 0}`);
    console.log(`Recent jobs (last 30 days): ${recentJobs || 0}`);

    // Sample jobs
    const { data: sampleJobs, error: sampleError } = await supabase
      .from('jobs')
      .select('id, posted_at, gpt_content, embedding_v5')
      .limit(5)
      .order('created_at', { ascending: false });

    if (sampleError) throw sampleError;

    if (sampleJobs && sampleJobs.length > 0) {
      console.log('\n📝 Sample Jobs (most recent 5):');
      sampleJobs.forEach((job, i) => {
        console.log(`\n${i + 1}. Job ID: ${job.id}`);
        console.log(`   Posted: ${job.posted_at || 'N/A'}`);
        console.log(`   Has GPT content: ${!!job.gpt_content}`);
        console.log(`   Has embedding: ${!!job.embedding_v5}`);
      });
    }
  } catch (error) {
    console.error('Error checking jobs status:');
    console.error(error);
    process.exit(1);
  }
}

checkJobsStatus();
