import { Heading, Prose, Table, Td, Th } from '@jsonresume/ui';
import { darkColor, tokens } from '@jsonresume/ui/tokens';
import type { Metadata } from 'next';
import { DocsLayout } from '@/components/docs-layout';
import * as styles from '@/components/docs.css';

export const metadata: Metadata = { title: 'Token reference' };

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

type Tree = { [key: string]: string | Tree };

function flatten(
  node: Tree,
  path: string[],
  out: Array<{ path: string[]; value: string }>
) {
  for (const [key, value] of Object.entries(node)) {
    if (typeof value === 'string') out.push({ path: [...path, key], value });
    else flatten(value, [...path, key], out);
  }
  return out;
}

function lookup(tree: Tree, path: string[]): string | undefined {
  let node: string | Tree | undefined = tree;
  for (const key of path)
    node = typeof node === 'object' ? node[key] : undefined;
  return typeof node === 'string' ? node : undefined;
}

export default function TokensPage() {
  const all = flatten(tokens as unknown as Tree, [], []);
  return (
    <DocsLayout>
      <article className={styles.article}>
        <header className={styles.sectionHeader}>
          <Heading level={1} size="title">
            Token reference
          </Heading>
          <p className={styles.lede}>
            Every token, its CSS custom property and its value. The same data
            ships as <code>@jsonresume/ui/tokens.json</code> for tools that
            aren&apos;t React.
          </p>
        </header>
        <Prose>
          <p>
            In TypeScript, import <code>vars</code> from{' '}
            <code>@jsonresume/ui/tokens</code>:{' '}
            <code>vars.color.text.default</code> is{' '}
            <code>var(--jr-color-text-default)</code>.
          </p>
        </Prose>
        <Table caption={`${all.length} tokens`}>
          <thead>
            <tr>
              <Th>Token</Th>
              <Th>CSS variable</Th>
              <Th>Value</Th>
              <Th>Dark</Th>
            </tr>
          </thead>
          <tbody>
            {all.map(({ path, value }) => {
              const dark =
                path[0] === 'color'
                  ? lookup(darkColor as unknown as Tree, path.slice(1))
                  : undefined;
              return (
                <tr key={path.join('.')}>
                  <Td>
                    <span className={styles.propName}>{path.join('.')}</span>
                  </Td>
                  <Td>
                    <span className={styles.mono}>
                      --jr-{path.map(kebab).join('-')}
                    </span>
                  </Td>
                  <Td>
                    <span className={styles.mono}>{value}</span>
                  </Td>
                  <Td>
                    <span className={styles.mono}>
                      {dark && dark !== value ? dark : ''}
                    </span>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </article>
    </DocsLayout>
  );
}
