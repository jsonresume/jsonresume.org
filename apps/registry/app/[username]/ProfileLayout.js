'use client';
/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { usePathname } from 'next/navigation';
import gravatar from 'gravatar';
import { ResumeProvider, useResume } from '../providers/ResumeProvider';
import { AuthRequired } from './ProfileLayoutModule/components/AuthRequired';
import { ProfileCard } from './ProfileLayoutModule/components/ProfileCard';
import { NavigationMenu } from './ProfileLayoutModule/components/NavigationMenu';

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
  const pathname = usePathname();
  const { resume, loading, error } = useResume();

  // Public pages bypass the ProfileLayout wrapper
  const PUBLIC_PAGES = ['timeline', 'jobs', 'json', 'ats'];
  const isPublicPage = PUBLIC_PAGES.some((page) =>
    pathname.includes(`/${page}`)
  );

  if (isPublicPage) {
    // Public pages handle their own layout and providers
    return <>{children}</>;
  }

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
    return <AuthRequired username={username} session={session} />;
  }

  return (
    <div className="text-lg min-h-screen flex flex-col items-center px-4 md:px-10">
      <div className="w-full py-10 flex flex-col md:flex-row justify-center items-start">
        <div className="w-full min-w-[300px] md:max-w-[300px] mr-0 md:mr-10 mb-10 md:mb-0">
          <ProfileCard resume={resume} username={username} image={image} />
          <NavigationMenu username={username} />
        </div>
        <div className="flex-1 w-full">{children}</div>
      </div>
    </div>
  );
}
