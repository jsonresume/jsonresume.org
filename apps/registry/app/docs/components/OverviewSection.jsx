export const OverviewSection = () => {
  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
        Base URL
      </h2>
      <div className="bg-gray-900 text-green-400 px-4 py-2 rounded font-mono text-sm">
        https://registry.jsonresume.org/api
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
        Authentication
      </h2>
      <p className="mb-4 text-gray-800 leading-relaxed">
        All endpoints are publicly accessible and do not require authentication.
        This makes integration simple and straightforward for developers.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
        Rate Limiting
      </h2>
      <p className="mb-4 text-gray-800 leading-relaxed">
        Please be respectful with API usage. Heavy usage may be rate limited to
        ensure fair access for all users. For high-volume applications, consider
        implementing caching strategies.
      </p>
    </>
  );
};
