import Link from 'next/link';
import { Github, LogOut } from 'lucide-react';
import { Button } from '@repo/ui';
import { getAuthLinks } from '../constants/authLinks';

/**
 * Auth navigation links component
 * @param {Object} user - Current user object
 * @param {Function} onSignOut - Sign out handler
 */
export function AuthLinks({ user, onSignOut }) {
  if (!user) {
    return (
      <Link href="/login">
        <Button className="bg-gray-900 text-primary hover:bg-gray-800">
          <Github className="w-4 h-4 mr-2" />
          Sign in with GitHub
        </Button>
      </Link>
    );
  }

  const username =
    user.user_metadata?.user_name || user.user_metadata?.preferred_username;
  const authLinks = getAuthLinks(username);

  return (
    <>
      {authLinks.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-gray-900 hover:text-gray-800 flex items-center gap-2"
          >
            <Icon className="w-4 h-4" />
            {link.label}
          </Link>
        );
      })}
      <Button
        variant="ghost"
        onClick={onSignOut}
        className="text-sm font-medium text-gray-900 hover:bg-gray-900/5 flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </Button>
    </>
  );
}
