import Header from '@jsonresume/ui/Header';
import { signOut } from 'next-auth/react';
import Link from '@jsonresume/ui/Link';
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
              lineHeight: '1.8rem',
              height: '100%',
            }}
          >
            <Link href="/" style={{ fontSize: '1.8rem' }}>
              JSON Resume Registry
            </Link>
            <Link style={{ marginLeft: 20 }} href="/explore">
              Explore
            </Link>
            <Link href="https://discord.gg/GTZtn8pTXC">Discord</Link>
          </div>
        }
        right={
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              height: '30px',
            }}
          >
            {username && <Link href={`/${username}/dashboard`}>Profile</Link>}
            {session && username && <Link href={`/editor`}>Editor</Link>}
            {session && <Link onClick={signOut}>Logout</Link>}
            {!session && <Link href="/">Sign in</Link>}
          </div>
        }
      />
    </div>
  );
}
