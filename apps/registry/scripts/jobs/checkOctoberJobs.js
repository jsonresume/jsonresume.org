#!/usr/bin/env node
require('dotenv').config({ path: __dirname + '/./../../.env' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkOctoberJobs() {
  try {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('id, uuid, gpt_content, posted_at')
      .gte('posted_at', ninetyDaysAgo.toISOString())
      .order('posted_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    console.log('\n📅 Checking October 2025 Jobs:\n');

    jobs.forEach((job, i) => {
      console.log(`=== Job ${i + 1} (ID: ${job.id}) ===`);
      console.log('UUID:', job.uuid);
      console.log('Posted:', job.posted_at);
      console.log('Has gpt_content:', !!job.gpt_content);
      console.log('gpt_content type:', typeof job.gpt_content);

      if (job.gpt_content) {
        const preview = String(job.gpt_content).substring(0, 200);
        console.log('gpt_content preview:', preview);

        // Try parsing if it's a string
        if (typeof job.gpt_content === 'string') {
          try {
            const parsed = JSON.parse(job.gpt_content);
            console.log('✅ Parsed successfully:');
            console.log('  - Title:', parsed.title || parsed.position || 'N/A');
            console.log('  - Company:', parsed.company || 'N/A');
            console.log(
              '  - Location:',
              JSON.stringify(parsed.location) || 'N/A'
            );
          } catch (e) {
            console.log('❌ Failed to parse JSON:', e.message);
          }
        } else if (typeof job.gpt_content === 'object') {
          console.log('Already an object:');
          console.log(
            '  - Title:',
            job.gpt_content.title || job.gpt_content.position || 'N/A'
          );
          console.log('  - Company:', job.gpt_content.company || 'N/A');
        }
      } else {
        console.log('❌ NO gpt_content - this job needs AI processing!');
      }

      console.log('');
    });
  } catch (error) {
    console.error('Error checking October jobs:');
    console.error(error);
    process.exit(1);
  }
}

checkOctoberJobs();
