export const Header = () => {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-12">
        Resume Endpoints
      </h1>

      <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
        Get Resume
      </h2>
      <p className="mb-4 text-gray-800 leading-relaxed">
        Retrieve a user's complete resume data in various output formats. This
        endpoint is the core of the JSON Resume platform, allowing you to access
        structured resume data and render it in different formats for web
        display, PDF generation, or data processing.
      </p>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <p className="text-green-800">
          <strong>Use Cases:</strong>
          <br />
          • Display resumes on websites or applications
          <br />
          • Generate PDF versions for download
          <br />
          • Extract structured data for analysis
          <br />• Create custom resume themes and layouts
        </p>
      </div>
    </>
  );
};
