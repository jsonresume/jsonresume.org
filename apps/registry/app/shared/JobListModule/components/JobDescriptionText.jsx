export function JobDescriptionText({ description, expanded }) {
  return (
    <div className="text-gray-600 col-span-full">
      {expanded ? (
        <p>{description || 'Not available'}</p>
      ) : (
        <p>
          {description ? description.slice(0, 100) + '...' : 'Not available'}
        </p>
      )}
    </div>
  );
}
