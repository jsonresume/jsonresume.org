import { Button, Container, Section } from '@jsonresume/ui';
import { facts } from '@repo/content/facts';
import { findTheme } from '@repo/theme-gallery/catalog';
import { ThemeGrid } from '@repo/theme-gallery/grid';
import type { ThemeSummary } from '@repo/domain';
import { paths, themeImageUrl, themePreviewUrl } from '../links';
import { SiteLink } from '../SiteLink';
import * as s from './home.css';
import { SectionIntro } from './SectionIntro';

/** A varied handful for the home page. */
const FEATURED = [
  'art-school-modern',
  'sidebar-photo-strip',
  'bold-header-statement',
  'art-deco',
  'typewriter-modern',
  'brutalist',
  'desert-modern',
  'kendall',
];

export const featuredThemes: ReadonlyArray<ThemeSummary> = FEATURED.map(
  (slug) => {
    const theme = findTheme(slug);
    if (!theme) throw new Error(`Unknown featured theme: ${slug}`);
    return theme;
  }
);

export function ThemeShowcase() {
  return (
    <Section tone="subtle" spacing="xl" aria-labelledby="themes">
      <Container>
        <SectionIntro
          id="themes"
          overline="Themes"
          title="A look for every kind of career"
          centered
        >
          Themes are open-source npm packages. Switch between them without
          touching your resume.
        </SectionIntro>
        <ThemeGrid
          label="Featured themes"
          themes={featuredThemes}
          image={(theme) => themeImageUrl(theme.slug)}
          href={(theme) => themePreviewUrl(theme.slug)}
        />
        <div className={s.center}>
          <Button asChild size="lg">
            <SiteLink href={paths.themes}>
              See all {facts.themeCount} themes
            </SiteLink>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
