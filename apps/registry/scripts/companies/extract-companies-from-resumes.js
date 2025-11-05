#!/usr/bin/env node
/**
 * Extract companies from all resumes and populate resume_companies tracking table
 * This script should be run periodically to discover new companies from updated resumes
 */

const path = require('path');
const fs = require('fs');

// Try to load .env from multiple locations (monorepo root or apps/registry)
const envPaths = [
  path.resolve(__dirname, '../../../.env'), // Monorepo root
  path.resolve(__dirname, '../../.env'), // apps/registry
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    break;
  }
}
const { createClient } = require('@supabase/supabase-js');
const { normalizeCompanyName } = require('./enrichCompany');

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Extract company names with location context from a resume's work history
 * @param {Object} resume - Resume JSON object
 * @returns {Map<string, Object>} Map of company name to context (locations, positions)
 */
function extractCompaniesFromResume(resume) {
  const companies = new Map();

  if (!resume || !resume.work || !Array.isArray(resume.work)) {
    return companies;
  }

  resume.work.forEach((job) => {
    if (job.company && typeof job.company === 'string' && job.company.trim()) {
      const companyName = job.company.trim();

      if (!companies.has(companyName)) {
        companies.set(companyName, {
          locations: new Set(),
          positions: new Set(),
        });
      }

      const context = companies.get(companyName);

      // Add location if available
      if (job.location) {
        context.locations.add(job.location);
      }

      // Add position if available
      if (job.position) {
        context.positions.add(job.position);
      }
    }
  });

  return companies;
}

/**
 * Upsert a company into the resume_companies table
 * @param {string} companyName - Company name
 * @param {Object} context - Company context (locations, positions)
 * @returns {Promise<boolean>} Success status
 */
async function upsertCompany(companyName, context = {}) {
  const normalizedName = normalizeCompanyName(companyName);

  if (!normalizedName) {
    console.warn(`⚠️ Skipping empty company name`);
    return false;
  }

  // Convert Sets to arrays for JSON storage
  const contextData = {
    locations: context.locations ? Array.from(context.locations) : [],
    positions: context.positions ? Array.from(context.positions) : [],
  };

  try {
    // First try to get existing record
    const { data: existing } = await supabase
      .from('resume_companies')
      .select('id, context_data, resume_count')
      .eq('normalized_name', normalizedName)
      .single();

    if (existing) {
      // Merge context data
      const existingLocations = new Set(existing.context_data?.locations || []);
      const existingPositions = new Set(existing.context_data?.positions || []);

      contextData.locations.forEach((loc) => existingLocations.add(loc));
      contextData.positions.forEach((pos) => existingPositions.add(pos));

      const mergedContext = {
        locations: Array.from(existingLocations),
        positions: Array.from(existingPositions),
      };

      // Update with merged context and increment count
      const { error: updateError } = await supabase
        .from('resume_companies')
        .update({
          resume_count: existing.resume_count + 1,
          context_data: mergedContext,
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error(
          `❌ Error updating ${companyName}:`,
          JSON.stringify(updateError, null, 2)
        );
        return false;
      }
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('resume_companies')
        .insert({
          name: companyName,
          normalized_name: normalizedName,
          resume_count: 1,
          context_data: contextData,
        });

      if (insertError) {
        console.error(
          `❌ Error inserting ${companyName}:`,
          JSON.stringify(insertError, null, 2)
        );
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error(
      `❌ Error processing ${companyName}:`,
      error.message || JSON.stringify(error, null, 2)
    );
    return false;
  }
}

async function main() {
  console.log('\n🔍 Resume Company Extraction');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Fetch all resumes from Supabase
  console.log('📊 Fetching resumes from database...');

  let allResumes = [];
  let page = 0;
  const pageSize = 1000;
  let hasMore = true;

  while (hasMore) {
    const { data: resumes, error } = await supabase
      .from('resumes')
      .select('resume')
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) {
      console.error('❌ Database error:', error);
      process.exit(1);
    }

    if (!resumes || resumes.length === 0) {
      hasMore = false;
    } else {
      allResumes = allResumes.concat(resumes);
      page++;
      console.log(`  📄 Loaded ${allResumes.length} resumes...`);
    }

    if (resumes && resumes.length < pageSize) {
      hasMore = false;
    }
  }

  console.log(`✅ Loaded ${allResumes.length} total resumes\n`);

  // Extract all companies with context
  console.log('🏢 Extracting companies from resumes...');
  const allCompanies = new Map(); // companyName -> {count, context}

  allResumes.forEach((resume) => {
    try {
      const resumeData =
        typeof resume.resume === 'string'
          ? JSON.parse(resume.resume)
          : resume.resume;

      const companies = extractCompaniesFromResume(resumeData);

      companies.forEach((context, companyName) => {
        if (!allCompanies.has(companyName)) {
          allCompanies.set(companyName, {
            count: 0,
            locations: new Set(),
            positions: new Set(),
          });
        }

        const existing = allCompanies.get(companyName);
        existing.count += 1;

        // Merge locations and positions
        context.locations.forEach((loc) => existing.locations.add(loc));
        context.positions.forEach((pos) => existing.positions.add(pos));
      });
    } catch (error) {
      console.warn('⚠️ Error parsing resume:', error.message);
    }
  });

  const uniqueCompanies = Array.from(allCompanies.keys());
  console.log(`📊 Found ${uniqueCompanies.length} unique companies\n`);

  // Sort by frequency (most common first) for better logging
  const sortedCompanies = uniqueCompanies.sort((a, b) => {
    return allCompanies.get(b).count - allCompanies.get(a).count;
  });

  // Show top 10 most common companies
  console.log('🔝 Top 10 most common companies:');
  sortedCompanies.slice(0, 10).forEach((company, idx) => {
    const data = allCompanies.get(company);
    const locations = Array.from(data.locations).slice(0, 3).join(', ');
    console.log(
      `  ${idx + 1}. ${company} (${data.count} resumes${
        locations ? ` - ${locations}` : ''
      })`
    );
  });
  console.log('');

  // Parse command line arguments for limit parameter
  const args = process.argv.slice(2);
  const limitArg = args.find((arg) => arg.startsWith('--limit='));
  const limit = limitArg
    ? parseInt(limitArg.split('=')[1], 10)
    : sortedCompanies.length;

  const companiesToProcess =
    limit < sortedCompanies.length
      ? sortedCompanies.slice(0, limit)
      : sortedCompanies;

  // Upsert companies into database
  console.log('💾 Upserting companies into database...');
  if (limitArg) {
    console.log(`🔧 Processing only ${limit} companies for testing\n`);
  }
  let successCount = 0;
  let errorCount = 0;

  for (const company of companiesToProcess) {
    const context = allCompanies.get(company);
    const success = await upsertCompany(company, context);
    if (success) {
      successCount++;
      if (successCount % 100 === 0) {
        console.log(
          `  ✓ Processed ${successCount}/${companiesToProcess.length}...`
        );
      }
    } else {
      errorCount++;
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Successfully processed ${successCount} companies`);
  if (errorCount > 0) {
    console.log(`❌ Failed to process ${errorCount} companies`);
  }
  console.log('✨ Company extraction complete!\n');
}

main().catch((error) => {
  console.error('🚨 Fatal error:', error);
  process.exit(1);
});
