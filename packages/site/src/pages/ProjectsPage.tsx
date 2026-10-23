import { RegistryProvider } from '@effect/atom-react';
import { Container, Hero, Section } from '@jsonresume/ui';
import { projects } from '@repo/content/data';
import { ProjectDirectory } from '@repo/project-directory';
import { external } from '../links';
import { NextSteps } from './shared/NextSteps';

/** The community directory: search, category chips, cards. */
export function ProjectsPage() {
  return (
    <RegistryProvider>
      <Hero
        size="compact"
        align="start"
        eyebrow="Projects"
        title="Built on JSON Resume"
        lede={`${projects.length} tools, libraries and services from the community: editors, exporters, validators, AI helpers and more.`}
      />
      <Section spacing="lg">
        <Container>
          <ProjectDirectory />
        </Container>
      </Section>
      <NextSteps
        title="Built something?"
        items={[
          { label: 'Add it to the list', href: external.contributing },
          { label: 'Browse the source', href: external.github },
        ]}
      />
    </RegistryProvider>
  );
}
