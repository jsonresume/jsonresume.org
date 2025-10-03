import Link from 'next/link';
import { NAV_LINKS } from '../constants/navLinks';

/**
 * Navigation links component
 */
export function NavLinks() {
  return (
    <>
      {NAV_LINKS.map((link) => {
        const Icon = link.icon;
        const linkProps = link.external
          ? {
              href: link.href,
              target: '_blank',
              rel: 'noopener noreferrer',
            }
          : { href: link.href };

        const LinkComponent = link.external ? 'a' : Link;

        return (
          <LinkComponent
            key={link.href}
            {...linkProps}
            className="text-sm font-medium text-gray-900 hover:text-gray-800 flex items-center gap-2"
          >
            <Icon className="w-4 h-4" />
            {link.label}
          </LinkComponent>
        );
      })}
    </>
  );
}
