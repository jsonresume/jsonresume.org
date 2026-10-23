import { RegistryProvider } from '@effect/atom-react';
import {
  Badge,
  Container,
  Hero,
  LinkCard,
  Section,
  SectionIntro,
} from '@jsonresume/ui';
import { ai } from '@repo/content/pages';
import { GithubUserField, useGithubUser } from '../../githubUser';
import { InlineMarkdown } from '../../InlineMarkdown';
import { paths } from '../../links';
import { NextSteps } from '../shared/NextSteps';
import * as l from '../shared/layout.css';

function Tools() {
  const user = useGithubUser();
  return (
    <ul className={l.cardGrid2} aria-label="AI tools">
      {ai.aiTools.map((tool) => (
        <li key={tool.name}>
          <LinkCard
            href={tool.path(user)}
            title={tool.name}
            description={tool.description}
            meta={
              <>
                <Badge tone={tool.access === 'public' ? 'success' : 'neutral'}>
                  {tool.access === 'public' ? 'Public' : 'Sign in with GitHub'}
                </Badge>
                <span className={l.url}>
                  {tool
                    .path(user)
                    .replace('https://registry.jsonresume.org', '')}
                </span>
              </>
            }
          />
        </li>
      ))}
    </ul>
  );
}

export function AiPage() {
  return (
    <RegistryProvider>
      <Hero
        size="compact"
        align="start"
        eyebrow="AI"
        title="Put your resume to work"
        lede="Open-source tools on the registry send your hosted resume to a model with a fixed prompt: matching jobs, a cover letter, feedback, and an interviewer who knows your history."
      />
      <Section spacing="lg" aria-labelledby="tools">
        <Container>
          <div className={l.twoCol}>
            <SectionIntro
              overline="Four tools"
              title="Try them with your resume"
              headingId="tools"
            >
              Enter your GitHub username and every link below opens for you.
            </SectionIntro>
            <div className={l.panel}>
              <GithubUserField />
              <p className={l.muted}>
                <InlineMarkdown>{ai.aiNotes.requirement}</InlineMarkdown>
              </p>
            </div>
          </div>
          <Tools />
        </Container>
      </Section>
      <Section tone="subtle" spacing="lg" aria-labelledby="how">
        <Container>
          <div className={l.twoCol}>
            <SectionIntro
              overline="How it works"
              title="Open source, shared limits"
              headingId="how"
            />
            <div className={l.stackTight}>
              <p className={l.body}>{ai.aiNotes.openSource}</p>
              <p className={l.body}>
                Cover letters, suggestions and interviews need you to{' '}
                <a href={ai.aiNotes.signIn}>
                  sign in to the registry with GitHub
                </a>
                . The <a href={ai.aiNotes.source}>code is on GitHub</a>.
              </p>
            </div>
          </div>
        </Container>
      </Section>
      <NextSteps
        title="No hosted resume yet?"
        items={[
          {
            label: 'Host it from a Gist',
            href: `${paths.gettingStarted}#gist`,
          },
          { label: 'Sign in to the registry', href: ai.aiNotes.signIn },
        ]}
      />
    </RegistryProvider>
  );
}
