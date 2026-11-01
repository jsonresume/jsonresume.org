import { Heading, Link, Prose, Table, Td, Th } from '@jsonresume/ui';
import { darkColor, tokens } from '@jsonresume/ui/tokens';
import type { Metadata } from 'next';
import { DocsLayout } from '@/components/docs-layout';
import * as styles from '@/components/docs.css';
import { ColorChip } from '@/components/swatches';

export const metadata: Metadata = { title: 'Token reference' };

/** Colours get a swatch; everything else is shown as written. */
const isColor = (path: string[], value: string) =>
  path[0] === 'color' && /^(#|rgb|hsl)/.test(value);

/** A group's heading: "zIndex" reads as "Z-index". */
const titleOf = (group: string) =>
  group === 'zIndex' ? 'Z-index' : group[0]?.toUpperCase() + group.slice(1);

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
  const groups = [
    ...all
      .reduce((by, t) => {
        const group = t.path[0] ?? 'other';
        by.set(group, [...(by.get(group) ?? []), t]);
        return by;
      }, new Map<string, typeof all>())
      .entries(),
  ];
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
        <nav aria-label="Token groups" className={styles.groupNav}>
          {groups.map(([group, rows]) => (
            <Link key={group} href={`#${group}`} tone="neutral">
              {titleOf(group)}{' '}
              <span className={styles.count}>{rows.length}</span>
            </Link>
          ))}
        </nav>
        {groups.map(([group, rows]) => (
          <section
            key={group}
            className={styles.tokenGroup}
            aria-labelledby={group}
          >
            <Heading level={2} size="section" id={group}>
              {titleOf(group)}
            </Heading>
            <Table caption={`${rows.length} ${group} tokens`}>
              <thead>
                <tr>
                  <Th>Token</Th>
                  <Th>CSS variable</Th>
                  <Th>Value</Th>
                  {group === 'color' ? <Th>Dark</Th> : null}
                </tr>
              </thead>
              <tbody>
                {rows.map(({ path, value }) => {
                  const dark =
                    group === 'color'
                      ? lookup(darkColor as unknown as Tree, path.slice(1))
                      : undefined;
                  return (
                    <tr key={path.join('.')}>
                      <Td>
                        <span className={styles.propName}>
                          {path.slice(1).join('.')}
                        </span>
                      </Td>
                      <Td>
                        <span className={styles.cssVar}>
                          --jr-{path.map(kebab).join('-')}
                        </span>
                      </Td>
                      <Td>
                        {isColor(path, value) ? (
                          <ColorChip value={value} />
                        ) : (
                          <span className={styles.mono}>{value}</span>
                        )}
                      </Td>
                      {group === 'color' ? (
                        <Td>
                          {dark && dark !== value ? (
                            <ColorChip value={dark} />
                          ) : (
                            <span className={styles.mono}>same</span>
                          )}
                        </Td>
                      ) : null}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </section>
        ))}
      </article>
    </DocsLayout>
  );
}
