'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Header from './Header';

export default function Menu({ session }) {
  const pathname = usePathname();
  const username = session?.username;

  const isActive = (path) => pathname === path;
  const isProfileActive = pathname.startsWith(`/${username}`);

  return (
    <div className="bg-accent-200 shadow-md">
      <Header
        left={
          <div className="flex gap-8 items-center h-full p-5">
            <Link
              href="/"
              className="text-2xl font-bold text-black hover:text-secondary-900 transition-colors duration-200"
            >
              JSON Resume Registry
            </Link>
            <Link
              href="/explore"
              className={`text-xl font-bold ${
                isActive('/explore')
                  ? 'text-secondary-900 underline'
                  : 'text-black'
              } hover:text-secondary-900 transition-colors duration-200`}
            >
              Explore
            </Link>
            <Link
              href="/jobs"
              className={`text-xl font-bold ${
                isActive('/jobs') || pathname.startsWith('/jobs/')
                  ? 'text-secondary-900 underline'
                  : 'text-black'
              } hover:text-secondary-900 transition-colors duration-200`}
            >
              Jobs
            </Link>
            <a
              href="https://github.com/jsonresume/jsonresume.org"
              className="text-xl font-bold text-black hover:text-secondary-900 transition-colors duration-200"
            >
              Github
            </a>
            <a
              href="https://discord.gg/GTZtn8pTXC"
              className="text-xl font-bold text-black hover:text-secondary-900 transition-colors duration-200"
            >
              Discord
            </a>
          </div>
        }
        right={
          <div className="flex gap-6 items-center h-full p-5">
            {username && (
              <Link
                href={`/${username}/dashboard`}
                className={`text-xl font-bold hover:text-secondary-900 transition-colors duration-200 ${
                  isProfileActive
                    ? 'text-secondary-900 underline'
                    : 'text-black'
                }`}
              >
                Profile
              </Link>
            )}
            {session && username && (
              <Link
                href="/editor"
                className={`text-xl font-bold hover:text-secondary-900 transition-colors duration-200 ${
                  isActive('/editor')
                    ? 'text-secondary-900 underline'
                    : 'text-black'
                }`}
              >
                Editor
              </Link>
            )}
            {session && (
              <button
                onClick={signOut}
                className="text-xl font-bold text-black hover:text-secondary-900 transition-colors duration-200"
              >
                Logout
              </button>
            )}
            {!session && (
              <Link
                href="/"
                className={`text-xl font-bold hover:text-secondary-900 transition-colors duration-200 ${
                  isActive('/') ? 'text-secondary-900 underline' : 'text-black'
                }`}
              >
                Sign in
              </Link>
            )}
          </div>
        }
      />
    </div>
  );
}
