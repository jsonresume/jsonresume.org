import {
  Badge,
  Container,
  Hero,
  LinkCard,
  Section,
  SectionIntro,
} from '@jsonresume/ui';
import { ai } from '@repo/content/pages';
import { paths } from '../../links';
import { NextSteps } from '../shared/NextSteps';
import * as l from '../shared/layout.css';

function Tools() {
  return (
    <ul className={l.cardGrid2} aria-label="AI tools">
      {ai.aiTools.map((tool) => (
        <li key={tool.name}>
          <LinkCard
            href={ai.portRequest(tool.name)}
            title={tool.name}
            description={tool.description}
            meta={<Badge tone="warning">Moving from the registry</Badge>}
          />
        </li>
      ))}
    </ul>
  );
}

export function AiPage() {
  return (
    <>
      <Hero
        size="compact"
        align="start"
        eyebrow="AI"
        title="Put your resume to work"
        lede={ai.aiNotes.lede}
      />
      <Section spacing="lg" aria-labelledby="tools">
        <Container>
          <SectionIntro
            overline="Four tools"
            title="Which should come first?"
            headingId="tools"
          >
            {ai.aiNotes.moving}
          </SectionIntro>
          <Tools />
        </Container>
      </Section>
      <Section tone="subtle" spacing="lg" aria-labelledby="how">
        <Container>
          <div className={l.twoCol}>
            <SectionIntro
              overline="Open source"
              title="Built in the open"
              headingId="how"
            />
            <p className={l.body}>
              {ai.aiNotes.openSource} The{' '}
              <a href={ai.aiNotes.source}>registry’s code is on GitHub</a>, and
              so are the <a href={ai.aiNotes.issues}>plans</a>.
            </p>
          </div>
        </Container>
      </Section>
      <NextSteps
        title="Meanwhile"
        items={[
          {
            label: 'Host your resume from a Gist',
            href: `${paths.gettingStarted}#gist`,
          },
          { label: 'What moved from the registry', href: paths.registry },
        ]}
      />
    </>
  );
}
