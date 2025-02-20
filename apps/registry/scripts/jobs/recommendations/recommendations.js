import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';
import OpenAI from 'openai';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../../../.env') });

/*
jsonresume resume.json

1. parse the resume and extract the companies that you have worked at
2. use perplexity to look up the actual companies find out exactly what they do and recent news about them
3. turn the job.json into real literal text

- send to ai the resume and job and ask it to return a structured response such as { score: 0.65 }

notes:
 - vector simalarity works better on unstructured text 
*/

// Helper function to extract domain from URL
function extractDomain(url) {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch (error) {
    console.error(`Invalid URL: ${url}`);
    return null;
  }
}

const resume = JSON.parse(fs.readFileSync('resume.json', 'utf8'));
const job = JSON.parse(fs.readFileSync('job.json', 'utf8'));

// Extract unique companies from work experience
const companies = resume.work?.reduce((acc, work) => {
  if (work.name) {
    const url = work.website || work.url;
    const domain = extractDomain(url);
    const key = domain || work.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!acc[key]) {
      acc[key] = {
        name: work.name,
        url: url,
        domain: domain,
        position: work.position,
        startDate: work.startDate,
        endDate: work.endDate,
      };
    }
  }
  return acc;
}, {});

// Add the company from the job posting
if (job.company) {
  const domain = extractDomain(job.url);
  const key = domain || job.company.toLowerCase().replace(/[^a-z0-9]/g, '');
  companies[key] = {
    name: job.company,
    url: job.url,
    domain: domain,
    position: job.title,
    type: job.type,
    remote: job.remote,
  };
}

console.log(' Companies found:', Object.keys(companies));

