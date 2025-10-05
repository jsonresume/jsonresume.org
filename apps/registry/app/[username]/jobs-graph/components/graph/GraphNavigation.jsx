import Link from 'next/link';

export function GraphNavigation({ username }) {
  return (
    <nav className="px-4 py-2 bg-white border-b">
      <Link
        href={`/${username}`}
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        Back to {username}'s Profile
      </Link>
    </nav>
  );
}
