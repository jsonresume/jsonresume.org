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

const resume = JSON.parse(fs.readFileSync('resume.json', 'utf8'));
const job = JSON.parse(fs.readFileSync('job.json', 'utf8'));

// Extract unique companies from work experience
const companies = resume.work?.reduce((acc, work) => {
  if (work.name && !acc[work.name]) {
    acc[work.name] = { 
      name: work.name, 
      url: work.url || null,
      position: work.position,
      startDate: work.startDate,
      endDate: work.endDate
    };
  }
  return acc;
}, {});

// Add the company from the job posting
if (job.company) {
  companies[job.company] = { 
    name: job.company, 
    url: job.url || null,
    position: job.title,
    type: job.type,
    remote: job.remote
  };
}

console.log('🏢 Companies found:', Object.keys(companies));

// Function to fetch company data from Perplexity
async function getCompanyData(companyName) {
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
    console.log(`📤 Sending request for ${companyName}...`);
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
    console.log(`✅ Got data for ${companyName}`);
    return data;
  } catch (error) {
    console.error(`Error fetching data for ${companyName}:`, error);
    return null;
  }
}

// Load existing company data if available
let companyData = {};
try {
  companyData = JSON.parse(fs.readFileSync('companyData.json', 'utf8'));
  console.log('📚 Loaded existing company data');
  
  // Log which companies we already have data for
  const existingCompanies = Object.keys(companyData);
  if (existingCompanies.length > 0) {
    console.log('📋 Already have data for:', existingCompanies.join(', '));
  }
} catch (error) {
  console.log('📝 Creating new company data file');
}

// Fetch data for each company
async function fetchAllCompanyData() {
  for (const [companyName, companyInfo] of Object.entries(companies)) {
    if (!companyData[companyName]) {
      console.log(`🔍 Fetching data for ${companyName}...`);
      const data = await getCompanyData(companyName);
      if (data) {
        companyData[companyName] = {
          ...data,
          ...companyInfo, // Include all company info from resume/job
          lastUpdated: new Date().toISOString()
        };
        // Save after each successful fetch to prevent data loss
        fs.writeFileSync('companyData.json', JSON.stringify(companyData, null, 2));
      }
      // Add a small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      console.log(`✓ Already have data for ${companyName}`);
      // Update the existing data with any new company info
      companyData[companyName] = {
        ...companyData[companyName],
        ...companyInfo,
        lastUpdated: companyData[companyName].lastUpdated // Preserve the original fetch date
      };
      fs.writeFileSync('companyData.json', JSON.stringify(companyData, null, 2));
    }
  }
}

// Fetch company data before proceeding with the resume analysis
await fetchAllCompanyData();
console.log('✅ Company data collection complete');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const messages = [
  {
    role: 'system',
    content: `You are an expert recruiter AI that evaluates resumes against job descriptions. 
    You will analyze the provided resume and job description to determine how well the candidate matches the position.
    Consider factors like:
    - Skills and technical expertise match
    - Experience level alignment
    - Industry knowledge
    - Leadership capabilities (if required)
    - Education and certifications
    Return a score and detailed explanation of your evaluation.`,
  },
  {
    role: 'user',
    content: `Please evaluate this candidate's resume for the following job position:

    RESUME:
    ${JSON.stringify(resume, null, 2)}

    JOB DESCRIPTION:
    ${JSON.stringify(job, null, 2)}
    
    Analyze the match and provide a score.`,
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
    },
    required: ['score', 'explanation', 'keyMatches', 'gapsIdentified'],
  },
};

const chat = await openai.chat.completions.create({
  model: 'gpt-4',
  temperature: 0.75,
  messages,
  functions: [scoreFunction],
  function_call: { name: 'calculateMatchScore' },
});

const result = JSON.parse(chat.choices[0].message.function_call.arguments);
console.log(result);
