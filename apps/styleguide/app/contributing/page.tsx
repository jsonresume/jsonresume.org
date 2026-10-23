import { CodeBlock, Heading, Prose } from '@jsonresume/ui';
import type { Metadata } from 'next';
import { DocSection, DocsLayout } from '@/components/docs-layout';
import * as styles from '@/components/docs.css';

export const metadata: Metadata = { title: 'Contributing' };

const tree = `packages/ui/src/components/badge/
  badge.css.ts     styles: vanilla-extract recipe using vars only
  badge.tsx        typed React component (forwardRef, className passthrough)
  badge.test.tsx   behavior + axe
apps/styleguide/examples/badge/
  tones.tsx        live example, shown with its source
  tones.css.ts     its styles, if any (shown too); never inline style={{}}
apps/styleguide/lib/components.ts
                   summary, usage, accessibility notes`;

export default function ContributingPage() {
  return (
    <DocsLayout>
      <article className={styles.article}>
        <header className={styles.sectionHeader}>
          <Heading level={1} size="title">
            Contributing
          </Heading>
          <p className={styles.lede}>
            How to add or change a token or component.
          </p>
        </header>
        <DocSection id="component" title="Adding a component">
          <CodeBlock label="files" code={tree} />
          <Prose>
            <ol>
              <li>
                Write styles with vanilla-extract in a .css.ts file. Use vars
                for every value; no raw colors or pixels.
              </li>
              <li>
                Build on a native element or a Radix primitive. Forward refs and
                pass className through.
              </li>
              <li>Add tests for behavior and an axe check.</li>
              <li>
                Add at least one example and a docs entry. Props tables are
                generated from your types.
              </li>
              <li>
                Run <code>pnpm --filter @jsonresume/ui test</code> and{' '}
                <code>pnpm --filter styleguide build</code>.
              </li>
            </ol>
          </Prose>
        </DocSection>
        <DocSection id="tokens" title="Changing tokens">
          <Prose>
            <p>
              Tokens live in <code>packages/ui/src/tokens/theme.ts</code>.
              Change the light and dark value together; the contrast tests fail
              if a text pairing drops below 4.5:1. Renaming a token renames its
              CSS variable, so treat it as a breaking change.
            </p>
          </Prose>
        </DocSection>
        <DocSection id="principles" title="Review checklist">
          <Prose>
            <ul>
              <li>
                Does it look like jsonresume.org: light, calm, one yellow band,
                red only for the main action?
              </li>
              <li>
                Does it work with only a keyboard, at 320px, and at 200% zoom?
              </li>
              <li>
                Is there one obvious way to use it, and is it documented with an
                example?
              </li>
            </ul>
          </Prose>
        </DocSection>
      </article>
    </DocsLayout>
  );
}
