import { Container, Hero, Section } from '@jsonresume/ui';
import type { Doc } from '@repo/domain';
import { MarkdownContent } from '../MarkdownContent';
import * as l from './shared/layout.css';

/** A Markdown document (the privacy policy, the terms) in a reading column. */
export function DocPage({ doc }: { doc: Doc }) {
  return (
    <>
      <Hero
        size="compact"
        align="start"
        title={doc.title}
        lede={doc.description}
      />
      <Section spacing="lg">
        <Container>
          <article className={l.prose}>
            <MarkdownContent>{doc.body}</MarkdownContent>
          </article>
        </Container>
      </Section>
    </>
  );
}
