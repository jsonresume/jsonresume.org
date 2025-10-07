export const ATSEndpoint = () => {
  return (
    <section id="ats" className="mt-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        ATS Compatibility Analysis
      </h2>
      <p className="text-gray-600 mb-6">
        Analyze your resume for Applicant Tracking System (ATS) compatibility.
        Get a detailed score, recommendations, and insights to improve your
        resume's chances of passing through automated screening systems.
      </p>

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        Endpoint
      </h3>
      <div className="bg-gray-900 rounded-lg p-4 mb-4">
        <code className="text-green-400 text-sm">POST /api/ats</code>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        Request Body
      </h3>
      <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
        <code className="text-green-400 text-sm">{`{
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
}`}</code>
      </pre>

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        Response
      </h3>
      <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
        <code className="text-green-400 text-sm">{`{
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
}`}</code>
      </pre>

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        Scoring Categories
      </h3>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Points
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                What It Checks
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Contact Information
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                20
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                Name, email, phone, location completeness and validity
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Work Experience
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                20
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                Company names, job titles, dates, descriptions, highlights
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Education
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                15
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                Institution names, degrees, study areas
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Skills
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                15
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                Skill categories, keyword count, variety
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Keywords & Content
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                15
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                Summary length, highlights count, overall word count
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Date Formatting
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                10
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                Consistent date formats, no missing dates
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Theme Compatibility
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                5
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                ATS-friendly theme selection
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        Rating Scale
      </h3>
      <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
        <li>
          <strong className="text-gray-900">Excellent (90-100):</strong> Your
          resume is highly optimized for ATS
        </li>
        <li>
          <strong className="text-gray-900">Good (75-89):</strong>{' '}
          Well-optimized with minor improvements needed
        </li>
        <li>
          <strong className="text-gray-900">Fair (60-74):</strong> Needs some
          improvements for better compatibility
        </li>
        <li>
          <strong className="text-gray-900">Poor (40-59):</strong> Needs
          significant improvements
        </li>
        <li>
          <strong className="text-gray-900">Needs Improvement (0-39):</strong>{' '}
          Critical issues that must be addressed
        </li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        Severity Levels
      </h3>
      <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
        <li>
          <strong className="text-red-600">Critical:</strong> Missing required
          fields (name, email) - ATS will likely reject
        </li>
        <li>
          <strong className="text-yellow-600">Warning:</strong> Missing
          recommended fields - reduces ATS score
        </li>
        <li>
          <strong className="text-blue-600">Info:</strong> Suggestions for
          optimization - nice to have
        </li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        Best Practices
      </h3>
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              Tips for ATS Success
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
              <li>
                Use standard section headings (Work Experience, Education,
                Skills)
              </li>
              <li>Include relevant keywords from job descriptions</li>
              <li>Avoid images, tables, and complex formatting</li>
              <li>Use standard fonts and simple layouts</li>
              <li>Include full contact information</li>
              <li>Use consistent date formats (YYYY-MM-DD recommended)</li>
              <li>Add specific achievements and metrics in work highlights</li>
              <li>List multiple skills across different categories</li>
              <li>
                Choose ATS-friendly themes (stackoverflow, professional,
                elegant, kendall, flat)
              </li>
            </ul>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        Example Usage
      </h3>
      <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-6">
        <code className="text-green-400 text-sm">{`// Fetch your resume
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
console.log(\`Recommendations: \${analysis.recommendations.length}\`);`}</code>
      </pre>

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        View Your ATS Score
      </h3>
      <p className="text-gray-600 mb-4">
        Visit{' '}
        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
          https://registry.jsonresume.org/[username]/ats
        </code>{' '}
        to see a detailed visual breakdown of your resume's ATS compatibility
        with actionable recommendations.
      </p>
    </section>
  );
};
