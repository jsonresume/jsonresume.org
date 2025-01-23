'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/auth';
import { Button } from '@repo/ui/components/ui/button';
import { supabase } from '../lib/supabase';

export default function Menu() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const isActive = (path) => pathname === path;

  const menuItems = [
    { href: '/explore', label: 'Explore' },
    { href: '/jobs', label: 'Jobs' },
    { href: '/job-similarity', label: 'Similarity' },
    {
      href: 'https://github.com/jsonresume/jsonresume.org',
      label: 'Github',
      external: true,
    },
    { href: 'https://discord.gg/GTZtn8pTXC', label: 'Discord', external: true },
  ];

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold">
                JSON Resume Registry
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {menuItems.map((item) =>
                item.external ? (
                  <a
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      isActive(item.href)
                        ? 'text-secondary-900 border-b-2 border-secondary-900'
                        : 'text-gray-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <Link
                href="/editor"
                className={`text-sm font-medium ${
                  isActive('/editor')
                    ? 'text-secondary-900 border-b-2 border-secondary-900'
                    : 'text-gray-900'
                }`}
              >
                Editor
              </Link>
            )}

            {loading ? (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href={`/${user.email?.split('@')[0]}/dashboard`}
                  className={`text-sm font-medium ${
                    pathname.includes('/dashboard')
                      ? 'text-secondary-900 border-b-2 border-secondary-900'
                      : 'text-gray-900'
                  }`}
                >
                  Profile
                </Link>
                <Link
                  className={`text-sm font-medium ${
                    pathname.includes('/dashboard')
                      ? 'text-secondary-900 border-b-2 border-secondary-900'
                      : 'text-gray-900'
                  }`}
                  href={`/settings`}
                >
                  Settings
                </Link>
                <span className="text-sm text-gray-700">{user.email}</span>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign out
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="default">Sign in</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
