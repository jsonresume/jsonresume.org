import { Container, Heading } from '@jsonresume/ui';
import type { ReactNode } from 'react';
import { DocsSidebar } from './docs-sidebar';
import * as styles from './docs.css';

/** Sidebar + content shell used by every documentation page. */
export function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <Container size="wide" className={styles.layout}>
      <aside className={styles.sidebar}>
        {/* Small screens: navigation folds into a disclosure above the page. */}
        <details className={styles.mobileNav}>
          <summary className={styles.mobileNavSummary}>Contents</summary>
          <DocsSidebar />
        </details>
        <div className={styles.desktopNav}>
          <DocsSidebar />
        </div>
      </aside>
      <main id="main" className={styles.main}>
        {children}
      </main>
    </Container>
  );
}

export function DocSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <div className={styles.sectionHeader}>
        <Heading level={2} id={`${id}-title`}>
          {title}
        </Heading>
        {description ? <p className={styles.lede}>{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
