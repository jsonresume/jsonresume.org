'use client';
/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ProfileProvider } from './ProfileContext';
import gravatar from 'gravatar';
import { MapPin } from 'lucide-react';
import { Button } from '@repo/ui/components/ui/button';

export default function Layout({ children, resume, username, session }) {
  const router = useRouter();
  const pathname = usePathname();

  const image =
    resume?.basics?.image ||
    gravatar.url(resume?.basics?.email, { s: '200', r: 'x', d: 'retro' }, true);

  if (!resume) {
    return <div className="text-lg text-center py-10">Resume not found</div>;
  }

  const navLinks = [
    { href: `/${username}/dashboard`, label: 'Dashboard' },
    { href: `/${username}/jobs`, label: 'Jobs' },
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
              <div className="flex items-center mb-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1 text-primary" />
                <span>
                  {resume.basics.location.countryCode ||
                    'Location not available'}
                </span>
              </div>
              <a
                href={`mailto:${resume.basics.email}`}
                className="mb-4 text-sm text-primary hover:underline"
              >
                {resume.basics.email}
              </a>
              <div className="flex flex-col items-center mt-4 space-y-2">
                <a href={`/${username}`} target="_blank">
                  <Button>View Resume</Button>
                </a>
              </div>
              <br />
              {session && (
                <Button onClick={() => router.push('/editor')}>
                  Edit Resume
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md max-w-[800px] w-full">
          <div className="flex justify-start gap-4 mb-4 pb-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} passHref>
                <span
                  className={`text-gray-700 hover:text-gray-900 py-2 px-4 rounded-full ${
                    pathname === link.href
                      ? 'bg-primary text-white'
                      : 'bg-secondary-light hover:bg-secondary'
                  } transition-colors duration-200`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
          <ProfileProvider
            resume={resume}
            username={username}
            session={session}
          >
            {children}
          </ProfileProvider>
        </div>
      </div>
    </div>
  );
}
