'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Menu as MenuIcon, X } from 'lucide-react';
import Header from './Header';

export default function Menu({ session }) {
  const pathname = usePathname();
  const username = session?.username;
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => pathname === path;
  const isProfileActive = pathname.startsWith(`/${username}`);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { href: '/explore', label: 'Explore' },
    { href: '/jobs', label: 'Jobs' },
    { href: '/job-similarity', label: 'Similarity' },
    { href: 'https://github.com/jsonresume/jsonresume.org', label: 'Github', external: true },
    { href: 'https://discord.gg/GTZtn8pTXC', label: 'Discord', external: true },
  ];

  const authItems = [
    ...(username ? [
      { href: `/${username}/dashboard`, label: 'Profile' },
      { href: '/editor', label: 'Editor' },
    ] : []),
    session ? { onClick: signOut, label: 'Logout' } : { href: '/', label: 'Sign in' },
  ];

  return (
    <div className="bg-accent-200 shadow-md">
      <Header
        left={
          <div className="flex items-center justify-between w-full lg:w-auto p-4 lg:p-5">
            <Link
              href="/"
              className="text-2xl font-bold text-black hover:text-secondary-900 transition-colors duration-200"
            >
              JSON Resume Registry
            </Link>
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 text-black hover:text-secondary-900"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        }
        right={
          <div className={`${isOpen ? 'block' : 'hidden'} lg:flex lg:items-center lg:flex-1`}>
            <nav className="flex flex-col lg:flex-row lg:items-center lg:justify-end gap-4 p-4 lg:p-5">
              {menuItems.map((item) => (
                item.external ? (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-lg lg:text-xl font-bold text-black hover:text-secondary-900 transition-colors duration-200 py-2 lg:py-0"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-lg lg:text-xl font-bold ${
                      isActive(item.href) || (item.href === '/jobs' && pathname.startsWith('/jobs/'))
                        ? 'text-secondary-900 underline'
                        : 'text-black'
                    } hover:text-secondary-900 transition-colors duration-200 py-2 lg:py-0`}
                  >
                    {item.label}
                  </Link>
                )
              ))}
              {authItems.map((item) => (
                item.onClick ? (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className="text-lg lg:text-xl font-bold text-black hover:text-secondary-900 transition-colors duration-200 py-2 lg:py-0 text-left"
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-lg lg:text-xl font-bold hover:text-secondary-900 transition-colors duration-200 py-2 lg:py-0 ${
                      (item.href === `/${username}/dashboard` && isProfileActive) ||
                      isActive(item.href)
                        ? 'text-secondary-900 underline'
                        : 'text-black'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </nav>
          </div>
        }
      />
    </div>
  );
}
