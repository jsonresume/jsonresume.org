import { Container, Section, Stat, Stats } from '@jsonresume/ui';
import { themeCount } from '../../data/themes';

// Figures checked 2026-10-23: hosted resumes from the registry database;
// stars summed over resume-schema, resume-cli and jsonresume.org on GitHub.
export function ProjectStats() {
  return (
    <Section tone="subtle" spacing="md" aria-label="JSON Resume in numbers">
      <Container>
        <Stats>
          <Stat value={themeCount} label="Themes" />
          <Stat value="4,800+" label="Hosted resumes" />
          <Stat value="7,400+" label="GitHub stars" />
          <Stat value="2014" label="Open since" />
        </Stats>
      </Container>
    </Section>
  );
}
