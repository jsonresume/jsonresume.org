export const DocHeader = () => {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        JSON Resume API Documentation
      </h1>

      <p className="mb-6 text-gray-800 leading-relaxed text-lg">
        Welcome to the JSON Resume API documentation. This comprehensive API
        provides powerful endpoints for accessing resume data in multiple
        formats and finding AI-powered job recommendations tailored to
        individual profiles.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <p className="text-blue-800">
          <strong>What can you do with this API?</strong>
          <br />
          • Retrieve resumes in JSON, HTML, PDF, and other formats
          <br />
          • Get AI-powered job recommendations based on resume content
          <br />
          • Integrate resume data into your applications
          <br />• Build job matching and recruitment tools
        </p>
      </div>
    </>
  );
};
