import Link from 'next/link';
import { MediaFacts } from './components/MediaFacts';
import { MediaAssets } from './components/MediaAssets';
import styles from './media.module.css';

export const metadata = {
  title: 'Media — JSON Resume',
  description:
    'Facts, original records, example files, screenshots and interview contact information for reporting on JSON Resume.',
  alternates: { canonical: 'https://jsonresume.org/media/' },
  openGraph: {
    title: 'JSON Resume — Media resources',
    description:
      'A shared format for résumé data. Project facts, examples and original sources.',
    url: 'https://jsonresume.org/media/',
    images: [
      {
        url: 'https://jsonresume.org/media/example-resume.png',
        width: 1200,
        height: 900,
        alt: 'A fictional résumé rendered from JSON Resume data',
      },
    ],
  },
};

export default function MediaPage() {
  return (
    <div className={styles.media}>
      <header id="header">
        <div className="container">
          <h1>JSON Resume, for the record.</h1>
          <p className={styles.lead}>
            A shared format for résumé data. Facts, examples and original
            sources for people writing about the project.
          </p>
          <a
            className={styles.contact}
            href="mailto:thomasalwyndavis@gmail.com?subject=JSON%20Resume%20media%20enquiry"
          >
            Contact Thomas Davis <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>
      <div className={`container ${styles.body}`}>
        <nav className={styles.jumpLinks} aria-label="Media page sections">
          <a href="#overview">Overview</a>
          <a href="#facts">Facts &amp; sources</a>
          <a href="#examples">Examples &amp; downloads</a>
          <a href="#contact">Interview enquiries</a>
        </nav>
        <section id="overview" className={styles.section}>
          <h2>The short version</h2>
          <p className={styles.description}>
            JSON Resume is a community-developed, open-source schema for
            expressing a résumé as JSON. Started in 2014 by Thomas Davis and
            Roland Sharp, it separates career information from presentation so
            compatible tools can use the same data to build documents and
            portfolio websites.
          </p>
          <p>
            The schema, command-line tools and hosted registry are distinct
            parts of the project. You can use the format without publishing
            personal information to the registry. See the{' '}
            <Link href="/schema/">schema</Link>,{' '}
            <Link href="/getting-started/">getting-started guide</Link> and{' '}
            <a href="https://registry.jsonresume.org/explore">live registry</a>.
          </p>
          <p>
            A common file format does not guarantee acceptance by an employer or
            applicant tracking system. Output and supported fields depend on the
            tool and theme you choose.
          </p>
        </section>
        <MediaFacts />
        <MediaAssets />
        <section id="contact" className={styles.section}>
          <h2>Interview enquiries</h2>
          <div className={styles.contactLayout}>
            <div>
              <h3>Thomas Davis</h3>
              <p>Co-founder, JSON Resume</p>
              <p>
                Thomas Davis co-founded JSON Resume with Roland Sharp in 2014.
                His contributions include work on the project’s schema,
                command-line tools and hosted registry. He is available to
                discuss the project’s history, résumé data portability and
                maintaining open-source tools.
              </p>
              <a href="mailto:thomasalwyndavis@gmail.com?subject=JSON%20Resume%20media%20enquiry">
                thomasalwyndavis@gmail.com
              </a>
              <p>
                <a href="https://github.com/thomasdavis">GitHub profile</a>
                {' · '}
                <a href="https://registry.jsonresume.org/thomasdavis">Résumé</a>
              </p>
            </div>
            <aside className={styles.enquiryNote}>
              <h3>Help us answer your enquiry</h3>
              <p>
                Include your publication, topic, deadline and time zone.
                Questions about a third-party tool are best directed to its own
                maintainers.
              </p>
              <p>
                Looking for the project timeline?{' '}
                <Link href="/team/#history">Read the documented history</Link>.
              </p>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}
