export function SearchStatus({ totalCount, search }) {
  return (
    <div className="text-sm text-gray-600 mb-6">
      {search ? (
        <span>
          Found {totalCount.toLocaleString()} resumes matching "{search}"
        </span>
      ) : (
        <span>Browsing {totalCount.toLocaleString()} professional resumes</span>
      )}
    </div>
  );
}
