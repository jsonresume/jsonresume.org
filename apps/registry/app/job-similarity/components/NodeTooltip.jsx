export const NodeTooltip = ({ hoverNode, dataSource }) => {
  if (!hoverNode) return null;

  return (
    <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg w-80">
      <h3 className="font-bold">{hoverNode.id}</h3>
      <p>
        {hoverNode.count} {dataSource === 'jobs' ? 'job listings' : 'resumes'}
      </p>
      {dataSource === 'jobs' && hoverNode.companies && (
        <div className="mt-2">
          <p className="text-sm text-gray-600">Companies:</p>
          <p className="text-sm">
            {hoverNode.companies.slice(0, 5).join(', ')}
            {hoverNode.companies.length > 5
              ? `, +${hoverNode.companies.length - 5} more`
              : ''}
          </p>
        </div>
      )}
      {dataSource === 'jobs' && hoverNode.countryCodes && (
        <div className="mt-2">
          <p className="text-sm text-gray-600">Locations:</p>
          <p className="text-sm">
            {hoverNode.countryCodes.slice(0, 5).join(', ')}
            {hoverNode.countryCodes.length > 5
              ? `, +${hoverNode.countryCodes.length - 5} more`
              : ''}
          </p>
        </div>
      )}
      {dataSource !== 'jobs' && hoverNode.usernames && (
        <div className="mt-2">
          <p className="text-sm text-gray-600">Usernames:</p>
          <div className="text-sm max-h-32 overflow-y-auto">
            {hoverNode.usernames.map((username, i) => (
              <div
                key={i}
                className="hover:bg-gray-100 p-1 rounded cursor-pointer"
                onClick={() => {
                  const baseUrl = dataSource === 'jobs' ? '/jobs/' : '/';
                  window.open(`${baseUrl}${hoverNode.uuids[0]}`, '_blank');
                }}
              >
                {username}
              </div>
            ))}
          </div>
        </div>
      )}
      {dataSource === 'jobs' && (
        <div className="mt-4">
          <a
            href={`/jobs/${hoverNode.uuids[0]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            View job listing →
          </a>
        </div>
      )}
      {dataSource !== 'jobs' && (
        <div className="mt-4">
          <a
            href={`/${hoverNode.uuids[0]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            View resume →
          </a>
        </div>
      )}
    </div>
  );
};
