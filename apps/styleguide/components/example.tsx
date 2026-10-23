import { CodeBlock } from '@jsonresume/ui';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { examples } from '@/generated/examples';
import type { ExampleRef } from '@/lib/components';
import * as styles from './docs.css';

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
  const dir = join(process.cwd(), 'examples', slug);
  const source = readFileSync(join(dir, `${example.id}.tsx`), 'utf8').trimEnd();
  // Co-located vanilla-extract styles (`import * as styles from './x.css'`)
  // are shown beneath the component.
  const styleFiles = [...source.matchAll(/from '\.\/([\w-]+)\.css'/g)].map(
    (m) => ({
      label: `${slug}/${m[1]}.css.ts`,
      code: readFileSync(join(dir, `${m[1]}.css.ts`), 'utf8').trimEnd(),
    })
  );
  const files = [
    { label: `${slug}/${example.id}.tsx`, code: source },
    ...styleFiles,
  ];
  const lines = files.reduce((n, f) => n + f.code.split('\n').length, 0);
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
      {lines > LONG_SOURCE ? (
        // Long sources start collapsed so the demo stays the focus.
        <details className={styles.source}>
          <summary className={styles.sourceSummary}>Show code</summary>
          {files.map((f) => (
            <CodeBlock key={f.label} label={f.label} code={f.code} />
          ))}
        </details>
      ) : (
        <div className={styles.source}>
          {files.map((f) => (
            <CodeBlock key={f.label} label={f.label} code={f.code} />
          ))}
        </div>
      )}
    </figure>
  );
}
