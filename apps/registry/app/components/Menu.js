'use client';

import Header from '@jsonresume/ui/Header';
import { signOut } from 'next-auth/react';
import Link from '@jsonresume/ui/Link';
import styled from 'styled-components';

const ViewingContainer = styled.div`
  height: 30px;
  line-height: 30px;
  padding: 5px 10px;
  background: #8f9dff;
`;

const Viewing = styled.div`
  width: 800px;
  margin: auto;
  display: flex;
  justify-content: space-between;
`;

export default function Menu({ session }) {
  const username = session?.username;
  return (
    <div style={{ padding: '0 20px', background: '#fff18f' }}>
      <Header
        left={
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            <Link href="/" style={{ fontSize: 18 }}>
              JSON Resume Registry
            </Link>
            <Link href="/explore">Explore</Link>
            <Link href="https://discord.gg/GTZtn8pTXC">Discord</Link>
          </div>
        }
        right={
          <div
            style={{
              display: 'flex',
              gap: '1rem',
            }}
          >
            {username && <Link href={`/${username}/dashboard`}>Profile</Link>}
            {session && username && <Link href={`/editor`}>Editor</Link>}
            {session && <Link onClick={signOut}>Logout</Link>}
            {!session && <Link href="/">Sign in</Link>}
          </div>
        }
      />
      {false && username && (
        <ViewingContainer>
          <Viewing>
            <div>You are currently looking at the profile of @{username}</div>
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
        </ViewingContainer>
      )}
    </div>
  );
}
