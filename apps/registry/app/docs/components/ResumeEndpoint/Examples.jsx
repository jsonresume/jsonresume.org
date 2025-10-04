export const Examples = () => {
  return (
    <>
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
    </>
  );
};
