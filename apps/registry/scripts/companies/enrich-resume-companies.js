#!/usr/bin/env node
/**
 * Enrich resume companies with Perplexity AI
 * Processes companies that need enrichment (never enriched or >1 year old)
 * Uses batching and error handling for production reliability
 */

const path = require('path');
const fs = require('fs');

// Try to load .env from multiple locations (monorepo root or apps/registry)
const envPaths = [
  path.resolve(__dirname, '../../../../.env'), // Monorepo root
  path.resolve(__dirname, '../../.env'), // apps/registry
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    break;
  }
}
const { createClient } = require('@supabase/supabase-js');
const async = require('async');
const { enrichCompany } = require('./enrichCompany');

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuration
const MAX_RETRIES = 3;
const CONCURRENCY = 2; // Process 2 companies at a time to avoid rate limits
const BATCH_SIZE = 50; // Process in batches of 50 companies

/**
 * Get count of companies needing enrichment
 * @returns {Promise<number>} Total count of companies needing enrichment
 */
async function getUnenrichedCount() {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const { count, error } = await supabase
    .from('resume_companies')
    .select('*', { count: 'exact', head: true })
    .or(`enriched_at.is.null,enriched_at.lt.${oneYearAgo.toISOString()}`)
    .lt('retry_count', MAX_RETRIES);

  if (error) {
    throw new Error(`Failed to get count: ${error.message}`);
  }

  return count || 0;
}

/**
 * Fetch companies that need enrichment
 * @param {number} limit - Maximum number of companies to fetch
 * @returns {Promise<Array>} Array of companies needing enrichment
 */
