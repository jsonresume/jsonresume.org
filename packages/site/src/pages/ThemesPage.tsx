import { RegistryProvider } from '@effect/atom-react';
import { Container, Hero, Section } from '@jsonresume/ui';
import { ThemeGallery, themes } from '@repo/theme-gallery';
import { paths, themeImageUrl, themePreviewUrl } from '../links';
import { NextSteps } from './shared/NextSteps';

export function ThemesPage() {
  return (
    <>
      <Hero
        size="compact"
        align="start"
        eyebrow="Themes"
        title={`${themes.length} ways to look the part`}
        lede="Every theme is an open-source npm package that renders the same resume.json. Each card opens a live preview of a real resume."
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
