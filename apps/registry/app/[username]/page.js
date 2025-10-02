import { redirect } from 'next/navigation';

export default function UsernamePage({ params }) {
  const { username } = params;
  redirect(`/${username}/dashboard`);
}
