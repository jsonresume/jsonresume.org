import { classes as c } from './base.css.js';
import { Fragment } from 'react';
import type { DocumentModel } from './types.js';

export function Header({ model }: { model: DocumentModel }) {
  return (
    <header className={c.masthead}>
      {model.settings.showPhoto && model.image && (
        <img
          className={c.portrait}
          src={model.image}
          alt=""
          width={84}
          height={84}
        />
      )}
      <div className={c.identity}>
        <h1 className={c.name}>{model.name}</h1>
        {model.label && <p className={c.label}>{model.label}</p>}
      </div>
      {model.contacts.length > 0 && (
        <ul className={c.contact} aria-label="Contact information" lang="en">
          {model.contacts.map((contact, index) => (
            <li key={index} dir="auto">
              {contact.href ? (
                <a href={contact.href}>
                  <ContactText text={contact.text} />
                </a>
              ) : (
                <ContactText text={contact.text} />
              )}
            </li>
          ))}
        </ul>
      )}
      {model.summary && (
        <p className={c.summary} dir="auto">
          {model.summary}
        </p>
      )}
    </header>
  );
}

function ContactText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(?<=[@/._-])/u).map((part, index) => (
        <Fragment key={index}>
          {part}
          <wbr />
        </Fragment>
      ))}
    </>
  );
}
