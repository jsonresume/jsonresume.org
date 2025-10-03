export const LegacyJobsEndpoint = () => {
  return (
    <>
      <hr className="my-8" />

      <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
        Get Relevant Jobs (Legacy)
      </h2>
      <p className="mb-4 text-gray-800 leading-relaxed">
        Legacy endpoint for getting relevant jobs using query parameters. This
        endpoint provides the same AI-powered job matching functionality as the
        new endpoint above, but uses the traditional query parameter approach.
        Maintained for backward compatibility with existing integrations.
      </p>

      <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
        <p className="text-orange-800">
          <strong>Migration Notice:</strong> While this endpoint remains fully
          functional, we recommend using the new{' '}
          <code>/api/{`{username}`}/jobs</code> endpoint for new integrations as
          it follows REST conventions and provides better caching.
        </p>
      </div>

      <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">Endpoint</h3>
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
            <span className="text-red-600">(required)</span>: Query parameter
            containing the username to find jobs for
          </li>
        </ul>
      </div>

      <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">
        Example Request
      </h3>
      <div className="bg-gray-900 text-green-400 px-4 py-2 rounded font-mono text-sm">
        GET /api/relevant-jobs?username=thomasdavis
      </div>

      <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">Response</h3>
      <p className="mb-4 text-gray-800 leading-relaxed">
        Returns the same response format as the new jobs endpoint above - an
        array of job recommendations with relevance scores, URLs, and full job
        descriptions.
      </p>

      <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">
        Error Responses
      </h3>
      <div className="bg-red-50 p-4 rounded-lg">
        <ul className="space-y-1 text-red-800">
          <li>
            <strong>400 Bad Request:</strong> Missing or invalid username
            parameter
          </li>
          <li>
            <strong>404 Not Found:</strong> Resume not found for the specified
            username
          </li>
          <li>
            <strong>500 Internal Server Error:</strong> AI processing or
            database error
          </li>
        </ul>
      </div>
    </>
  );
};
