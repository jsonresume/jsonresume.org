import { Button, PageHeader } from '@jsonresume/ui';

export default function PageHeaderDefault() {
  return (
    <PageHeader
      eyebrow="Docs"
      title="Schema"
      description="The JSON Resume schema: a community-driven standard for resumes."
      actions={<Button>View on GitHub</Button>}
    />
  );
}
