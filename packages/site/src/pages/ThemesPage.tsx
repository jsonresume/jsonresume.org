import { RegistryProvider } from '@effect/atom-react';
import { Container, Hero, Section } from '@jsonresume/ui';
import { ThemeGallery, themes } from '@repo/theme-gallery';
import { paths, themeImageUrl, themePreviewUrl } from '../links';
import { NextSteps } from './shared/NextSteps';
import { ThemeUse } from './themes/ThemeUse';

export function ThemesPage() {
  return (
    <>
      <Hero
        size="compact"
        align="start"
        eyebrow={`${themes.length} themes`}
        title="Choose how your resume looks"
        lede="Every theme renders the same resume.json, so switching is a one-word change. Open one to see it on a real resume, then flip through the rest with the arrow keys."
      />
      <Section spacing="lg">
        <Container size="wide">
          {/* Atoms live with the feature that uses them, so Effect's runtime
              loads only on this page; one registry per render keeps SSR safe. */}
          <RegistryProvider>
            <ThemeGallery
              image={(theme) => themeImageUrl(theme.slug)}
              href={(theme) => themePreviewUrl(theme.slug)}
              page={(theme) => paths.theme(theme.slug)}
              details={(theme) => <ThemeUse theme={theme} />}
            />
          </RegistryProvider>
        </Container>
      </Section>
      <NextSteps
        title="Want a look of your own?"
        items={[
          { label: 'Build a theme', href: paths.themeDevelopment },
          { label: 'Use a theme with the CLI', href: paths.cli },
        ]}
      />
    </>
  );
}
