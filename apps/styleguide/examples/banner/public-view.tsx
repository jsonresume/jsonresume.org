'use client';

import { Banner, Button } from '@jsonresume/ui';

export default function BannerPublicView() {
  return (
    <Banner
      label="Public view"
      dismissible
      action={
        <Button variant="ink" size="sm">
          Sign in
        </Button>
      }
    >
      You&apos;re viewing a public dashboard. Sign in to track applications and
      get job matches.
    </Banner>
  );
}
