import React from 'react';
import ProfileLayout from './ProfileLayout';
import { auth } from '../../auth';

export default async function Layout({ children, params }) {
  const { username } = await params;
  const session = await auth();

  return (
    <ProfileLayout session={session} username={username}>
      {React.cloneElement(children, { username, session })}
    </ProfileLayout>
  );
}
