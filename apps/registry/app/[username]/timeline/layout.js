import { PublicResumeProvider } from '../../providers/PublicResumeProvider';

export default function TimelineLayout({ children, params }) {
  const { username } = params;

  return (
    <PublicResumeProvider username={username}>{children}</PublicResumeProvider>
  );
}
