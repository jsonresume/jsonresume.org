import { Container, Section, Stat, Stats } from '@jsonresume/ui';
import { facts } from '@repo/content/facts';

// Stars checked 2026-10-23, summed over resume-schema, resume-cli and jsonresume.org on GitHub.
export function ProjectStats() {
  return (
    <Section tone="subtle" spacing="md" aria-label="JSON Resume in numbers">
      <Container>
        <Stats>
          <Stat value={facts.themeCount} label="Themes" />
          <Stat value="7,400+" label="GitHub stars" />
          <Stat value="2014" label="Open since" />
        </Stats>
      </Container>
    </Section>
  );
}
