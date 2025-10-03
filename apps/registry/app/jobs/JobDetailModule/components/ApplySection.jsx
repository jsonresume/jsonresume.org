export const ApplySection = ({ jobUrl, contactEmail, jobTitle }) => {
  return (
    <div className="mt-12 flex flex-col items-center border-t pt-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Interested in this position?
        </h2>
        <p className="text-gray-600">
          We'd love to hear from you! Click below to apply.
        </p>
      </div>
      {jobUrl ? (
        <a
          href={jobUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Apply on Company Website
        </a>
      ) : (
        <a
          href={`mailto:${contactEmail}?subject=Application for ${
            jobTitle || 'Position'
          }`}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Apply via Email
        </a>
      )}
    </div>
  );
};
