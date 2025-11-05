/**
 * Company enrichment module using Perplexity AI
 * Generates comprehensive company dossiers with industry info, funding, culture, and recent news
 */

/**
 * Get comprehensive company information from Perplexity AI
 * @param {string} companyName - Name of the company to enrich
 * @param {string} apiKey - Perplexity API key
 * @param {Object} context - Additional context (locations, positions) for disambiguation
 * @returns {Promise<Object>} Perplexity API response with company dossier
 */
async function enrichCompany(companyName, apiKey, context = {}) {
  console.log(`🔍 Enriching company: ${companyName}`);

  // Build context hint for disambiguation
  let contextHint = '';
  if (context.locations && context.locations.length > 0) {
    const topLocations = context.locations.slice(0, 5).join(', ');
    contextHint += `\nCommon locations where employees worked: ${topLocations}`;
  }
  if (context.positions && context.positions.length > 0) {
    const topPositions = context.positions.slice(0, 5).join(', ');
    contextHint += `\nCommon positions held: ${topPositions}`;
  }

  const prompt = `Generate a comprehensive company dossier for: ${companyName}${
    contextHint ? `\n${contextHint}` : ''
  }

Please provide the following information in a structured format using markdown:

## Company Overview
- Full legal name and common name
- Industry and sector
- Headquarters location
- Founded year
- Company size (employees)
- Company stage (startup, scaleup, public, etc.)

## Business Model & Products
- Primary products or services
- Target market and customers
- Key value propositions
- Revenue model

## Market Position
- Market share and competitors
- Notable achievements or milestones
- Growth trajectory

## Technology & Stack
- Core technologies used
- Engineering culture
- Notable technical innovations

## Company Culture & Values
- Mission and vision
- Core values
- Work environment and culture
- Benefits and perks (if publicly known)

## Funding & Financial
- Funding rounds and total raised (if applicable)
- Key investors
- Valuation (if publicly known)
- Financial performance indicators

## Recent News & Developments
- Recent product launches
- Company announcements
- Press coverage (last 6 months)
- Notable hires or leadership changes

Keep the dossier factual, concise, and professional. If information is not publicly available, state "Information not publicly available" rather than speculating.`;

  const requestBody = {
    model: 'sonar-pro',
    messages: [
      {
        role: 'system',
        content:
          'You are a professional business analyst creating detailed company dossiers. Provide accurate, well-structured information based on publicly available data. Use markdown formatting.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    max_tokens: 3000,
    temperature: 0.3, // Lower temperature for more factual, consistent responses
    top_p: 0.9,
    search_domain_filter: null,
    return_images: false,
    return_related_questions: false,
    search_recency_filter: 'year', // Focus on recent information
    top_k: 0,
    stream: false,
    presence_penalty: 0,
    frequency_penalty: 1,
  };

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  };

  const response = await fetch(
    'https://api.perplexity.ai/chat/completions',
    options
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ Perplexity API Error (${response.status}):`, errorText);
    throw new Error(
      `Perplexity API request failed with status ${response.status}: ${errorText}`
    );
  }

  const data = await response.json();

  // Validate response structure
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid response structure from Perplexity API');
  }

  console.log(
    `✅ Successfully enriched ${companyName} (${
      data.usage?.total_tokens || 'unknown'
    } tokens)`
  );

  return data;
}

/**
 * Normalize company name for deduplication
 * @param {string} name - Company name
 * @returns {string} Normalized name (lowercase, trimmed, common suffixes removed)
 */
function normalizeCompanyName(name) {
  if (!name) return '';

  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/\b(inc|llc|ltd|corp|corporation|company|co)\b\.?$/i, '') // Remove common suffixes
    .trim();
}

module.exports = {
  enrichCompany,
  normalizeCompanyName,
};
