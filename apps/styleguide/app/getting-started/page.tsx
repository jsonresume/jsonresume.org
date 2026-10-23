import { Callout, Code, CodeBlock, Heading, Prose } from '@jsonresume/ui';
import type { Metadata } from 'next';
import { DocSection, DocsLayout } from '@/components/docs-layout';
import * as styles from '@/components/docs.css';

export const metadata: Metadata = { title: 'Getting started' };

const layout = `// app/layout.tsx
import '@jsonresume/ui/fonts.css'; // optional: self-hosted Open Sans + Ubuntu
import '@jsonresume/ui/styles.css'; // tokens and component styles
import { base } from '@jsonresume/ui';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={base}>{children}</body>
    </html>
  );
}`;

const usage = `import { Button, PageHeader } from '@jsonresume/ui';

export default function Page() {
  return (
    <PageHeader
      title="Themes"
      description="Browse the community gallery."
      actions={<Button variant="primary">Submit a theme</Button>}
    />
  );
}`;

const css = `/* Any stylesheet can use the tokens as CSS custom properties. */
.notice {
  padding: var(--jr-space-4);
  background: var(--jr-color-surface-brand);
  color: var(--jr-color-text-on-brand);
  border-radius: var(--jr-radius-sm);
}`;

const ts = `import { style } from '@vanilla-extract/css';
import { vars } from '@jsonresume/ui/tokens';

export const notice = style({
  padding: vars.space[4],
  background: vars.color.surface.brand,
});`;

export default function GettingStartedPage() {
  return (
    <DocsLayout>
      <article className={styles.article}>
        <header className={styles.sectionHeader}>
          <Heading level={1} size="title">
            Getting started
          </Heading>
          <p className={styles.lede}>
            @jsonresume/ui is a TypeScript React package. Styles are written
            with vanilla-extract and compiled to one static stylesheet, so there
            is no runtime styling cost and nothing to configure in your bundler.
          </p>
        </header>

        <DocSection
          id="install"
          title="Install"
          description="Inside this monorepo, add it as a workspace dependency."
        >
          <CodeBlock
            label="terminal"
            code={'pnpm add @jsonresume/ui --filter <your-app>'}
          />
        </DocSection>

        <DocSection
          id="setup"
          title="Set up the root"
          description="Import the stylesheet once and put the base class on <body>."
        >
          <CodeBlock label="app/layout.tsx" code={layout} />
          <Callout title="Why a base class?">
            The package never styles bare elements globally. base applies the
            brand type, color and element defaults only where you opt in, so it
            can sit alongside an app’s existing styles during a migration.
          </Callout>
        </DocSection>

        <DocSection id="use" title="Use components">
          <CodeBlock label="app/themes/page.tsx" code={usage} />
        </DocSection>

        <DocSection
          id="tokens"
          title="Use tokens in your own styles"
          description="Every token is a CSS custom property with a stable --jr-* name, and a typed reference in TypeScript."
        >
          <CodeBlock label="notice.module.css" code={css} />
          <CodeBlock label="notice.css.ts" code={ts} />
          <Callout title="Writing your own .css.ts files in a Next.js app">
            Add <Code>@vanilla-extract/next-plugin</Code> to next.config and run
            Next with <Code>--webpack</Code>. The package itself ships compiled,
            so apps that only use its components need no plugin at all.
          </Callout>
        </DocSection>

        <DocSection id="dark" title="Dark mode">
          <Prose>
            <p>
              Pages are light by default. Set{' '}
              <code>data-theme=&quot;dark&quot;</code> on any element to switch
              it and its children to the dark tokens, or{' '}
              <code>data-theme=&quot;system&quot;</code> to follow the operating
              system.
            </p>
          </Prose>
        </DocSection>
      </article>
    </DocsLayout>
  );
}
