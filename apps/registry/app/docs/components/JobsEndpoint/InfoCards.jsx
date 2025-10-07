export const InfoCards = () => {
  return (
    <>
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
    </>
  );
};
