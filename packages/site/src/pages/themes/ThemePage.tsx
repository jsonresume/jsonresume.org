import {
  BackLink,
  Button,
  Container,
  DescriptionList,
  Hero,
  Section,
} from '@jsonresume/ui';
import {
  THEME_COLORS,
  THEME_LAYOUTS,
  THEME_STYLES,
} from '@jsonresume/theme-metadata';
import type { ThemeSummary } from '@repo/domain';
import { ThemeGrid } from '@repo/theme-gallery/grid';
import { paths, themeImageUrl, themePreviewUrl } from '../../links';
import { ThemeUse } from './ThemeUse';
import * as s from './themePage.css';

export interface ThemePageProps {
  theme: ThemeSummary;
  /** Themes of the same style, to compare. */
  similar: ReadonlyArray<ThemeSummary>;
}

const resumes = (n: number) =>
  n === 0
    ? 'New'
    : `${n.toLocaleString('en')} public resume${n === 1 ? '' : 's'}`;

/** One theme: what it looks like, what it's for, and how to use it. */
export function ThemePage({ theme, similar }: ThemePageProps) {
  const start = `${paths.start}?theme=${encodeURIComponent(theme.slug)}`;
  return (
    <>
      <Hero
        size="compact"
        align="start"
        eyebrow={`${THEME_STYLES[theme.style] ?? theme.style} resume theme`}
        title={theme.name}
        lede={theme.description}
        actions={
          <>
            <Button asChild variant="primary" size="lg">
              <a href={start}>Start your resume in {theme.name}</a>
            </Button>
            <Button asChild size="lg">
              <a href={themePreviewUrl(theme.slug)}>Live preview</a>
            </Button>
          </>
        }
      />
      <Section spacing="lg">
        <Container>
          <BackLink href={paths.themes}>Back to all themes</BackLink>
          <div className={s.layout}>
            <a href={themePreviewUrl(theme.slug)} className={s.shotLink}>
              <img
                className={s.shot}
                src={themeImageUrl(theme.slug)}
                alt={`A resume in the ${theme.name} theme`}
                width={800}
                height={640}
                fetchPriority="high"
              />
            </a>
            <div className={s.side}>
              <DescriptionList
                items={[
                  {
                    term: 'Style',
                    description: THEME_STYLES[theme.style] ?? theme.style,
                  },
                  {
                    term: 'Layout',
                    description: THEME_LAYOUTS[theme.layout] ?? theme.layout,
                  },
                  {
                    term: 'Colour',
                    description: THEME_COLORS[theme.color] ?? theme.color,
                  },
                  {
                    term: 'Used by',
                    description: resumes(theme.usage.resumes),
                  },
                  { term: 'Made by', description: theme.author },
                ]}
              />
              <ThemeUse theme={theme} />
            </div>
          </div>
        </Container>
      </Section>
      {similar.length > 0 && (
        <Section spacing="lg" tone="subtle" aria-labelledby="similar">
          <Container>
            <h2 id="similar" className={s.similarTitle}>
              More {(THEME_STYLES[theme.style] ?? theme.style).toLowerCase()}{' '}
              themes
            </h2>
            <ThemeGrid
              label={`More ${theme.style} themes`}
              themes={similar}
              image={(t) => themeImageUrl(t.slug)}
              href={(t) => paths.theme(t.slug)}
            />
          </Container>
        </Section>
      )}
    </>
  );
}
