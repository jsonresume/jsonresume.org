import {
  Badge,
  Button,
  Container,
  Hero,
  LinkCard,
  Section,
  SectionIntro,
} from '@jsonresume/ui';
import { registry as r } from '@repo/content/pages';
import { InlineMarkdown } from '../../InlineMarkdown';
import { paths } from '../../links';
import { SiteLink } from '../../SiteLink';
import * as l from '../shared/layout.css';

/**
 * Where registry.jsonresume.org now points: what moved here, what hasn't
 * yet, and how to ask for it.
 */
export function RegistryPage() {
  return (
    <>
      <Hero
        size="compact"
        align="start"
        eyebrow={r.intro.eyebrow}
        title={r.intro.title}
        lede={r.intro.lede}
        actions={
          <>
            <Button asChild variant="primary">
              <SiteLink href={paths.signIn}>Sign in with GitHub</SiteLink>
            </Button>
            <Button asChild variant="secondary">
              <a href={r.ask.issue}>Ask for a feature</a>
            </Button>
          </>
        }
      />
      <Section spacing="lg" aria-labelledby="moved">
        <Container>
          <SectionIntro
            overline="Already here"
            title="What moved"
            headingId="moved"
          />
          <ul className={l.cardGrid2} aria-label="Moved from the registry">
            {r.moved.map((item) => (
              <li key={item.title}>
                <LinkCard
                  asChild
                  title={item.title}
                  description={item.description}
                >
                  <SiteLink href={item.href} />
                </LinkCard>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <Section tone="subtle" spacing="lg" aria-labelledby="not-yet">
        <Container>
          <SectionIntro
            overline="Coming"
            title="Not moved yet"
            headingId="not-yet"
          >
            Each opens a GitHub issue asking for it, so we know what to bring
            over first.
          </SectionIntro>
          <ul className={l.cardGrid} aria-label="Not moved yet">
            {r.notYet.map((item) => (
              <li key={item.title}>
                <LinkCard
                  href={r.portRequest(item.title)}
                  title={item.title}
                  description={
                    <InlineMarkdown>{item.description}</InlineMarkdown>
                  }
                  meta={<Badge tone="warning">Ask for it</Badge>}
                />
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <Section spacing="lg" aria-labelledby="ask">
        <Container>
          <SectionIntro overline="GitHub" title={r.ask.title} headingId="ask">
            {r.ask.text}
          </SectionIntro>
          <Button asChild variant="primary">
            <a href={r.ask.issues}>Open the issues</a>
          </Button>
        </Container>
      </Section>
    </>
  );
}
