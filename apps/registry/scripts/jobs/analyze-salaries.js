/**
 * Analyze salary data in the jobs table to understand all format variations
 */

require('dotenv').config({ path: '../../.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
  console.error('Missing SUPABASE_KEY environment variable');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeSalaries() {
  console.log('Fetching jobs with salary data...\n');

  // Fetch jobs with gpt_content (parsed job data)
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('id, gpt_content, gpt_content_json_extended')
    .not('gpt_content', 'is', null)
    .not('gpt_content', 'eq', 'FAILED')
    .limit(2000);

  if (error) {
    console.error('Error fetching jobs:', error);
    return;
  }

  console.log(`Fetched ${jobs.length} jobs\n`);

  const salaryExamples = new Map();
  const salaryPatterns = new Map();
  let withSalary = 0;
  let withoutSalary = 0;

  for (const job of jobs) {
    let parsed;
    try {
      parsed =
        typeof job.gpt_content === 'string'
          ? JSON.parse(job.gpt_content)
          : job.gpt_content;
    } catch (e) {
      continue;
    }

    const salary = parsed?.salary;

    if (
      !salary ||
      salary === '' ||
      salary === 'N/A' ||
      salary === 'Not specified'
    ) {
      withoutSalary++;
      continue;
    }

    withSalary++;

    // Categorize the salary format
    const salaryStr = String(salary);

    // Detect pattern type
    let pattern = 'unknown';

    if (/^\d+$/.test(salaryStr)) {
      pattern = 'plain_number';
    } else if (/^\d+k$/i.test(salaryStr)) {
      pattern = 'number_with_k';
    } else if (/\$[\d,]+\s*-\s*\$[\d,]+/.test(salaryStr)) {
      pattern = 'usd_range';
    } else if (/€[\d,]+/.test(salaryStr)) {
      pattern = 'eur';
    } else if (/£[\d,]+/.test(salaryStr)) {
      pattern = 'gbp';
    } else if (/[\d,]+\s*-\s*[\d,]+/.test(salaryStr)) {
      pattern = 'numeric_range';
    } else if (/\$[\d,]+/.test(salaryStr)) {
      pattern = 'usd_single';
    } else if (/per\s*(hour|year|month|week)/i.test(salaryStr)) {
      pattern = 'with_period';
    } else if (/hourly|annual|yearly|monthly/i.test(salaryStr)) {
      pattern = 'with_period_word';
    } else if (/competitive|negotiable|doe|market/i.test(salaryStr)) {
      pattern = 'non_numeric';
    }

    // Store examples
    if (!salaryExamples.has(pattern)) {
      salaryExamples.set(pattern, []);
    }
    if (salaryExamples.get(pattern).length < 10) {
      salaryExamples.get(pattern).push({ id: job.id, salary: salaryStr });
    }

    salaryPatterns.set(pattern, (salaryPatterns.get(pattern) || 0) + 1);
  }

  // Print results
  console.log('='.repeat(60));
  console.log('SALARY DATA ANALYSIS');
  console.log('='.repeat(60));
  console.log(`\nTotal jobs: ${jobs.length}`);
  console.log(
    `With salary: ${withSalary} (${((withSalary / jobs.length) * 100).toFixed(
      1
    )}%)`
  );
  console.log(
    `Without salary: ${withoutSalary} (${(
      (withoutSalary / jobs.length) *
      100
    ).toFixed(1)}%)`
  );

  console.log('\n' + '='.repeat(60));
  console.log('SALARY PATTERNS');
  console.log('='.repeat(60));

  // Sort by count
  const sortedPatterns = [...salaryPatterns.entries()].sort(
    (a, b) => b[1] - a[1]
  );

  for (const [pattern, count] of sortedPatterns) {
    console.log(`\n📊 ${pattern}: ${count} jobs`);
    console.log('-'.repeat(40));
    const examples = salaryExamples.get(pattern) || [];
    for (const ex of examples.slice(0, 5)) {
      console.log(`   Job #${ex.id}: "${ex.salary}"`);
    }
  }

  // Also check gpt_content_json_extended for structured salary
  console.log('\n' + '='.repeat(60));
  console.log('CHECKING EXTENDED JSON FOR STRUCTURED SALARY');
  console.log('='.repeat(60));

  let extendedWithSalary = 0;
  const extendedSalaryExamples = [];

  for (const job of jobs.slice(0, 500)) {
    if (!job.gpt_content_json_extended) continue;

    let extended;
    try {
      extended =
        typeof job.gpt_content_json_extended === 'string'
          ? JSON.parse(job.gpt_content_json_extended)
          : job.gpt_content_json_extended;
    } catch (e) {
      continue;
    }

    if (extended?.salary && typeof extended.salary === 'object') {
      extendedWithSalary++;
      if (extendedSalaryExamples.length < 10) {
        extendedSalaryExamples.push({ id: job.id, salary: extended.salary });
      }
    }
  }

  console.log(`\nJobs with structured salary object: ${extendedWithSalary}`);
  for (const ex of extendedSalaryExamples) {
    console.log(`   Job #${ex.id}:`, JSON.stringify(ex.salary));
  }
}

analyzeSalaries().catch(console.error);
