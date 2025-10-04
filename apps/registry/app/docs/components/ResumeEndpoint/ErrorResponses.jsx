export const ErrorResponses = () => {
  return (
    <>
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
