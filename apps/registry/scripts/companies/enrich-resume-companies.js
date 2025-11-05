#!/usr/bin/env node
/**
 * Enrich resume companies with Perplexity AI
 * Processes companies that need enrichment (never enriched or >1 year old)
 * Uses batching and error handling for production reliability
 */

require('dotenv').config({ path: __dirname + '/./../../.env' });
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

  // Fetch companies needing enrichment
  console.log('📊 Fetching companies needing enrichment...');
  const companies = await fetchCompaniesNeedingEnrichment(limit);

  if (companies.length === 0) {
    console.log('✨ All companies are up to date!\n');
    return;
  }

  const newCompanies = companies.filter((c) => !c.enriched_at).length;
  const refreshCompanies = companies.filter((c) => c.enriched_at).length;

  console.log(`📊 Found ${companies.length} companies to process:`);
  console.log(`   - ${newCompanies} new companies`);
  console.log(
    `   - ${refreshCompanies} companies needing refresh (>1 year old)`
  );
  console.log(`⚙️  Processing up to ${CONCURRENCY} companies concurrently\n`);

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
