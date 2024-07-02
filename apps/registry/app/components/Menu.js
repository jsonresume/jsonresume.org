'use client';

import Header from '@jsonresume/ui/Header';
import { signOut } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Link from '@jsonresume/ui/Link';

export default function Menu({ session }) {
  const { username } = useParams();
  return (
    <>
      <Header
        left={
          <div>
            <Link href="/">JSON Resume Registry</Link>
          </div>
        }
        right={
          <div
            style={{
              display: 'flex',
              gap: '1rem',
            }}
          >
            {session && <Link href={`/${username}/editor`}>Editor</Link>}
            {<Link href={`/${username}/jobs`}>Jobs</Link>}
            {<Link href={`/${username}/suggestions`}>Suggestions</Link>}
            {<Link href={`/${username}/interview`}>Interview</Link>}
            {<Link href={`/${username}/letter`}>Letter</Link>}
            {session && <Link onClick={signOut}>Logout</Link>}
            {<Link onClick={signOut}>Sign in</Link>}
          </div>
        }
      />
      <div style={{ height: 50, background: 'teal' }}>
        You are currently looking at this profile
      </div>
    </>
  );
}
