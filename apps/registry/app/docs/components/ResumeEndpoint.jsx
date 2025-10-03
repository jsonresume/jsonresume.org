export const ResumeEndpoint = () => {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
        Resume Endpoints
      </h1>

      <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
        Get Resume
      </h2>
      <p className="mb-4 text-gray-800 leading-relaxed">
        Retrieve a user's complete resume data in various output formats. This
        endpoint is the core of the JSON Resume platform, allowing you to access
        structured resume data and render it in different formats for web
        display, PDF generation, or data processing.
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

      <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">Endpoint</h3>
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
            <span className="text-blue-600">(optional)</span>: Output format -
            supports json, html, pdf, and various theme formats
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

      <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">Response</h3>
      <p className="mb-4 text-gray-800 leading-relaxed">
        Returns the resume in the requested format. Default format is a styled
        HTML template. JSON format returns the raw structured data, while PDF
        generates a downloadable document.
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
            <strong>400 Bad Request:</strong> Invalid username or unsupported
            format
          </li>
          <li>
            <strong>404 Not Found:</strong> Resume not found for the specified
            username
          </li>
        </ul>
      </div>
    </>
  );
};
