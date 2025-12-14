import { PublicResumeProvider } from '../../providers/PublicResumeProvider';

export default async function JsonLayout({ children, params }) {
  const { username } = await params;

  return (
    <PublicResumeProvider username={username}>{children}</PublicResumeProvider>
  );
}
