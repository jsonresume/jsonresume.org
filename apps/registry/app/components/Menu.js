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
    <div className="px-5 bg-yellow-200 shadow-md">
      <Header
        left={
          <div className="flex gap-6 items-center h-full leading-7">
            <Link
              href="/"
              className={`text-2xl font-bold ${
                isActive('/') ? 'text-blue-600' : 'text-gray-800'
              } hover:text-blue-600 transition-colors duration-200`}
            >
              JSON Resume Registry
            </Link>
            <Link
              href="/explore"
              className={`ml-5 text-lg ${
                isActive('/explore') ? 'text-blue-600' : 'text-gray-800'
              } hover:text-blue-600 transition-colors duration-200`}
            >
              Explore
            </Link>
            <a
              href="https://discord.gg/GTZtn8pTXC"
              className="text-lg text-gray-800 hover:text-blue-600 transition-colors duration-200"
            >
              Discord
            </a>
          </div>
        }
        right={
          <div className="flex gap-6 items-center h-[30px]">
            {username && (
              <Link
                href={`/${username}/dashboard`}
                className={`text-lg hover:text-blue-600 transition-colors duration-200 ${
                  isProfileActive ? 'text-blue-600' : 'text-gray-800'
                }`}
              >
                Profile
              </Link>
            )}
            {session && username && (
              <Link
                href="/editor"
                className={`text-lg hover:text-blue-600 transition-colors duration-200 ${
                  isActive('/editor') ? 'text-blue-600' : 'text-gray-800'
                }`}
              >
                Editor
              </Link>
            )}
            {session && (
              <button
                onClick={signOut}
                className="text-lg text-gray-800 hover:text-blue-600 transition-colors duration-200"
              >
                Logout
              </button>
            )}
            {!session && (
              <Link
                href="/"
                className={`text-lg hover:text-blue-600 transition-colors duration-200 ${
                  isActive('/') ? 'text-blue-600' : 'text-gray-800'
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
