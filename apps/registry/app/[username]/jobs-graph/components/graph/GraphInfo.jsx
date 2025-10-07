export function GraphInfo() {
  return (
    <div className="px-4 py-3 bg-white border-b">
      <div className="max-w-6xl">
        <p className="mb-2">
          This graph uses vector similarity to match your resume with relevant
          job postings from Hacker News "Who is Hiring?" threads. Jobs are
          analyzed and matched against your resume using natural language
          processing.
        </p>
        <p className="text-sm text-gray-600">
          Note: This is an experimental feature and may not catch every job or
          skill match perfectly.
        </p>
      </div>
    </div>
  );
}
