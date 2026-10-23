import { Button, Card, Container, Section } from '@jsonresume/ui';
import { featuredThemes, themeCount } from '../../data/themes';
import { links, themePreviewUrl } from '../../site';
import * as s from './home.css';
import { SectionIntro } from './SectionIntro';

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
        <ul className={s.themeGrid} role="list">
          {featuredThemes.map((theme) => (
            <li key={theme.slug}>
              <Card asChild interactive tone="raised">
                <a className={s.themeLink} href={themePreviewUrl(theme.slug)}>
                  <img
                    className={s.themeShot}
                    src={theme.image}
                    alt=""
                    width={800}
                    height={640}
                    loading="lazy"
                  />
                  <span className={s.themeBody}>
                    <span className={s.themeName}>{theme.name}</span>
                    <span className={s.themeDescription}>
                      {theme.description}
                    </span>
                  </span>
                </a>
              </Card>
            </li>
          ))}
        </ul>
        <div className={s.center}>
          <Button asChild size="lg">
            <a href={links.themes}>See all {themeCount} themes</a>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
