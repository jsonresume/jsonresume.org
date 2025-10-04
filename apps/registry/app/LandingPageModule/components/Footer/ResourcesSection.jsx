const RESOURCE_LINKS = [
  { href: 'https://jsonresume.org/schema', label: 'Schema' },
  { href: 'https://jsonresume.org/themes', label: 'Themes' },
  { href: 'https://jsonresume.org/getting-started', label: 'Getting Started' },
  { href: 'https://jsonresume.org/api', label: 'API' },
];

export const ResourcesSection = () => {
  return (
    <div>
      <h3 className="font-semibold mb-4">Resources</h3>
      <ul className="space-y-3">
        {RESOURCE_LINKS.map((link) => (
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
