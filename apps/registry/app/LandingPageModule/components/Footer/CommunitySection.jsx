const COMMUNITY_LINKS = [
  { href: 'https://github.com/jsonresume', label: 'GitHub' },
  { href: 'https://discord.gg/jsonresume', label: 'Discord' },
  { href: 'https://twitter.com/jsonresume', label: 'Twitter' },
  { href: 'https://jsonresume.org/blog', label: 'Blog' },
];

export const CommunitySection = () => {
  return (
    <div>
      <h3 className="font-semibold mb-4">Community</h3>
      <ul className="space-y-3">
        {COMMUNITY_LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
