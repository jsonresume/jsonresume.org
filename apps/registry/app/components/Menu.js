'use client';

import Header from '@jsonresume/ui/Header';
import { signOut } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Link from '@jsonresume/ui/Link';
import styled from 'styled-components';

const Viewing = styled.div`
  height: 30px;
  line-height: 30px;
  padding: 5px 10px;
  background: #8f9dff;
  display: flex;
  justify-content: space-between;
`;

export default function Menu({ session }) {
  let { username } = useParams();
  console.log({ session });
  return (
    <>
      <Header
        left={
          <div
            style={{
              display: 'flex',
              gap: '1rem',
            }}
          >
            <Link href="/">JSON Resume Registry</Link>
            <Link href="/explore">Explore</Link>
          </div>
        }
        right={
          <div
            style={{
              display: 'flex',
              gap: '1rem',
            }}
          >
            {username && <Link href={`/${username}/dashboard`}>Dashboard</Link>}
            {session && username && (
              <Link href={`/${username}/editor`}>Editor</Link>
            )}
            {username && <Link href={`/${username}/jobs`}>Jobs</Link>}
            {username && (
              <Link href={`/${username}/suggestions`}>Suggestions</Link>
            )}
            {username && <Link href={`/${username}/interview`}>Interview</Link>}
            {username && <Link href={`/${username}/letter`}>Letter</Link>}
            {session && <Link onClick={signOut}>Logout</Link>}
            {!session && <Link href="/">Sign in</Link>}
          </div>
        }
      />
      {username && (
        <Viewing>
          <div>
            You are currently looking at the profile of github.com/@{username}
          </div>
          <div>
            <Link
              href={`/${username}`}
              target="_blank"
              style={{
                marginRight: 20,
                fontSize: 12,
              }}
            >
              View Resume
            </Link>
            <Link
              href={`/${username}.json`}
              target="_blank"
              style={{
                marginRight: 20,
                fontSize: 12,
              }}
            >
              View JSON
            </Link>
          </div>
        </Viewing>
      )}
    </>
  );
}