async function fetchCompaniesNeedingEnrichment(limit = BATCH_SIZE) {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const { data, error } = await supabase
    .from('resume_companies')
    .select(
      'id, name, normalized_name, enriched_at, retry_count, resume_count, context_data'
    )
    .or(`enriched_at.is.null,enriched_at.lt.${oneYearAgo.toISOString()}`)
    .lt('retry_count', MAX_RETRIES)
    .order('resume_count', { ascending: false }) // Prioritize popular companies
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch companies: ${error.message}`);
  }

  return data || [];
}

/**
 * Save enrichment data for a company
 * @param {number} companyId - Company ID
 * @param {Object} enrichmentData - Perplexity API response
 * @returns {Promise<boolean>} Success status
 */
async function saveEnrichmentData(companyId, enrichmentData) {
  const { error } = await supabase
    .from('resume_companies')
    .update({
      enrichment_data: enrichmentData,
      enriched_at: new Date().toISOString(),
      error_message: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', companyId);

  if (error) {
    console.error(
      `❌ Failed to save enrichment for company ${companyId}:`,
      error
    );
    return false;
  }

  return true;
}

/**
 * Mark a company enrichment as failed
 * @param {number} companyId - Company ID
 * @param {string} errorMessage - Error message
 * @returns {Promise<boolean>} Success status
 */
async function markEnrichmentFailed(companyId, errorMessage) {
  const { error } = await supabase
    .from('resume_companies')
    .update({
      error_message: errorMessage,
      retry_count: supabase.rpc('increment_retry_count', {
        company_id: companyId,
      }),
      updated_at: new Date().toISOString(),
    })
    .eq('id', companyId);

  if (error) {
    console.error(`❌ Failed to mark failure for company ${companyId}:`, error);
    return false;
  }

  return true;
}

/**
 * Process a single company enrichment
 * @param {Object} company - Company record from database
 * @returns {Promise<void>}
 */
async function processCompany(company) {
  const isRefresh = company.enriched_at !== null;
  const action = isRefresh ? 'Refreshing' : 'Enriching';

  console.log(
    `\n🔄 ${action} ${company.name} (${company.resume_count} resumes)${
      isRefresh
        ? ` - last enriched ${new Date(
            company.enriched_at
          ).toLocaleDateString()}`
        : ''
    }`
  );

  try {
    // Call Perplexity API with context
    const enrichmentData = await enrichCompany(
      company.name,
      perplexityApiKey,
      company.context_data
    );

    // Save to database
    const success = await saveEnrichmentData(company.id, enrichmentData);

    if (success) {
      console.log(
        `  ✅ Successfully ${isRefresh ? 'refreshed' : 'enriched'} ${
          company.name
        }`
      );
    } else {
      throw new Error('Failed to save enrichment data');
    }
  } catch (error) {
    console.error(
      `  ❌ Error ${action.toLowerCase()} ${company.name}:`,
      error.message
    );

    // Mark as failed
    await markEnrichmentFailed(company.id, error.message);
  }
}

async function main() {
  console.log('\n🏢 Resume Company Enrichment System');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Validate API key
  if (!perplexityApiKey) {
    console.error('❌ PERPLEXITY_API_KEY environment variable is not set');
    console.error('   Please add it to apps/registry/.env');
    process.exit(1);
  }

  // Parse command line arguments for limit parameter
  const args = process.argv.slice(2);
  const limitArg = args.find((arg) => arg.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : BATCH_SIZE;

  if (limitArg) {
    console.log(`🔧 Using custom limit: ${limit} companies\n`);
  }

  // Get total count of unenriched companies for cost estimation
  console.log('📊 Checking total unenriched companies...');
  const totalUnenriched = await getUnenrichedCount();

  if (totalUnenriched === 0) {
    console.log('✨ All companies are up to date!\n');
    return;
  }

  // Fetch batch to process
  console.log('📊 Fetching companies needing enrichment...');
  const companies = await fetchCompaniesNeedingEnrichment(limit);

  const newCompanies = companies.filter((c) => !c.enriched_at).length;
  const refreshCompanies = companies.filter((c) => c.enriched_at).length;

  console.log(`📊 Total unenriched companies in database: ${totalUnenriched}`);
  console.log(`📊 Will process ${companies.length} companies in this batch:`);
  console.log(`   - ${newCompanies} new companies`);
  console.log(
    `   - ${refreshCompanies} companies needing refresh (>1 year old)`
  );
  console.log(`⚙️  Processing up to ${CONCURRENCY} companies concurrently\n`);

  // Calculate estimated cost for ALL unenriched companies
  // Perplexity sonar-pro pricing (as of Nov 2024):
  // - Input: $3 per 1M tokens
  // - Output: $15 per 1M tokens
  // - Request fee (medium context): $10 per 1K requests
  const avgPromptTokens = 350; // Estimated prompt size with context
  const avgOutputTokens = 2000; // Estimated output (comprehensive dossier)
  const totalInputTokens = totalUnenriched * avgPromptTokens;
  const totalOutputTokens = totalUnenriched * avgOutputTokens;
  const inputCost = (totalInputTokens / 1_000_000) * 3;
  const outputCost = (totalOutputTokens / 1_000_000) * 15;
  const requestCost = (totalUnenriched / 1000) * 10; // Medium context
  const totalEstimatedCost = inputCost + outputCost + requestCost;

  // Calculate cost for this batch
  const batchInputTokens = companies.length * avgPromptTokens;
  const batchOutputTokens = companies.length * avgOutputTokens;
  const batchInputCost = (batchInputTokens / 1_000_000) * 3;
  const batchOutputCost = (batchOutputTokens / 1_000_000) * 15;
  const batchRequestCost = (companies.length / 1000) * 10;
  const batchEstimatedCost =
    batchInputCost + batchOutputCost + batchRequestCost;

  console.log('💰 Estimated Cost Analysis:');
  console.log('\n📊 Total Cost (all unenriched companies):');
  console.log(
    `   - Input tokens: ~${totalInputTokens.toLocaleString()} ($${inputCost.toFixed(
      2
    )})`
  );
  console.log(
    `   - Output tokens: ~${totalOutputTokens.toLocaleString()} ($${outputCost.toFixed(
      2
    )})`
  );
  console.log(
    `   - Request fees: ${totalUnenriched} requests ($${requestCost.toFixed(
      2
    )})`
  );
  console.log(
    `   - TOTAL for all ${totalUnenriched} companies: $${totalEstimatedCost.toFixed(
      2
    )}`
  );

  console.log('\n📦 This Batch Cost:');
  console.log(
    `   - Input tokens: ~${batchInputTokens.toLocaleString()} ($${batchInputCost.toFixed(
      2
    )})`
  );
  console.log(
    `   - Output tokens: ~${batchOutputTokens.toLocaleString()} ($${batchOutputCost.toFixed(
      2
    )})`
  );
  console.log(
    `   - Request fees: ${
      companies.length
    } requests ($${batchRequestCost.toFixed(2)})`
  );
  console.log(
    `   - BATCH cost for ${
      companies.length
    } companies: $${batchEstimatedCost.toFixed(2)}\n`
  );

  // Check for --yes flag to skip confirmation
  const yesFlag = args.includes('--yes') || args.includes('-y');

  if (!yesFlag) {
    // Prompt for confirmation
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const answer = await new Promise((resolve) => {
      readline.question(
        '❓ Do you want to proceed with enrichment? (yes/no): ',
        resolve
      );
    });

    readline.close();

    if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
      console.log('\n❌ Enrichment cancelled by user\n');
      process.exit(0);
    }

    console.log('');
  } else {
    console.log('✅ Auto-confirmed with --yes flag\n');
  }

  // Process companies with concurrency control
  let successCount = 0;
  let errorCount = 0;

  await async.eachLimit(companies, CONCURRENCY, async (company) => {
    try {
      await processCompany(company);
      successCount++;
    } catch (error) {
      errorCount++;
      console.error(`  ✗ Failed to process ${company.name}:`, error.message);
    }

    // Small delay to respect rate limits
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Successfully enriched ${successCount} companies`);
  if (errorCount > 0) {
    console.log(`❌ Failed to enrich ${errorCount} companies`);
  }
  console.log('✨ Company enrichment complete!\n');
}

main().catch((error) => {
  console.error('🚨 Fatal error:', error);
  process.exit(1);
});
