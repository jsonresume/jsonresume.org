# Job Recommendations Engine

## Overview
The Job Recommendations Engine is an AI-powered system that matches JSON Resume profiles with job postings, providing detailed compatibility analysis and actionable insights.

## Core Features

### Resume Analysis
- Extracts key information from JSON Resume format
- Analyzes skills, experience, and qualifications
- Considers work history and career progression
- Evaluates remote work experience

### Job Matching
- Comprehensive job compatibility scoring
- Technical skills alignment
- Experience level matching
- Culture fit assessment
- Remote work readiness evaluation

### Scoring System
- Overall Match Score (0-1)
- Technical Skills Score (0-1)
- Experience Level Score (0-1)
- Culture Fit Score (0-1)
- Detailed analysis for each score component
- Lists of matched and missing skills
- Personalized recommendations

## API Integration

### Recommendations API (`/api/recommendations`)
- **Method**: POST
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "username": "string",
    "jobPosting": {
      "id": "string",
      "title": "string",
      "company": "string",
      "type": "string",
      "remote": "string",
      "description": "string",
      "skills": [
        {
          "name": "string",
          "level": "string",
          "keywords": ["string"]
        }
      ],
      "qualifications": ["string"],
      "location": {
        "countryCode": "string"
      }
    }
  }
  ```
- **Response**:
  ```json
  {
    "overallScore": "number",
    "skillsScore": "number",
    "experienceScore": "number",
    "cultureScore": "number",
    "overallAnalysis": "string",
    "skillsAnalysis": "string",
    "experienceAnalysis": "string",
    "cultureAnalysis": "string",
    "matchedSkills": ["string"],
    "missingSkills": ["string"],
    "recommendations": ["string"]
  }
  ```

### Error Handling
- 400: Missing required parameters
- 404: Resume not found
- 500: Internal server error

## Technical Requirements

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `SUPABASE_KEY`: Supabase service role key
- `OPENAI_API_KEY`: OpenAI API key

### Dependencies
- OpenAI API for analysis
- Supabase for resume storage
- Next.js 14 App Router
- GPT-4 for scoring

## Future Enhancements
1. Job recommendation caching
2. Batch job analysis
3. Historical match tracking
4. Skill development suggestions
5. Industry-specific insights
6. Career path recommendations

## Security Considerations
1. API rate limiting
2. Request validation
3. Resume data protection
4. Secure API key handling
5. User authentication
6. Error logging

## Performance Optimization
1. Response caching
2. Parallel processing
3. Request batching
4. API timeout handling
5. Error recovery
6. Load balancing

## User Experience
1. Real-time scoring
2. Detailed feedback
3. Visual score representation
4. Actionable insights
5. Mobile responsiveness
6. Accessibility compliance
