/**
 * Run salary column migration and backfill existing jobs
 */

const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../../.env.local'),
});
const { createClient } = require('@supabase/supabase-js');
const { normalizeSalary } = require('./index.js');

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
  console.error('Missing SUPABASE_KEY environment variable');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Exchange rates (approximate, as of late 2024)
// In production, these should be fetched from an API
const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149,
  INR: 83,
  AUD: 1.53,
  CAD: 1.36,
  CHF: 0.88,
  SEK: 10.5,
  NZD: 1.64,
  SGD: 1.34,
  HKD: 7.82,
  CNY: 7.24,
  KRW: 1320,
  MXN: 17.2,
  BRL: 4.97,
  PLN: 4.0,
  RUB: 92,
  PHP: 56,
  THB: 35,
  ZAR: 18.5,
  AED: 3.67,
  ILS: 3.7,
};

async function runMigration() {
  console.log('Adding salary columns to jobs table...\n');

  // Add columns using raw SQL via RPC or just rely on them existing
  // Since we can't run arbitrary SQL, we'll just try the backfill
  // and assume the columns exist (add them manually if needed)

  console.log('Note: Make sure these columns exist in the jobs table:');
  console.log('  - salary_usd (INTEGER)');
  console.log('  - salary_min (INTEGER)');
  console.log('  - salary_max (INTEGER)');
  console.log('  - salary_currency (VARCHAR(3))');
  console.log('');
  console.log('You can add them via Supabase Dashboard SQL Editor:\n');
  console.log(`
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_usd INTEGER;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_min INTEGER;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_max INTEGER;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_currency VARCHAR(3);
  `);
}

async function backfillSalaries() {
  console.log('\n=== Starting salary backfill ===\n');

  // Fetch all jobs with gpt_content
  let offset = 0;
  const batchSize = 500;
  let totalProcessed = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    console.log(`Fetching jobs ${offset} to ${offset + batchSize}...`);

    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('id, gpt_content')
      .not('gpt_content', 'is', null)
      .not('gpt_content', 'eq', 'FAILED')
      .range(offset, offset + batchSize - 1);

    if (error) {
      console.error('Error fetching jobs:', error);
      break;
    }

    if (!jobs || jobs.length === 0) {
      console.log('No more jobs to process.');
      break;
    }

    console.log(`Processing ${jobs.length} jobs...`);

    const updates = [];

    for (const job of jobs) {
      totalProcessed++;

      let parsed;
      try {
        parsed =
          typeof job.gpt_content === 'string'
            ? JSON.parse(job.gpt_content)
            : job.gpt_content;
      } catch (e) {
        totalSkipped++;
        continue;
      }

      const salary = parsed?.salary;
      if (
        !salary ||
        salary === '' ||
        salary === 'N/A' ||
        salary === 'Not specified'
      ) {
        totalSkipped++;
        continue;
      }

      const result = normalizeSalary(salary, EXCHANGE_RATES);

      if (result.salaryUsd === null) {
        totalSkipped++;
        continue;
      }

      updates.push({
        id: job.id,
        salary_usd: result.salaryUsd,
        salary_min: result.salaryMin,
        salary_max: result.salaryMax,
        salary_currency: result.salaryCurrency,
      });
    }

    // Batch update
    if (updates.length > 0) {
      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('jobs')
          .update({
            salary_usd: update.salary_usd,
            salary_min: update.salary_min,
            salary_max: update.salary_max,
            salary_currency: update.salary_currency,
          })
          .eq('id', update.id);

        if (updateError) {
          console.error(
            `Error updating job ${update.id}:`,
            updateError.message
          );
          totalErrors++;
        } else {
          totalUpdated++;
        }
      }

      console.log(`  Updated ${updates.length} jobs in this batch`);
    }

    offset += batchSize;

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log('\n=== Backfill Complete ===');
  console.log(`Total processed: ${totalProcessed}`);
  console.log(`Total updated: ${totalUpdated}`);
  console.log(`Total skipped (no salary): ${totalSkipped}`);
  console.log(`Total errors: ${totalErrors}`);
}

async function verifySampleResults() {
  console.log('\n=== Verifying sample results ===\n');

  const { data: samples, error } = await supabase
    .from('jobs')
    .select(
      'id, salary_usd, salary_min, salary_max, salary_currency, gpt_content'
    )
    .not('salary_usd', 'is', null)
    .limit(10);

  if (error) {
    console.error('Error fetching samples:', error);
    return;
  }

  for (const job of samples) {
    let parsed;
    try {
      parsed =
        typeof job.gpt_content === 'string'
          ? JSON.parse(job.gpt_content)
          : job.gpt_content;
    } catch {
      continue;
    }

    console.log(`Job #${job.id}:`);
    console.log(`  Original: "${parsed?.salary}"`);
    console.log(`  Normalized: $${job.salary_usd?.toLocaleString()} USD`);
    console.log(
      `  Range: $${job.salary_min?.toLocaleString()} - $${job.salary_max?.toLocaleString()}`
    );
    console.log(`  Currency: ${job.salary_currency}`);
    console.log('');
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--migration-info')) {
    await runMigration();
    return;
  }

  if (args.includes('--verify')) {
    await verifySampleResults();
    return;
  }

  // Default: run backfill
  console.log('Starting salary normalization backfill...');
  console.log(
    'Exchange rates:',
    Object.keys(EXCHANGE_RATES).length,
    'currencies'
  );
  console.log('');

  await backfillSalaries();
  await verifySampleResults();
}

main().catch(console.error);
