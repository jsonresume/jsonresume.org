export default function Docs() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-8">
            <div className="prose prose-blue max-w-none">
              {/* API Overview */}
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                JSON Resume API Documentation
              </h1>

              <p className="mb-6 text-gray-800 leading-relaxed text-lg">
                Welcome to the JSON Resume API documentation. This comprehensive
                API provides powerful endpoints for accessing resume data in
                multiple formats and finding AI-powered job recommendations
                tailored to individual profiles.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <p className="text-blue-800">
                  <strong>What can you do with this API?</strong>
                  <br />
                  • Retrieve resumes in JSON, HTML, PDF, and other formats
                  <br />
                  • Get AI-powered job recommendations based on resume content
                  <br />
                  • Integrate resume data into your applications
                  <br />• Build job matching and recruitment tools
                </p>
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                Base URL
              </h2>
              <div className="bg-gray-900 text-green-400 px-4 py-2 rounded font-mono text-sm">
                https://registry.jsonresume.org/api
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                Authentication
              </h2>
              <p className="mb-4 text-gray-800 leading-relaxed">
                All endpoints are publicly accessible and do not require
                authentication. This makes integration simple and
                straightforward for developers.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                Rate Limiting
              </h2>
              <p className="mb-4 text-gray-800 leading-relaxed">
                Please be respectful with API usage. Heavy usage may be rate
                limited to ensure fair access for all users. For high-volume
                applications, consider implementing caching strategies.
              </p>

              {/* Resume Endpoints */}
              <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
                Resume Endpoints
              </h1>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                Get Resume
              </h2>
              <p className="mb-4 text-gray-800 leading-relaxed">
                Retrieve a user's complete resume data in various output
                formats. This endpoint is the core of the JSON Resume platform,
                allowing you to access structured resume data and render it in
                different formats for web display, PDF generation, or data
                processing.
              </p>

              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                <p className="text-green-800">
                  <strong>Use Cases:</strong>
                  <br />
                  • Display resumes on websites or applications
                  <br />
                  • Generate PDF versions for download
                  <br />
                  • Extract structured data for analysis
                  <br />• Create custom resume themes and layouts
                </p>
              </div>

              <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">
                Endpoint
              </h3>
              <div className="space-y-2">
                <div className="bg-gray-900 text-green-400 px-4 py-2 rounded font-mono text-sm">
                  GET /api/{`{username}`}
                </div>
                <div className="bg-gray-900 text-green-400 px-4 py-2 rounded font-mono text-sm">
                  GET /api/{`{username}`}.{`{format}`}
                </div>
              </div>

              <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">
                Parameters
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2">
                  <li>
                    <strong className="text-gray-900">username</strong>{' '}
                    <span className="text-red-600">(required)</span>: The unique
                    username of the resume to retrieve
                  </li>
                  <li>
                    <strong className="text-gray-900">format</strong>{' '}
                    <span className="text-blue-600">(optional)</span>: Output
                    format - supports json, html, pdf, and various theme formats
                  </li>
                </ul>
              </div>

              <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">
                Example Requests
              </h3>
              <div className="space-y-2">
                <div className="bg-gray-900 text-green-400 px-4 py-2 rounded font-mono text-sm">
                  GET /api/thomasdavis
                </div>
                <div className="bg-gray-900 text-green-400 px-4 py-2 rounded font-mono text-sm">
                  GET /api/thomasdavis.json
                </div>
                <div className="bg-gray-900 text-green-400 px-4 py-2 rounded font-mono text-sm">
                  GET /api/thomasdavis.pdf
                </div>
              </div>

              <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">
                Response
              </h3>
              <p className="mb-4 text-gray-800 leading-relaxed">
                Returns the resume in the requested format. Default format is a
                styled HTML template. JSON format returns the raw structured
                data, while PDF generates a downloadable document.
              </p>

              <h4 className="text-lg font-medium text-gray-700 mt-4 mb-2">
                Example JSON Response:
              </h4>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`{
  "basics": {
    "name": "Thomas Davis",
    "label": "Web Developer",
    "email": "thomas@jsonresume.org",
    "phone": "(912) 555-4321",
    "website": "https://thomasdavis.github.io",
    "summary": "Full-stack developer with 10+ years experience...",
    "location": {
      "city": "San Francisco",
      "countryCode": "US"
    }
  },
  "work": [
    {
      "company": "Company Name",
      "position": "Senior Developer",
      "startDate": "2020-01-01",
      "summary": "Led development of..."
    }
  ],
  "education": [...],
  "skills": [...]
}`}</code>
              </pre>

              <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">
                Error Responses
              </h3>
              <div className="bg-red-50 p-4 rounded-lg">
                <ul className="space-y-1 text-red-800">
                  <li>
                    <strong>400 Bad Request:</strong> Invalid username or
                    unsupported format
                  </li>
                  <li>
                    <strong>404 Not Found:</strong> Resume not found for the
                    specified username
                  </li>
                </ul>
              </div>

              {/* Jobs Endpoints */}
              <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
                Jobs Endpoints
              </h1>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                Get Relevant Jobs (New)
              </h2>
              <p className="mb-4 text-gray-800 leading-relaxed">
                Get AI-powered job recommendations tailored specifically to a
                user's resume. This endpoint uses advanced machine learning to
                analyze resume content, extract key skills and experience, and
                match against a database of current job postings to find the
                most relevant opportunities.
              </p>

              <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-6">
                <p className="text-purple-800">
                  <strong>How it works:</strong>
                  <br />
                  • Analyzes resume content using GPT-4 to create a professional
                  summary
                  <br />
                  • Generates semantic embeddings from the resume data
                  <br />
                  • Performs vector similarity search against job database
                  <br />
                  • Returns jobs ranked by relevance score (0-1 scale)
                  <br />• Includes jobs from the last 65 days for freshness
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <p className="text-yellow-800">
                  <strong>Use Cases:</strong>
                  <br />
                  • Job recommendation engines
                  <br />
                  • Career guidance applications
                  <br />
                  • Recruitment platform integrations
                  <br />• Personal job search automation
                </p>
              </div>

              <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">
                Endpoint
              </h3>
              <div className="bg-gray-900 text-green-400 px-4 py-2 rounded font-mono text-sm">
                GET /api/{`{username}`}/jobs
              </div>

              <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">
                Parameters
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul>
                  <li>
                    <strong className="text-gray-900">username</strong>{' '}
                    <span className="text-red-600">(required)</span>: The
                    username to find relevant jobs for - must have an existing
                    resume in the system
                  </li>
                </ul>
              </div>

              <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">
                Example Request
              </h3>
              <div className="bg-gray-900 text-green-400 px-4 py-2 rounded font-mono text-sm">
                GET /api/thomasdavis/jobs
              </div>

              <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">
                Response
              </h3>
              <p className="mb-4 text-gray-800 leading-relaxed">
                Returns an array of up to 500 job recommendations, sorted by
                relevance score (highest first). Each job includes similarity
                score, original URL, and full job description content.
              </p>

              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                <code>
                  {JSON.stringify(
                    [
                      {
                        jobId: 5091,
                        score: 0.633673667907715,
                        url: 'https://news.ycombinator.com/item?id=44236004',
                        raw: JSON.stringify({
                          title: 'Full Stack Developer',
                          company: 'ConsentKeys.com',
                          location: {
                            address: '',
                            city: '',
                            region: '',
                            postalCode: '',
                            countryCode: '',
                          },
                          position: 'Full Stack Developer',
                          type: 'Contract (possible CTO conversion)',
                          salary: '',
                          date: '2024-06',
                          remote: 'Full',
                          description:
                            "ConsentKeys.com is a WolfNYC (VC) backed startup dedicated to protecting people's privacy online...",
                          responsibilities: [
                            'Develop and maintain full-stack privacy and security solutions.',
                            'Implement verifiable credentials, OIDC, and ZKPs.',
                          ],
                          qualifications: [
                            'Experience with privacy and security technologies.',
                            'Full-stack development experience.',
                          ],
                          skills: [
                            {
                              name: 'Full Stack Development',
                              level: 'Expert',
                              keywords: [
                                'Node.js',
                                'React',
                                'TypeScript',
                                'REST APIs',
                              ],
                            },
                          ],
                          experience: 'Senior',
                          application: 'https://consentkeys.com/careers',
                        }),
                      },
                      {
                        jobId: 5295,
                        score: 0.614646508055513,
                        url: 'https://news.ycombinator.com/item?id=44163323',
                        raw: JSON.stringify({
                          title: 'Fullstack Web Engineer',
                          company: 'IPinfo.io',
                          type: 'Full-time',
                          date: '2024-06',
                          description:
                            'IPinfo.io is a global leader in IP data solutions, powering over 100 billion requests monthly...',
                          location: { countryCode: 'US' },
                          remote: 'Full',
                          salary: '',
                          experience: 'Senior',
                          skills: [
                            {
                              name: 'Fullstack Development',
                              level: 'Expert',
                              keywords: ['JavaScript', 'Python', 'APIs'],
                            },
                          ],
                        }),
                      },
                    ],
                    null,
                    2
                  )}
                </code>
              </pre>

              <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">
                Response Fields
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2">
                  <li>
                    <strong className="text-gray-900">jobId:</strong> Unique
                    identifier for the job posting in our database
                  </li>
                  <li>
                    <strong className="text-gray-900">score:</strong>{' '}
                    AI-calculated relevance score (0-1 scale, where 1.0 is
                    perfect match)
                  </li>
                  <li>
                    <strong className="text-gray-900">url:</strong> Direct link
                    to the original job posting on the company's website
                  </li>
                  <li>
                    <strong className="text-gray-900">raw:</strong> Complete job
                    description content including requirements,
                    responsibilities, and company information
                  </li>
                </ul>
              </div>

              <hr className="my-8" />

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                Get Relevant Jobs (Legacy)
              </h2>
              <p className="mb-4 text-gray-800 leading-relaxed">
                Legacy endpoint for getting relevant jobs using query
                parameters. This endpoint provides the same AI-powered job
                matching functionality as the new endpoint above, but uses the
                traditional query parameter approach. Maintained for backward
                compatibility with existing integrations.
              </p>

              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
                <p className="text-orange-800">
                  <strong>Migration Notice:</strong> While this endpoint remains
                  fully functional, we recommend using the new{' '}
                  <code>/api/{`{username}`}/jobs</code> endpoint for new
                  integrations as it follows REST conventions and provides
                  better caching.
                </p>
              </div>

              <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">
                Endpoint
              </h3>
              <div className="bg-gray-900 text-green-400 px-4 py-2 rounded font-mono text-sm">
                GET /api/relevant-jobs?username={`{username}`}
              </div>

              <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">
                Parameters
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul>
                  <li>
                    <strong className="text-gray-900">username</strong>{' '}
                    <span className="text-red-600">(required)</span>: Query
                    parameter containing the username to find jobs for
                  </li>
                </ul>
              </div>

              <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">
                Example Request
              </h3>
              <div className="bg-gray-900 text-green-400 px-4 py-2 rounded font-mono text-sm">
                GET /api/relevant-jobs?username=thomasdavis
              </div>

              <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">
                Response
              </h3>
              <p className="mb-4 text-gray-800 leading-relaxed">
                Returns the same response format as the new jobs endpoint above
                - an array of job recommendations with relevance scores, URLs,
                and full job descriptions.
              </p>

              <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">
                Error Responses
              </h3>
              <div className="bg-red-50 p-4 rounded-lg">
                <ul className="space-y-1 text-red-800">
                  <li>
                    <strong>400 Bad Request:</strong> Missing or invalid
                    username parameter
                  </li>
                  <li>
                    <strong>404 Not Found:</strong> Resume not found for the
                    specified username
                  </li>
                  <li>
                    <strong>500 Internal Server Error:</strong> AI processing or
                    database error
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
