/**
 * Code example snippets for ATS endpoint documentation
 */

export const requestBodyExample = `{
  "resume": {
    "basics": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1-555-0100",
      "summary": "Experienced software engineer...",
      "location": {
        "city": "San Francisco",
        "region": "CA",
        "country": "US"
      }
    },
    "work": [...],
    "education": [...],
    "skills": [...]
  },
  "theme": "jsonresume-theme-stackoverflow" // optional
}`;

export const responseExample = `{
  "score": 85,
  "rating": "Good",
  "summary": "Your resume is well-optimized for ATS with minor improvements needed.",
  "checks": [
    {
      "name": "Contact Information",
      "score": 20,
      "maxScore": 20,
      "passed": true,
      "issues": []
    },
    {
      "name": "Work Experience",
      "score": 16,
      "maxScore": 20,
      "passed": true,
      "issues": [
        {
          "severity": "warning",
          "category": "experience",
          "message": "Work entry #2: Missing job description or highlights",
          "fix": "Complete all required fields for work entry #2"
        }
      ]
    }
    // ... 5 more checks
  ],
  "recommendations": [
    {
      "severity": "warning",
      "category": "experience",
      "message": "Work entry #2: Missing job description or highlights",
      "fix": "Complete all required fields for work entry #2"
    }
    // ... more recommendations
  ]
}`;

export const usageExample = `// Fetch your resume
const resumeResponse = await fetch('https://registry.jsonresume.org/username.json');
const resume = await resumeResponse.json();

// Analyze for ATS compatibility
const atsResponse = await fetch('https://registry.jsonresume.org/api/ats', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ resume, theme: 'jsonresume-theme-stackoverflow' })
});

const analysis = await atsResponse.json();
console.log(\`ATS Score: \${analysis.score}/100 (\${analysis.rating})\`);
console.log(\`Recommendations: \${analysis.recommendations.length}\`);`;
