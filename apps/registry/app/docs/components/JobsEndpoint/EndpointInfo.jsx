export const EndpointInfo = () => {
  return (
    <>
      <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">Endpoint</h3>
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
            <span className="text-red-600">(required)</span>: The username to
            find relevant jobs for - must have an existing resume in the system
          </li>
        </ul>
      </div>

      <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">
        Example Request
      </h3>
      <div className="bg-gray-900 text-green-400 px-4 py-2 rounded font-mono text-sm">
        GET /api/thomasdavis/jobs
      </div>
    </>
  );
};
