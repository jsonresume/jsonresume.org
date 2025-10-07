import { exampleJobsResponse } from '../../data/exampleData';

export const ResponseInfo = () => {
  return (
    <>
      <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">Response</h3>
      <p className="mb-4 text-gray-800 leading-relaxed">
        Returns an array of up to 500 job recommendations, sorted by relevance
        score (highest first). Each job includes similarity score, original URL,
        and full job description content.
      </p>

      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{JSON.stringify(exampleJobsResponse, null, 2)}</code>
      </pre>

      <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">
        Response Fields
      </h3>
      <div className="bg-gray-50 p-4 rounded-lg">
        <ul className="space-y-2">
          <li>
            <strong className="text-gray-900">jobId:</strong> Unique identifier
            for the job posting in our database
          </li>
          <li>
            <strong className="text-gray-900">score:</strong> AI-calculated
            relevance score (0-1 scale, where 1.0 is perfect match)
          </li>
          <li>
            <strong className="text-gray-900">url:</strong> Direct link to the
            original job posting on the company's website
          </li>
          <li>
            <strong className="text-gray-900">raw:</strong> Complete job
            description content including requirements, responsibilities, and
            company information
          </li>
        </ul>
      </div>
    </>
  );
};
