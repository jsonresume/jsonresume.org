import { Button, Logo, SiteHeader, SiteHeaderLink } from '@jsonresume/ui';

export default function SiteHeaderDefault() {
  return (
    <SiteHeader
      brand={<Logo />}
      actions={
        <Button variant="ink" size="sm">
          Sign in
        </Button>
      }
    >
      <SiteHeaderLink href="#getting-started" active>
        Getting Started
      </SiteHeaderLink>
      <SiteHeaderLink href="#schema">Schema</SiteHeaderLink>
      <SiteHeaderLink href="#themes">Themes</SiteHeaderLink>
      <SiteHeaderLink href="#docs">Docs</SiteHeaderLink>
    </SiteHeader>
  );
}