// Function to fetch company data from Perplexity
async function getCompanyData(companyName, existingUrl = null) {
  const requestBody = {
    model: 'sonar-pro',
    messages: [
      {
        role: 'user',
        content: `For the company "${companyName}", provide:
1. A brief description of what they do
2. Recent news
3. Work life conditions
4. Their official website URL

Format the response in markdown with these exact headings:
## Description
## Recent News
## Work life conditions
## Website
[only include the direct URL, nothing else]`,
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

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(requestBody),
  };

  try {
    console.log(` Sending request for ${companyName}...`);
    const response = await fetch(
      'https://api.perplexity.ai/chat/completions',
      options,
    );

    if (!response.ok) {
      const text = await response.text();
      console.error(`API Error (${response.status}):`, text);
      return null;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Invalid content type:', contentType);
      const text = await response.text();
      console.error('Response body:', text);
      return null;
    }

    const data = await response.json();

    // Extract URL from the response
    const content = data.choices[0]?.message?.content || '';
    const websiteMatch = content.match(/## Website\s*\n(https?:\/\/[^\s\n]+)/);
    const websiteUrl = websiteMatch?.[1] || existingUrl;

    // Get domain from the URL
    const domain = extractDomain(websiteUrl);

    console.log(` Got data for ${companyName}${domain ? ` (${domain})` : ''}`);
    return {
      ...data,
      extractedUrl: websiteUrl,
      domain: domain,
    };
  } catch (error) {
    console.error(`Error fetching data for ${companyName}:`, error);
    return null;
  }
}

// Load existing company data if available
let companyData = {};
try {
  companyData = JSON.parse(fs.readFileSync('companyData.json', 'utf8'));
  console.log(' Loaded existing company data');

  // Log which companies we already have data for
  const existingCompanies = Object.keys(companyData);
  if (existingCompanies.length > 0) {
    console.log(' Already have data for:', existingCompanies.join(', '));
  }
} catch (error) {
  console.log(' Creating new company data file');
}

// Fetch data for each company
async function fetchAllCompanyData() {
  for (const [key, companyInfo] of Object.entries(companies)) {
    const existingData = companyData[key];
    if (!existingData) {
      console.log(` Fetching data for ${companyInfo.name}...`);
      const data = await getCompanyData(companyInfo.name, companyInfo.url);
      if (data) {
        // Use the domain from the API response if we don't have one
        const finalKey = companyInfo.domain || data.domain || key;
        companyData[finalKey] = {
          ...data,
          ...companyInfo,
          url: companyInfo.url || data.extractedUrl,
          lastUpdated: new Date().toISOString(),
        };
        // Save after each successful fetch to prevent data loss
        fs.writeFileSync(
          'companyData.json',
          JSON.stringify(companyData, null, 2),
        );
      }
      // Add a small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } else {
      console.log(` Already have data for ${companyInfo.name}`);
      // Update the existing data with any new company info
      companyData[key] = {
        ...existingData,
        ...companyInfo,
        lastUpdated: existingData.lastUpdated, // Preserve the original fetch date
      };
      fs.writeFileSync(
        'companyData.json',
        JSON.stringify(companyData, null, 2),
      );
    }
  }
}

// Fetch company data before proceeding with the resume analysis
await fetchAllCompanyData();
console.log(' Company data collection complete');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to extract relevant text from company data
function extractCompanyInsights(companyData) {
  const insights = {};
  for (const [domain, data] of Object.entries(companyData)) {
    if (data.choices?.[0]?.message?.content) {
      const content = data.choices[0].message.content;
      insights[domain] = {
        name: data.name,
        description: content.match(/## Description\n\n([^#]+)/)?.[1]?.trim(),
        workLife: content
          .match(/## Work life conditions\n\n([^#]+)/)?.[1]
          ?.trim(),
        recentNews: content.match(/## Recent News\n\n([^#]+)/)?.[1]?.trim(),
        url: data.url,
        position: data.position,
        startDate: data.startDate,
        endDate: data.endDate,
        type: data.type,
        remote: data.remote,
      };
    }
  }
  return insights;
}

const companyInsights = extractCompanyInsights(companyData);

const messages = [
  {
    role: 'system',
    content: `You are an expert recruiter AI that evaluates resumes against job descriptions. 
    You will analyze the provided resume, job description, and detailed company information to determine how well the candidate matches the position.
    Consider:
    1. Technical Skills Match
    2. Experience Level & Seniority
    3. Industry Knowledge & Company Culture Fit
    4. Remote Work Experience (if applicable)
    5. Career Progression & Growth
    6. Company-Specific Requirements
    
    Provide a detailed analysis with a confidence score.`,
  },
  {
    role: 'user',
    content: `Please evaluate this candidate for the following position:

    RESUME:
    ${JSON.stringify(resume, null, 2)}

    JOB DESCRIPTION:
    ${JSON.stringify(job, null, 2)}
    
    COMPANY INSIGHTS:
    ${JSON.stringify(companyInsights, null, 2)}

    Consider the following in your analysis:
    1. The candidate's experience at ${Object.values(companyInsights)
      .map((c) => c.name)
      .join(', ')}
    2. Work culture fit based on the company insights
    3. Technical requirements and experience
    4. Career progression and growth potential
    5. Remote work experience (${job.remote === 'Full' ? 'this is a fully remote position' : 'this is an office-based position'})
    
    Analyze the match and provide a detailed score.`,
  },
];

const scoreFunction = {
  name: 'calculateMatchScore',
  description: 'Calculate a match score between a resume and job description',
  parameters: {
    type: 'object',
    properties: {
      score: {
        type: 'number',
        description: 'Match score between 0 and 1, where 1 is a perfect match',
      },
      explanation: {
        type: 'string',
        description: 'Detailed explanation of the score',
      },
      keyMatches: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Key matching points between the resume and job',
      },
      gapsIdentified: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Areas where the candidate may need improvement',
      },
      cultureFit: {
        type: 'object',
        properties: {
          score: {
            type: 'number',
            description: 'Culture fit score between 0 and 1',
          },
          reasons: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'Reasons for the culture fit score',
          },
        },
        required: ['score', 'reasons'],
      },
      remoteWorkReadiness: {
        type: 'object',
        properties: {
          score: {
            type: 'number',
            description: 'Remote work readiness score between 0 and 1',
          },
          analysis: {
            type: 'string',
            description: 'Analysis of remote work capabilities',
          },
        },
        required: ['score', 'analysis'],
      },
    },
    required: [
      'score',
      'explanation',
      'keyMatches',
      'gapsIdentified',
      'cultureFit',
      'remoteWorkReadiness',
    ],
  },
};

const chat = await openai.chat.completions.create({
  model: 'gpt-4o',
  temperature: 0.75,
  messages,
  functions: [scoreFunction],
});

// Log token usage
console.log('\nToken Usage:');
console.log('Prompt tokens:', chat.usage.prompt_tokens);
console.log('Completion tokens:', chat.usage.completion_tokens);
console.log('Total tokens:', chat.usage.total_tokens);
console.log('\nMessages:');
console.log(JSON.stringify(messages, null, 2));

const result = JSON.parse(chat.choices[0].message.function_call.arguments);
console.log('\nResult:');
console.log(result);
