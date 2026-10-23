import { Button, EmptyState } from '@jsonresume/ui';

export default function EmptyStateBasic() {
  return (
    <EmptyState
      title="No resume found"
      action={<Button variant="primary">Create a resume</Button>}
      style={{ width: '100%' }}
    >
      Create a gist named resume.json on GitHub, or start from the editor.
    </EmptyState>
  );
}
