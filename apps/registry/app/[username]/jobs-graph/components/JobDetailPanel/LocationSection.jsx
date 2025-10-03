export function LocationSection({ location }) {
  if (!location) return null;

  return (
    <div className="flex items-start gap-2 text-gray-600">
      <svg
        className="w-5 h-5 mt-0.5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      <span>
        {location.city}
        {location.region && `, ${location.region}`}
      </span>
    </div>
  );
}
