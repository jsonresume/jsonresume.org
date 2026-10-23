import { Button, PageHeader } from '@jsonresume/ui';

export function NotFoundPage() {
  return (
    <PageHeader
      title="Page not found"
      description="This page doesn’t exist, or it hasn’t moved to the new site yet."
      actions={
        <Button asChild variant="primary">
          <a href="/">Go to the home page</a>
        </Button>
      }
    />
  );
}
