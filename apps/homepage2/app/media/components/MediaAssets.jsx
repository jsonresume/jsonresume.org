import Image from 'next/image';
import styles from '../media.module.css';

export function MediaAssets() {
  return (
    <section id="examples" className={styles.section}>
      <h2>One example, ready to explore</h2>
      <p>
        Meet Alex Example: a fictional profile you can use in an article,
        screenshot or demo without exposing anyone’s personal information. Open
        the HTML to see the rendered résumé, or download its JSON data and try
        it in a compatible tool.
      </p>
      <figure className={styles.figure}>
        <a
          href="/media/example-resume.html"
          aria-label="Open the fictional example résumé"
        >
          <Image
            src="/media/example-resume.png"
            width={1200}
            height={900}
            alt="Alex Example’s fictional résumé, with work experience, education, skills and a portfolio project"
            className={styles.screenshot}
          />
        </a>
        <figcaption>
          Example output from the downloadable JSON file, using a simple
          demonstration layout.
        </figcaption>
      </figure>
      <ul className={styles.downloads}>
        <li>
          <a href="/media/example-resume.html">Open the working HTML example</a>
        </li>
        <li>
          <a href="/media/example-resume.json" download>
            Download the example JSON
          </a>
        </li>
        <li>
          <a href="/media/example-resume.png" download>
            Download the résumé screenshot (PNG)
          </a>
        </li>
        <li>
          <a href="/media/project-overview.png" download>
            Download the project screenshot (PNG)
          </a>
        </li>
        <li>
          <a href="/media/facts.txt" download>
            Download the short description &amp; founder bio
          </a>
        </li>
      </ul>
      <p>
        The fictional example, demo HTML, screenshots and factsheet in this
        media kit may be reproduced with attribution to JSON Resume
        (jsonresume.org). Please caption the résumé as a fictional example.
      </p>
    </section>
  );
}
