import { RegistryProvider } from '@effect/atom-react';
import { Container, PageHeader, Section } from '@jsonresume/ui';
import { ThemeGallery, themes } from '@repo/theme-gallery';
import { paths, themeImageUrl, themePreviewUrl } from '../links';
import { SiteLink } from '../SiteLink';

export function ThemesPage() {
  return (
    <>
      <PageHeader
        title="Themes"
        description={
          <>
            {themes.length} themes, each an open-source npm package. Every card
            opens a live preview of a real resume. Want your own?{' '}
            <SiteLink href={paths.themeDevelopment}>Build a theme</SiteLink>.
          </>
        }
      />
      <Section spacing="lg">
        <Container size="wide">
          {/* Atoms live with the feature that uses them, so Effect's runtime
              loads only on this page; one registry per render keeps SSR safe. */}
          <RegistryProvider>
            <ThemeGallery
              image={(theme) => themeImageUrl(theme.slug)}
              href={(theme) => themePreviewUrl(theme.slug)}
            />
          </RegistryProvider>
        </Container>
      </Section>
    </>
  );
}
