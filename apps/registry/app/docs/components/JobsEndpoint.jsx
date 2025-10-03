import { exampleJobsResponse } from '../data/exampleData';

export const JobsEndpoint = () => {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
        Jobs Endpoints
      </h1>

      <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
        Get Relevant Jobs (New)
      </h2>
      <p className="mb-4 text-gray-800 leading-relaxed">
        Get AI-powered job recommendations tailored specifically to a user's
        resume. This endpoint uses advanced machine learning to analyze resume
        content, extract key skills and experience, and match against a database
        of current job postings to find the most relevant opportunities.
      </p>

      <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-6">
        <p className="text-purple-800">
          <strong>How it works:</strong>
          <br />
          • Analyzes resume content using GPT-4 to create a professional summary
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
