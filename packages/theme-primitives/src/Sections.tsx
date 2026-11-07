import { classes as c } from './base.css.js';
import type { DocumentModel, Entry } from './types.js';

function Article({ item }: { item: Entry }) {
  return (
    <article className={c.entry}>
      <header className={c.entryHead}>
        {item.title && (
          <h3 className={c.entryTitle} dir="auto">
            {item.url ? <a href={item.url}>{item.title}</a> : item.title}
          </h3>
        )}
        {item.date && <p className={c.date}>{item.date}</p>}
      </header>
      {(item.context || item.location) && (
        <p className={c.context} dir="auto">
          {[item.context, item.location].filter(Boolean).join(' · ')}
        </p>
      )}
      {item.paragraphs.map((paragraph, index) => (
        <p className={c.paragraph} key={index} dir="auto">
          {paragraph}
        </p>
      ))}
      {item.highlights.length > 0 && (
        <ul className={c.bullets}>
          {item.highlights.map((highlight, index) => (
            <li key={index} dir="auto">
              {highlight}
            </li>
          ))}
        </ul>
      )}
      {item.details.length > 0 && (
        <p className={c.details} dir="auto">
          {item.details.join(' · ')}
        </p>
      )}
    </article>
  );
}

type Sections = DocumentModel['sections'];

export function Sections({
  sections,
  language,
}: {
  sections: Sections;
  language: string;
}) {
  return (
    <>
      {sections.map((section) => (
        <section
          className={c.section}
          key={section.id}
          data-section={section.id}
          aria-labelledby={`section-${section.id}`}
        >
          <h2
            className={c.sectionTitle}
            id={`section-${section.id}`}
            lang={language}
          >
            {section.title}
          </h2>
          {['skills', 'languages', 'interests'].includes(section.id) ? (
            <dl className={c.taxonomy}>
              {section.entries.map((item, index) => (
                <div className={c.taxonomyRow} key={index}>
                  <dt className={c.term} dir="auto">
                    {item.title}
                  </dt>
                  <dd className={c.definition} dir="auto">
                    {[item.context, ...item.details]
                      .filter(Boolean)
                      .join(' · ')}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <div>
              {section.entries.map((item, index) => (
                <Article item={item} key={index} />
              ))}
            </div>
          )}
        </section>
      ))}
    </>
  );
}
