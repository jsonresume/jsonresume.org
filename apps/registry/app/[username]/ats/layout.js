import { PublicResumeProvider } from '../../providers/PublicResumeProvider';

export default function ATSLayout({ children, params }) {
  const { username } = params;

  return (
    <PublicResumeProvider username={username}>{children}</PublicResumeProvider>
  );
}
