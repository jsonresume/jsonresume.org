import {
  Button,
  Callout,
  Container,
  CopyButton,
  Hero,
  LinkCard,
  Section,
  SectionIntro,
  Table,
  Td,
  Th,
} from '@jsonresume/ui';
import { facts } from '@repo/content/facts';
import { fillFacts } from '@repo/content/placeholders';
import { media } from '@repo/content/pages';
import { isSitePath, SiteLink } from '../../SiteLink';
import { NextSteps } from '../shared/NextSteps';
import * as l from '../shared/layout.css';
import * as s from './media.css';

function Boilerplate({ title, text }: { title: string; text: string }) {
  return (
    <div className={l.panel}>
      <div className={l.actions}>
        <h3 className={l.panelTitle}>{title}</h3>
        <CopyButton
          value={text}
          size="sm"
          label={`Copy ${title.toLowerCase()}`}
        />
      </div>
      <p className={s.quote}>{text}</p>
    </div>
  );
}

const SourceLink = ({ href, label }: { href: string; label: string }) =>
  isSitePath(href) ? (
    <SiteLink href={href}>{label}</SiteLink>
  ) : (
    <a href={href}>{label}</a>
  );

export function MediaPage() {
  const c = media.contact;
  return (
    <>
      <Hero
        size="compact"
        align="start"
        eyebrow="Media"
        title="JSON Resume, for the record"
        lede="Facts, ready-to-use text, a fictional example and original sources for people writing about the project."
        actions={
          <>
            <Button asChild variant="primary">
              <a href={c.mailto}>Contact {c.name}</a>
            </Button>
            <Button asChild>
              <a href="/media/facts.txt" download>
                Download the factsheet
              </a>
            </Button>
          </>
        }
        media={
          <img
            className={s.shot}
            src="/media/example-resume.png"
            alt="Alex Example's fictional résumé, rendered from the example JSON"
            width={1200}
            height={900}
          />
        }
      />
      <Section spacing="lg" aria-labelledby="copy">
        <Container>
          <SectionIntro
            overline="Copy"
            title="In a sentence or two"
            headingId="copy"
          />
          <div className={l.twoCol}>
            <Boilerplate
              title="Short description"
              text={media.boilerplate.short}
            />
            <Boilerplate title="Founder bio" text={media.boilerplate.founder} />
          </div>
        </Container>
      </Section>
      <Section tone="subtle" spacing="lg" aria-labelledby="facts">
        <Container>
          <SectionIntro
            overline="Checked 21 October 2026"
            title="Facts, with sources"
            headingId="facts"
          >
            Counts come from the project’s source. They are not estimates of how
            many people use JSON Resume.
          </SectionIntro>
          <Table caption="Facts about JSON Resume">
            <thead>
              <tr>
                <Th>Fact</Th>
                <Th>Value</Th>
                <Th>Source</Th>
              </tr>
            </thead>
            <tbody>
              {media.sourcedFacts.map((fact) => (
                <tr key={fact.label}>
                  <Td>{fact.label}</Td>
                  <Td>
                    <strong>{fillFacts(fact.value, facts)}</strong>
                  </Td>
                  <Td>
                    <SourceLink
                      href={fact.source.href}
                      label={fact.source.label}
                    />
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Callout className={l.spaced} title="Worth knowing">
            {media.boilerplate.limitations}
          </Callout>
        </Container>
      </Section>
      <Section spacing="lg" aria-labelledby="assets">
        <Container>
          <SectionIntro
            overline="Downloads"
            title="One example, ready to use"
            headingId="assets"
          >
            Meet Alex Example, a fictional profile you can show without exposing
            anyone’s details. {media.usage}
          </SectionIntro>
          <ul className={l.cardGrid}>
            {media.assets.map((asset) => (
              <li key={asset.href} className={s.asset}>
                {asset.preview ? (
                  <img
                    className={s.assetShot}
                    src={asset.preview}
                    alt=""
                    width={1200}
                    height={900}
                    loading="lazy"
                  />
                ) : (
                  <span />
                )}
                <span className={s.assetBody}>
                  <span className={s.assetFormat}>{asset.format}</span>
                  <a href={asset.href} download>
                    {asset.title}
                  </a>
                  <span className={l.muted}>{asset.description}</span>
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <Section tone="subtle" spacing="lg" aria-labelledby="contact">
        <Container>
          <div className={l.twoCol}>
            <div className={s.contact}>
              <SectionIntro
                overline="Interviews"
                title="Talk to us"
                headingId="contact"
              />
              <p className={s.name}>{c.name}</p>
              <p className={l.muted}>{c.role}</p>
              <p className={l.body}>{c.about}</p>
              <p className={l.body}>
                <a href={c.mailto}>{c.email}</a> · <a href={c.github}>GitHub</a>{' '}
                · <a href={c.resume}>Résumé</a>
              </p>
              <p className={l.muted}>{c.ask}</p>
            </div>
            <div className={l.stack}>
              <h3 className={l.panelTitle}>Used elsewhere</h3>
              {media.implementations.map((item) => (
                <LinkCard
                  key={item.href}
                  href={item.href}
                  title={item.title}
                  description={item.description}
                  eyebrow="Independent project"
                />
              ))}
            </div>
          </div>
        </Container>
      </Section>
      <NextSteps
        title="More background"
        items={[
          { label: 'Project history', href: '/team#history' },
          { label: 'How the schema evolves', href: media.roadmap },
        ]}
      />
    </>
  );
}
