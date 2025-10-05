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
    </>
  );
};
