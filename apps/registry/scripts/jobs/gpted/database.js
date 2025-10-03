const { createClient } = require('@supabase/supabase-js');

/**
 * Initialize Supabase client with fallback for missing credentials
 */
function initializeSupabase() {
  const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
  const supabaseKey =
    process.env.SUPABASE_KEY || 'MISSING_KEY_USING_FILE_ONLY_MODE';

  try {
    console.log('Attempting to create Supabase client with:', {
      supabaseUrl,
      keyLength: supabaseKey ? supabaseKey.length : 0,
    });
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client created successfully');
    return supabase;
  } catch (error) {
    console.error('Failed to create Supabase client:', error.message);
    console.log('Will continue in file-only mode without database access');
    // Return mock client for file-only mode
    return {
      from: () => ({
        select: () => ({ data: [] }),
        update: () => ({ error: null }),
      }),
    };
  }
}

/**
 * Fetch jobs from database
 */
async function fetchJobs(supabase, limit = 1000) {
  console.log('Fetching jobs from database...');
  const { data, error } = await supabase
    .from('jobs')
    .select()
    .order('id', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Error fetching jobs from database: ${error.message}`);
  }

  console.log(`Found ${data.length} jobs in database`);
  return data;
}

/**
 * Get company data by name
 */
async function getCompanyData(supabase, companyName) {
  const { data: companyData, error } = await supabase
    .from('companies')
    .select()
    .eq('name', companyName);

  if (error) {
    console.error('Error fetching company data:', error);
    return null;
  }

  if (companyData && companyData[0]) {
    const parsedCompanyData = JSON.parse(companyData[0].data);
    return parsedCompanyData.choices[0].message.content;
  }

  return null;
}

/**
 * Update job with processed data
 */
async function updateJob(supabase, jobId, updates) {
  const { error } = await supabase.from('jobs').update(updates).eq('id', jobId);

  if (error) {
    console.error(`Error updating job ${jobId}:`, error);
    return false;
  }

  return true;
}

/**
 * Mark job as failed
 */
async function markJobAsFailed(supabase, jobId) {
  console.log(`Marking job ${jobId} as FAILED in database`);
  await supabase.from('jobs').update({ gpt_content: 'FAILED' }).eq('id', jobId);
}

module.exports = {
  initializeSupabase,
  fetchJobs,
  getCompanyData,
  updateJob,
  markJobAsFailed,
};
