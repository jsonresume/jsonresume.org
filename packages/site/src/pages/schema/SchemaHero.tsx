import { Button, Hero } from '@jsonresume/ui';
import type { ReactNode } from 'react';
import * as s from './schema.css';

export interface SchemaHeroProps {
  eyebrow: string;
  title: string;
  lede: ReactNode;
  schemaUrl: string;
  fileName: string;
  source: string;
  sectionKeys: ReadonlyArray<string>;
}

/** Hero for a schema reference: downloads, plus a map of every section. */
export function SchemaHero({
  eyebrow,
  title,
  lede,
  schemaUrl,
  fileName,
  source,
  sectionKeys,
}: SchemaHeroProps) {
  return (
    <Hero
      size="compact"
      align="start"
      eyebrow={eyebrow}
      title={title}
      lede={lede}
      actions={
        <>
          <Button asChild variant="primary">
            <a href={schemaUrl} download={fileName}>
              Download {fileName}
            </a>
          </Button>
          <Button asChild>
            <a href={source}>View the source</a>
          </Button>
        </>
      }
      media={
        <nav aria-label="Sections">
          <ul className={s.map}>
            {sectionKeys.map((key) => (
              <li key={key}>
                <a className={s.mapLink} href={`#${key}`}>
                  {key}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      }
    />
  );
}
