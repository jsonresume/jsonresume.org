'use client';
/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import gravatar from 'gravatar';
import { MapPin } from 'lucide-react';
import { Button } from '@repo/ui/components/ui/button';
import { ResumeProvider, useResume } from '../providers/ResumeProvider';

export default function Layout({ children, username, session }) {
  return (
    <ResumeProvider targetUsername={username}>
      <InnerLayout username={username} session={session}>
        {children}
      </InnerLayout>
    </ResumeProvider>
  );
}

function InnerLayout({ children, username, session }) {
  const router = useRouter();
  const pathname = usePathname();
  const { resume, loading, error } = useResume();

  // Public pages bypass the ProfileLayout wrapper
  const PUBLIC_PAGES = ['timeline', 'jobs', 'json'];
  const isPublicPage = PUBLIC_PAGES.some((page) =>
    pathname.includes(`/${page}`)
  );

  if (isPublicPage) {
    // Public pages handle their own layout and providers
    return <>{children}</>;
  }

  const currentUsername = session?.username;

  const image =
    resume?.basics?.image ||
    gravatar.url(resume?.basics?.email, { s: '200', r: 'x', d: 'retro' }, true);

  if (loading) {
    return <div className="text-lg text-center py-10">Loading resume...</div>;
  }

  if (error) {
    return <div className="text-lg text-center py-10">Error: {error}</div>;
  }

  if (!resume) {
    // Show context-aware authentication messages
    return (
      <div className="max-w-2xl mx-auto text-center py-20 px-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Authentication Required
          </h2>
          {!session ? (
            <>
              <p className="text-gray-600 mb-6">
                This dashboard page requires you to be logged in as{' '}
                <span className="font-semibold">@{username}</span>.
              </p>
              <div className="space-y-4">
                <Button
                  onClick={() => router.push('/login')}
                  className="w-full sm:w-auto"
                >
                  Log In to View Dashboard
                </Button>
                <p className="text-sm text-gray-500">
                  Want to view the public resume?{' '}
                  <Link
                    href={`/${username}`}
                    className="text-blue-600 hover:underline"
                  >
                    Visit @{username}'s profile
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-2">
                You are currently logged in as{' '}
                <span className="font-semibold">@{currentUsername}</span>, but
                this dashboard belongs to{' '}
                <span className="font-semibold">@{username}</span>.
              </p>
              <p className="text-gray-500 mb-6 text-sm">
                You need to be logged in as the correct user to access this
                page.
              </p>
              <div className="space-y-4">
                <Button
                  onClick={() => {
                    router.push('/login');
                  }}
                  className="w-full sm:w-auto"
                >
                  Switch Account
                </Button>
                <p className="text-sm text-gray-500">
                  Want to view the public resume?{' '}
                  <Link
                    href={`/${username}`}
                    className="text-blue-600 hover:underline"
                  >
                    Visit @{username}'s profile
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  const navLinks = [
    { href: `/${username}/dashboard`, label: 'Dashboard' },
    { href: `/${username}/timeline`, label: 'Timeline' },
    { href: `/${username}/jobs`, label: 'Jobs' },
    { href: `/${username}/jobs-graph`, label: 'Jobs Graph' },
    { href: `/${username}/suggestions`, label: 'Suggestions' },
    { href: `/${username}/letter`, label: 'Letter' },
    { href: `/${username}/json`, label: 'View JSON' },
  ];

  return (
    <div className="text-lg min-h-screen flex flex-col items-center px-4 md:px-10">
      <div className="w-full py-10 flex flex-col md:flex-row justify-center items-start">
        <div className="w-full min-w-[300px] md:max-w-[300px] mr-0 md:mr-10 mb-10 md:mb-0">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col items-center">
              <img
                src={image}
                alt={`${resume.basics.name}`}
                className="w-[150px] h-[150px] rounded-full border-4 border-white shadow-md"
              />
              <h2 className="mt-4 mb-2 text-3xl font-semibold text-gray-800">
                {resume.basics.name}
              </h2>
              <p className="mb-2 text-xl text-gray-600">@{username}</p>
              <p className="mb-4 text-lg text-gray-700 text-center">
                {resume.basics.label}
              </p>
              {resume.basics.location && (
                <div className="flex items-center mb-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>
                    {resume.basics.location.city},{' '}
                    {resume.basics.location.region}
                  </span>
                </div>
              )}
              <div className="w-full mt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/editor')}
                >
                  Edit Resume
                </Button>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <nav>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block p-2 rounded transition-colors ${
                        pathname === link.href
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        <div className="flex-1 w-full">{children}</div>
      </div>
    </div>
  );
}
