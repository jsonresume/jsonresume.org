import OpenAI from 'openai';
import fetch from 'node-fetch';

// Helper function to extract domain from URL
function extractDomain(url) {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch (error) {
    console.error('❌ Invalid URL:', url, error);
    return null;
  }
}

// Extract companies from resume and job
function extractCompanies(resume, job) {
  console.log('🏢 Extracting companies from resume and job posting');
  const companies = {};

  // Extract from resume work experience
  resume.work?.forEach(work => {
    if (work.name) {
      const url = work.website || work.url;
      const domain = extractDomain(url);
      const key = domain || work.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!companies[key]) {
        companies[key] = {
          name: work.name,
          url: url,
          domain: domain,
          position: work.position,
          startDate: work.startDate,
          endDate: work.endDate,
        };
        console.log('📍 Found company in resume:', { name: work.name, domain });
      }
    }
  });

  // Add job company
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
    console.log('💼 Added job posting company:', { name: job.company, domain });
  }

  console.log('🏢 Total companies found:', Object.keys(companies).length);
  return companies;
}

// Fetch company data from Perplexity
async function getCompanyData(companyName, existingUrl = null) {
  console.log('🔍 Fetching data for company:', companyName);
  
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

  try {
    console.log('🌐 Sending Perplexity API request for:', companyName);
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API Error (${response.status})`);
    }

    const data = await response.json();
    console.log('✅ Received Perplexity response for:', companyName);

    const content = data.choices[0]?.message?.content || '';
    const websiteMatch = content.match(/## Website\s*\n(https?:\/\/[^\s\n]+)/);
    const websiteUrl = websiteMatch?.[1] || existingUrl;
    const domain = extractDomain(websiteUrl);

    console.log('🔗 Extracted website info:', { 
      company: companyName, 
      url: websiteUrl, 
      domain 
    });

    return {
      ...data,
      extractedUrl: websiteUrl,
      domain: domain,
    };
  } catch (error) {
    console.error('❌ Error fetching company data:', error);
    console.error('Error stack:', error.stack);
    return null;
  }
}

// Extract insights from company data
function extractCompanyInsights(companyData) {
  console.log('📊 Extracting insights from company data');
  const insights = {};
  
  for (const [domain, data] of Object.entries(companyData)) {
    if (data.choices?.[0]?.message?.content) {
      const content = data.choices[0].message.content;
      insights[domain] = {
        name: data.name,
        description: content.match(/## Description\n\n([^#]+)/)?.[1]?.trim(),
        workLife: content.match(/## Work life conditions\n\n([^#]+)/)?.[1]?.trim(),
        recentNews: content.match(/## Recent News\n\n([^#]+)/)?.[1]?.trim(),
        url: data.url,
        position: data.position,
        startDate: data.startDate,
        endDate: data.endDate,
        type: data.type,
        remote: data.remote,
      };
      console.log('✨ Extracted insights for:', data.name);
    }
  }

  console.log('📊 Total insights extracted:', Object.keys(insights).length);
  return insights;
}

// Main scoring function
export async function scoreResume(resume, job) {
  console.log('🎯 Starting resume scoring process');
  console.time('scoreResume');
  
  try {
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('✅ OpenAI client initialized');

    // Extract and fetch company data
    const companies = extractCompanies(resume, job);
    let companyData = {};

    // Only fetch company data if PERPLEXITY_API_KEY is available
    if (process.env.PERPLEXITY_API_KEY) {
      console.log('🔄 Starting company data collection');
      for (const [key, companyInfo] of Object.entries(companies)) {
        const data = await getCompanyData(companyInfo.name, companyInfo.url);
        if (data) {
          const finalKey = companyInfo.domain || data.domain || key;
          companyData[finalKey] = {
            ...data,
            ...companyInfo,
            url: companyInfo.url || data.extractedUrl,
          };
          console.log('✅ Collected data for:', companyInfo.name);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      console.log('✨ Company data collection complete');
    } else {
      console.log('ℹ️ Skipping company data collection - No Perplexity API key');
    }

    const companyInsights = extractCompanyInsights(companyData);

    console.log('🤖 Preparing GPT analysis');
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
        6. Company-Specific Requirements`,
      },
      {
        role: 'user',
        content: `Please evaluate this candidate for the following position:

        RESUME:
        ${JSON.stringify(resume, null, 2)}

        JOB DESCRIPTION:
        ${JSON.stringify(job, null, 2)}
        
        ${Object.keys(companyInsights).length > 0 ? `
        COMPANY INSIGHTS:
        ${JSON.stringify(companyInsights, null, 2)}
        ` : ''}

        Consider the following in your analysis:
        1. ${Object.keys(companyInsights).length > 0 ? `The candidate's experience at ${Object.values(companyInsights).map(c => c.name).join(', ')}` : 'The candidate\'s experience'}
        2. Work culture fit
        3. Technical requirements and experience
        4. Career progression and growth potential
        5. Remote work experience (${job.remote === 'Full' ? 'this is a fully remote position' : 'this is an office-based position'})`,
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
            items: { type: 'string' },
            description: 'Key matching points between the resume and job',
          },
          gapsIdentified: {
            type: 'array',
            items: { type: 'string' },
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
                items: { type: 'string' },
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

    console.log('🚀 Sending request to OpenAI');
    const chat = await openai.chat.completions.create({
      model: 'gpt-4',
      temperature: 0.75,
      messages,
      functions: [scoreFunction],
      function_call: { name: 'calculateMatchScore' }
    });

    console.log('📊 Token usage:', {
      prompt_tokens: chat.usage.prompt_tokens,
      completion_tokens: chat.usage.completion_tokens,
      total_tokens: chat.usage.total_tokens
    });

    const result = JSON.parse(chat.choices[0].message.function_call.arguments);
    console.log('✅ Analysis complete with score:', result.score);
    console.timeEnd('scoreResume');
    
    return result;
  } catch (error) {
    console.error('❌ Error in scoreResume:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
}
