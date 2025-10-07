export const EndpointInfo = () => {
  return (
    <>
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
        Query Parameters
      </h3>
      <div className="bg-gray-50 p-4 rounded-lg">
        <ul className="space-y-2">
          <li>
            <strong className="text-gray-900">theme</strong>{' '}
            <span className="text-blue-600">(optional)</span>: Override the
            resume&apos;s theme (e.g., ?theme=elegant)
          </li>
          <li>
            <strong className="text-gray-900">gistname</strong>{' '}
            <span className="text-blue-600">(optional)</span>: Specify an
            alternative gist filename (e.g., ?gistname=resume-en.json). Defaults
            to resume.json
          </li>
        </ul>
      </div>

      <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">
        Advanced: Schema Validation Bypass
      </h3>
      <p className="mb-4 text-gray-800 leading-relaxed">
        For experimental or edge-case resumes that don&apos;t conform to the
        standard JSON Resume schema, you can bypass validation by adding a flag
        to your resume&apos;s meta section:
      </p>
      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm mb-4">
        <code>{`{
  "meta": {
    "skipValidation": true
  },
  "basics": { ... },
  ...
}`}</code>
      </pre>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <p className="text-sm text-yellow-800">
          <strong>Warning:</strong> Bypassing validation may result in rendering
          issues with some themes. Use this feature only for experimental
          resumes or when you need to extend the schema with custom fields.
        </p>
      </div>
    </>
  );
};
