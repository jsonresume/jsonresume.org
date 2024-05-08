import { Publication } from './types';
import { DMY } from './dateHelpers';
import { withTranslation, WithTranslation } from 'react-i18next';

export const Publications = withTranslation()(
  ({ publications, t }: { publications: Publication[] } & WithTranslation) =>
    publications.length > 0 ? (
      <section className="section">
        <header>
          <h2 className="section-title">{t('Publications')}</h2>
        </header>
        <section id="publications">
          {publications.map((publication, index) => (
            <section className="publication-item" key={index}>
              {publication.summary && (
                <label htmlFor={`publication-item-${index}`}></label>
              )}
              <header className="clear">
                {publication.releaseDate && (
                  <span className="date">{DMY(publication.releaseDate)}</span>
                )}
                <div className="header-left">
                  {publication.name && (
                    <span className="name">
                      {publication.url ? (
                        <span className="website">
                          <span className="fas fa-external-link-alt"></span>
                          <a
                            target="_blank"
                            href={publication.url}
                            rel="noreferrer"
                          >
                            {'\u00A0'}
                            {publication.name}
                          </a>
                        </span>
                      ) : (
                        publication.name
                      )}
                    </span>
                  )}
                  {publication.publisher && (
                    <span className="publisher">
                      {' '}
                      in {publication.publisher}
                    </span>
                  )}
                </div>
              </header>

              <div className="item">
                {publication.summary && (
                  <div className="summary">{publication.summary}</div>
                )}
              </div>
            </section>
          ))}
        </section>
      </section>
    ) : null
);
