import { Button, EmptyState } from '@jsonresume/ui';
import { Briefcase } from 'lucide-react';

export default function EmptyStateWithIcon() {
  return (
    <EmptyState
      icon={<Briefcase size={32} strokeWidth={1.5} />}
      title="No matching jobs yet"
      action={<Button>Edit your skills</Button>}
    >
      We match your resume against Hacker News hiring posts every day. Check
      back tomorrow.
    </EmptyState>
  );
}
