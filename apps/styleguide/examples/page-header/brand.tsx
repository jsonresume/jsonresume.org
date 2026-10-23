import { Button, PageHeader } from '@jsonresume/ui';

// The brand tone suits landing sections inside the registry.
export default function PageHeaderBrand() {
  return (
    <PageHeader
      tone="brand"
      title="Your resume as code"
      description="Write it once in JSON, render it in any theme, host it from a gist."
      actions={<Button variant="primary">Get started</Button>}
    />
  );
}
