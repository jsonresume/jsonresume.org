import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/jobs', label: 'Jobs' },
  { href: '/jobs-graph', label: 'Jobs Graph' },
  { href: '/suggestions', label: 'Suggestions' },
  { href: '/letter', label: 'Letter' },
  { href: '/json', label: 'View JSON' },
];

export function NavigationMenu({ username }) {
  const pathname = usePathname();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <nav>
        <ul className="space-y-2">
          {NAV_LINKS.map((link) => {
            const fullHref = `/${username}${link.href}`;
            return (
              <li key={fullHref}>
                <Link
                  href={fullHref}
                  className={`block p-2 rounded transition-colors ${
                    pathname === fullHref
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
