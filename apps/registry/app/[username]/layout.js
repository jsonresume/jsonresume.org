import React from 'react';
import getResumeGist from '../../lib/getResumeGist';
import ProfileLayout from './ProfileLayout';
import { auth } from '../../auth';

export default async function Layout({ children, params }) {
  const { username } = params;
  const session = await auth();

  // @todo - this needs to be cached a bit
  const { resume } = await getResumeGist(username);
  console.log({ resume });

  return (
    <>
      <ProfileLayout session={session} resume={resume} username={username}>
        {React.cloneElement(children, { resume, username, session })}
      </ProfileLayout>
    </>
  );
}
