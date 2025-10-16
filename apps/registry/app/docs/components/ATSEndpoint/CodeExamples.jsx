import { requestBodyExample, responseExample, usageExample } from './examples';

export const RequestExample = () => {
  return (
    <>
      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        Request Body
      </h3>
      <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
        <code className="text-green-400 text-sm">{requestBodyExample}</code>
      </pre>
    </>
  );
};

export const ResponseExample = () => {
  return (
    <>
      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        Response
      </h3>
      <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
        <code className="text-green-400 text-sm">{responseExample}</code>
      </pre>
    </>
  );
};

export const UsageExample = () => {
  return (
    <>
      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        Example Usage
      </h3>
      <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-6">
        <code className="text-green-400 text-sm">{usageExample}</code>
      </pre>
    </>
  );
};
