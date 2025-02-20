# JSON Resume Recommendation Engine

## Overview
The recommendation engine analyzes resumes against job postings to provide intelligent job matching and scoring. It enhances the matching process by incorporating rich company data and context through the Perplexity API.

## Features

### Company Data Enrichment
- Extracts companies from both resume work history and job postings
- Fetches detailed company information and recent news using Perplexity API
- Caches company data to avoid redundant API calls
- Stores additional context like:
  - Company URLs
  - Position details
  - Employment dates
  - Job types and remote work status

### Data Storage
- Company data is stored in `companyData.json`
- Format:
  ```json
  {
    "CompanyName": {
      "name": "string",
      "url": "string",
      "position": "string",
      "startDate": "string",
      "endDate": "string",
      "perplexityData": "object",
      "lastUpdated": "string"
    }
  }
  ```

### Resume-Job Matching
- Uses OpenAI GPT-4 for intelligent matching
- Considers:
  - Skills and technical expertise
  - Experience level alignment
  - Industry knowledge
  - Leadership capabilities
  - Education and certifications

## Technical Requirements

### Environment Variables
- `OPENAI_API_KEY`: For GPT-4 analysis
- `PERPLEXITY_API_KEY`: For company research

### Dependencies
- `openai`: OpenAI API client
- `node-fetch`: For making HTTP requests
- `dotenv`: For environment variable management

## Future Enhancements
- Implement vector similarity search for better matching
- Add company size and industry classification
- Include salary data and market trends
- Integrate with job boards for real-time opportunities
- Add periodic refresh of company data