import { use } from 'react';
import { PublicResumeProvider } from '../../providers/PublicResumeProvider';

export default function ATSLayout({ children, params }) {
  const { username } = use(params);

  return (
    <PublicResumeProvider username={username}>{children}</PublicResumeProvider>
  );
}
