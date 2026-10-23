import { CodeBlock } from '@jsonresume/ui';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { examples } from '@/generated/examples';
import type { ExampleRef } from '@/lib/components';
import styles from './docs.module.css';

const LONG_SOURCE = 25;

/**
 * A live example and its exact source, read from examples/<slug>/<id>.tsx
 * at build time, so the code shown is always the code running.
 */
export function Example({
  slug,
  example,
}: {
  slug: string;
  example: ExampleRef;
}) {
  const key = `${slug}/${example.id}`;
  const Component = examples[key];
  if (!Component) throw new Error(`Missing example ${key}`);
  const source = readFileSync(
    join(process.cwd(), 'examples', slug, `${example.id}.tsx`),
    'utf8'
  ).trimEnd();
  const previewClass = [
    styles.preview,
    example.bleed ? styles.previewBleed : '',
    example.block && !example.bleed ? styles.previewBlock : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <figure className={styles.example}>
      <figcaption className={styles.exampleHead}>
        <span className={styles.exampleTitle}>{example.title}</span>
        {example.description ? (
          <span className={styles.exampleDescription}>
            {example.description}
          </span>
        ) : null}
      </figcaption>
      <div className={previewClass}>
        <Component />
      </div>
      {source.split('\n').length > LONG_SOURCE ? (
        // Long sources start collapsed so the demo stays the focus.
        <details className={styles.source}>
          <summary className={styles.sourceSummary}>Show code</summary>
          <CodeBlock label={`${slug}/${example.id}.tsx`} code={source} />
        </details>
      ) : (
        <div className={styles.source}>
          <CodeBlock label={`${slug}/${example.id}.tsx`} code={source} />
        </div>
      )}
    </figure>
  );
}
