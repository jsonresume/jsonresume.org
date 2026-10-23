import { Container, PageHeader, Section } from '@jsonresume/ui';
import type { Doc } from '@repo/domain';
import type { ReactNode } from 'react';
import { MarkdownContent } from '../MarkdownContent';
import * as s from './pages.css';

export interface DocPageProps {
  doc: Doc;
  /** Small label above the title, e.g. "Documentation". */
  eyebrow?: string;
  /** Rendered after the document, e.g. a related list. */
  children?: ReactNode;
}

/** A long-form page: title band, then the document in a prose column. */
export function DocPage({ doc, eyebrow, children }: DocPageProps) {
  return (
    <>
      <PageHeader
        title={doc.title}
        description={doc.description}
        eyebrow={eyebrow}
      />
      <Section spacing="lg">
        <Container>
          <div className={s.proseColumn}>
            <MarkdownContent>{doc.body}</MarkdownContent>
            {children}
          </div>
        </Container>
      </Section>
    </>
  );
}
