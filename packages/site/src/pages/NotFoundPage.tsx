import { Button, PageHeader } from '@jsonresume/ui';
import { paths } from '../links';
import { SiteLink } from '../SiteLink';

export function NotFoundPage() {
  return (
    <>
      {/* React hoists this into <head>; missing pages stay out of search. */}
      <meta name="robots" content="noindex" />
      <PageHeader
        title="Page not found"
        description="This page doesn’t exist, or it hasn’t moved to the new site yet."
        actions={
          <Button asChild variant="primary">
            <SiteLink href={paths.home}>Go to the home page</SiteLink>
          </Button>
        }
      />
    </>
  );
}
