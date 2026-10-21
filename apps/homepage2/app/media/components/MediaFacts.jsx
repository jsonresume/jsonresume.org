import Link from 'next/link';
import { themes } from '../../themes/data/themes';
import schema from '../../../../../packages/schema/schema.json';
import schemaPackage from '../../../../../packages/schema/package.json';
import styles from '../media.module.css';

const sectionCount = Object.keys(schema.properties).filter(
  (name) => name !== '$schema' && name !== 'meta'
).length;

export function MediaFacts() {
  return (
    <section id="facts" className={styles.section}>
      <h2>Facts with a source</h2>
      <p>
        Project snapshot, checked 21 October 2026. Schema and gallery counts
        below come from the source bundled with this website; they are not
        estimates of people using JSON Resume.
      </p>
      <dl className={styles.facts}>
        <div>
          <dt>Started</dt>
          <dd>
            2014 ·{' '}
            <a href="https://news.ycombinator.com/item?id=7996464">
              Public discussion, 7 July
            </a>
          </dd>
        </div>
        <div>
          <dt>Co-founders</dt>
          <dd>
            Thomas Davis and Roland Sharp ·{' '}
            <Link href="/blog/first-official-release/">
              2014 release announcement
            </Link>
          </dd>
        </div>
        <div>
          <dt>Schema package</dt>
          <dd>
            Version {schemaPackage.version} ·{' '}
            <a href="https://github.com/jsonresume/jsonresume.org/blob/master/packages/schema/package.json">
              Package source
            </a>
          </dd>
        </div>
        <div>
          <dt>Résumé sections</dt>
          <dd>
            {sectionCount}, excluding schema and theme metadata ·{' '}
            <a href="https://github.com/jsonresume/jsonresume.org/blob/master/packages/schema/schema.json">
              Schema source
            </a>
          </dd>
        </div>
        <div>
          <dt>Theme gallery</dt>
          <dd>
            {themes.length} entries ·{' '}
            <Link href="/themes/">Browse the gallery</Link>
          </dd>
        </div>
        <div>
          <dt>Schema license</dt>
          <dd>
            MIT ·{' '}
            <a href="https://github.com/jsonresume/jsonresume.org/blob/master/packages/schema/LICENSE.md">
              License text
            </a>
          </dd>
        </div>
      </dl>
      <h3>Outside implementations</h3>
      <p>
        These projects document their use of the format. They are maintained
        independently; their inclusion here does not imply an endorsement.
      </p>
      <ul className={styles.sourceList}>
        <li>
          <a href="https://techfolios.github.io/">
            TechFolios, University of Hawaiʻi
          </a>
          <p>
            A technical-portfolio system that uses JSON Resume for biographical
            information.
          </p>
        </li>
        <li>
          <a href="https://ctan.org/pkg/jsonresume">
            The jsonresume package on CTAN
          </a>
          <p>
            Lukas Wolfsteiner’s LuaLaTeX package renders JSON Resume data into
            documents.
          </p>
        </li>
      </ul>
      <p>
        For dated milestones and original announcements, see the{' '}
        <Link href="/team/#history">project history</Link>. For how the schema
        evolves, see the{' '}
        <a href="https://github.com/jsonresume/jsonresume.org/issues/329">
          schema roadmap discussion
        </a>
        .
      </p>
    </section>
  );
}
