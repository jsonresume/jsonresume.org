# JSON Resume Recommendation Engine

## Overview
The recommendation engine analyzes resumes against job postings to provide intelligent job matching and scoring. It enhances the matching process by incorporating rich company data and context through the Perplexity API, providing a comprehensive evaluation of both technical fit and cultural alignment.

## Features

### Company Data Enrichment
- Extracts companies from both resume work history and job postings
- Uses company website domains as unique identifiers for consistent tracking
- Fetches detailed company information using Perplexity API:
  - Company description and background
  - Recent news and developments
  - Work culture and conditions
  - Official website URL
- Caches company data to optimize API usage
- Stores comprehensive context including:
  - Company URLs and domains
  - Position details
  - Employment dates
  - Job types and remote work status

### Data Storage
- Company data is stored in `companyData.json`
- Uses website domains as primary keys (e.g., "neon.tech", "google.com")
- Falls back to normalized company name if no domain is available
- Format:
  ```json
  {
    "company-domain.com": {
      "name": "Company Name",
      "url": "https://company-domain.com",
      "domain": "company-domain.com",
      "position": "string",
      "startDate": "string",
      "endDate": "string",
      "perplexityData": {
        "description": "string",
        "recentNews": "string",
        "workLife": "string"
      },
      "lastUpdated": "string"
    }
  }
  ```

### Resume-Job Matching
- Uses OpenAI GPT-4 for intelligent matching with enhanced context
- Scoring Factors:
  1. Technical Skills Match
  2. Experience Level & Seniority
  3. Industry Knowledge & Company Culture Fit
  4. Remote Work Experience
  5. Career Progression & Growth
  6. Company-Specific Requirements

### Scoring System
- Provides detailed scoring metrics:
  - Overall Match Score (0-1)
  - Culture Fit Score (0-1)
  - Remote Work Readiness Score (0-1)
- Includes detailed analysis:
  - Key matching points
  - Identified gaps
  - Culture fit reasoning
  - Remote work capabilities assessment

## Technical Requirements

### Environment Variables
- `OPENAI_API_KEY`: For GPT-4 analysis
- `PERPLEXITY_API_KEY`: For company research

### Dependencies
- `openai`: OpenAI API client
- `node-fetch`: For making HTTP requests
- `dotenv`: For environment variable management

### API Rate Limiting & Optimization
- Implements delays between Perplexity API calls
- Caches company data to minimize API usage
- Uses OpenAI function calling for structured responses
- Tracks token usage for cost optimization
- Handles API failures gracefully with fallback data

### Error Handling
- Graceful handling of failed API calls
- Fallback to minimal data when API calls fail
- Consistent error logging and reporting
- Domain validation and URL cleaning
- Token usage monitoring and logging

## Best Practices
- Use domain-based keys for consistent company identification
- Cache and reuse company data when possible
- Implement proper error handling for API calls
- Validate and clean URLs and domains
- Store comprehensive company context for better matching
- Use structured function calls for reliable scoring
- Monitor and optimize token usage
- Implement rate limiting for API calls
- Use proper error handling for failed requests
- Cache responses to reduce API costs

## Future Enhancements
- Implement vector similarity search for better matching
- Add company size and industry classification
- Include salary data and market trends
- Integrate with job boards for real-time opportunities
- Add periodic refresh of company data
- Implement domain verification and URL validation
- Add support for company aliases and acquisitions
- Enhance culture fit analysis with more data points
- Add skill-based vector embeddings
- Implement automated skill gap analysis
- Add token usage analytics and cost tracking
- Implement adaptive rate limiting based on usage patterns
- Add caching layer for frequently accessed data
- Implement batch processing for large-scale analysis
