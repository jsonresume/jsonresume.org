import { EducationProps } from './types';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Y } from './dateHelpers';

export const Education = withTranslation()(
  ({ education, t }: { education: EducationProps[] } & WithTranslation) => {
    if (!education.length) return null;

    return (
      <section className="section">
        <header>
          <h2 className="section-title">
            {t('Education')}{' '}
            <span className="item-count">({education.length})</span>
          </h2>
        </header>

        <section id="education">
          {education.map((edu, index) => (
            <section className="education-item" key={index}>
              <header className="clear">
                <div className="date">
                  {edu.startDate && (
                    <span className="startDate">{Y(edu.startDate)}</span>
                  )}
                  {edu.endDate ? (
                    <span className="endDate"> - {Y(edu.endDate)}</span>
                  ) : (
                    <span className="endDate"> - Current</span>
                  )}
                </div>
                <div className="header-left">
                  {edu.studyType && (
                    <div className="studyType">{edu.studyType}</div>
                  )}
                  {edu.area && (
                    <div className="area">
                      {'\u00A0'}
                      {edu.area}
                    </div>
                  )}
                  {edu.institution && (
                    <div className="institution">{edu.institution}</div>
                  )}
                </div>
              </header>

              {edu.courses?.length && (
                <ul className="courses">
                  {edu.courses.map((course, i) => (
                    <li key={i}>{course}</li>
                  ))}
                </ul>
              )}

              <div className="item">
                {edu.score && (
                  <div className="gpa">
                    <strong> Grade:</strong> <span>{edu.score}</span>
                  </div>
                )}
              </div>
            </section>
          ))}
        </section>
      </section>
    );
  }
);
