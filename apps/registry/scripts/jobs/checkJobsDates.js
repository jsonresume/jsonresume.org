#!/usr/bin/env node
require('dotenv').config({ path: __dirname + '/./../../.env' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkJobsDates() {
  try {
    // Get jobs ordered by posted_at (most recent first)
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('id, posted_at, created_at, content')
      .not('posted_at', 'is', null)
      .order('posted_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    console.log('\n📅 Most Recent 10 Jobs by posted_at:\n');
    jobs.forEach((job, i) => {
      console.log(`${i + 1}. Job ID: ${job.id}`);
      console.log(`   Posted: ${job.posted_at}`);
      console.log(`   Created: ${job.created_at}`);
      console.log(`   Content preview: ${job.content?.substring(0, 100)}...`);
      console.log('');
    });

    // Get jobs ordered by created_at (most recent insertions)
    const { data: recentlyCreated, error: createdError } = await supabase
      .from('jobs')
      .select('id, posted_at, created_at, content')
      .order('created_at', { ascending: false })
      .limit(10);

    if (createdError) throw createdError;

    console.log('\n📅 Most Recently Created Jobs (by created_at):\n');
    recentlyCreated.forEach((job, i) => {
      console.log(`${i + 1}. Job ID: ${job.id}`);
      console.log(`   Posted: ${job.posted_at || 'N/A'}`);
      console.log(`   Created: ${job.created_at}`);
      console.log(`   Content preview: ${job.content?.substring(0, 100)}...`);
      console.log('');
    });
  } catch (error) {
    console.error('Error checking jobs dates:');
    console.error(error);
    process.exit(1);
  }
}

checkJobsDates();
