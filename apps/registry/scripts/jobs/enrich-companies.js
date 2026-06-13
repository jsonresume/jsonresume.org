require('dotenv').config({ path: __dirname + '/./../../.env' });
const { createClient } = require('@supabase/supabase-js');

const { SUPABASE_URL: supabaseUrl } = require('../../lib/supabaseConfig');
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getCompanyInfo(companyName) {
  console.log(`🔍 Fetching data for company: ${companyName}`);

  const requestBody = {
    model: 'sonar-pro',
    messages: [
      {
        role: 'user',
        content: `Generate a paragraph and recent news for the company: ${companyName}. Use markdown. Only add a heading for Recent news`,
      },
    ],
    max_tokens: 2000,
    temperature: 0.9,
    top_p: 0.9,
    search_domain_filter: null,
    return_images: false,
    return_related_questions: false,
    search_recency_filter: 'year',
    top_k: 0,
    stream: false,
    presence_penalty: 0,
    frequency_penalty: 1,
    response_format: null,
  };

  const stringifiedBody = JSON.stringify(requestBody, null, 2);
  console.log('📨 Request body:', stringifiedBody);

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: stringifiedBody,
  };

  const response = await fetch(
    'https://api.perplexity.ai/chat/completions',
    options
  );

  if (!response.ok) {
    console.error(`❌ API Error (${response.status}):`, await response.text());
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();
  console.log(
    `📝 Received response for ${companyName}:`,
    JSON.stringify(data, null, 2)
  );
  return data;
}

async function main() {
  console.log('🚀 Starting company data collection process...');

  // Get jobs from the last 60 days
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  console.log(`📅 Fetching jobs since: ${sixtyDaysAgo.toISOString()}`);

  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select('gpt_content')
    .gte('created_at', sixtyDaysAgo.toISOString());

  if (jobsError) {
    console.error('❌ Error fetching jobs:', jobsError);
    return;
  }

  console.log(`📊 Found ${jobs.length} jobs to process`);

  // Extract unique companies
  const companies = new Set();
  jobs.forEach((job) => {
    try {
      const content =
        typeof job.gpt_content === 'string'
          ? JSON.parse(job.gpt_content)
          : job.gpt_content;

      if (content?.company) {
        companies.add(content.company);
      }
    } catch (e) {
      console.warn('⚠️ Error parsing job content:', e);
    }
  });

  console.log(`🏢 Found ${companies.size} unique companies to process`);

  // Process each company
  for (const company of companies) {
    // Check if company already exists
    const { data: existing } = await supabase
      .from('companies')
      .select('name')
      .eq('name', company)
      .single();

    if (existing) {
      console.log(`⏭️ Skipping ${company} - already exists in database`);
      continue;
    }

    console.log(`🔄 Processing company: ${company}`);

    try {
      const companyData = await getCompanyInfo(company);
      console.log({ companyData });
      // Save to database
      const { error: saveError } = await supabase.from('companies').insert({
        name: company,
        data: JSON.stringify(companyData),
      });

      if (saveError) {
        console.error(`❌ Error saving ${company}:`, saveError);
      } else {
        console.log(`✅ Successfully saved data for ${company}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${company}:`, error);
    }
  }

  console.log('🏁 Company data collection process completed!');
}

main().catch((error) => {
  console.error('🚨 Fatal error:', error);
  process.exit(1);
});
