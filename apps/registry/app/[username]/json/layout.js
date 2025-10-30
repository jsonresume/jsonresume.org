import { use } from 'react';
import { PublicResumeProvider } from '../../providers/PublicResumeProvider';

export default function JsonLayout({ children, params }) {
  const { username } = use(params);

  return (
    <PublicResumeProvider username={username}>{children}</PublicResumeProvider>
  );
}
