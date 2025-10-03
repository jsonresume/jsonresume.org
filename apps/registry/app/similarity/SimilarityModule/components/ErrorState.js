/**
 * Error state component
 * @param {string} error - Error message
 */
export function ErrorState({ error }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Resume Position Network</h1>
      <p className="text-red-500">Error: {error}</p>
    </div>
  );
}
