export const Header = () => {
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
    </>
  );
};
