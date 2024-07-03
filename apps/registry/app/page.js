'use server';
import SignIn from './components/SignIn';
import { auth } from '../auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth();

  console.log({ session });

  if (!session) {
    return <SignIn />;
  }

  if (session) {
    redirect(`/editor`);
  }

  console.log('Hello, %s', { session });

  return null;
}
