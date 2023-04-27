import React from "react";
import { Volunteer as VolunteerInterface } from "./types";

interface VolunteerProps {
  volunteer: VolunteerInterface[];
}

export const Volunteer: React.FC<VolunteerProps> = ({ volunteer }) => {
  if (!volunteer.length) {
    return null;
  }

  return (
    <section className="section">
      <header>
        <h2 className="section-title">Volunteer</h2>
      </header>
      <section id="volunteer">
        {volunteer.map((item, index) => (
          <section key={index} className="volunteer-item">
            {item.organization && (
              <>
                {item.summary && (
                  <label htmlFor={`volunteer-item-${index}`}></label>
                )}
                <header className="clear">
                  <div className="date">
                    {item.startDate && (
                      <span className="startDate">
                        {new Date(item.startDate).toLocaleDateString()}
                      </span>
                    )}
                    {item.endDate ? (
                      <span className="endDate">
                        {" "}
                        - {new Date(item.endDate).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="endDate"> - Current</span>
                    )}
                  </div>
                  <div className="header-left">
                    {item.position && (
                      <div className="position">{item.position}</div>
                    )}
                    <div className="organization">{item.organization}</div>
                  </div>
                </header>
              </>
            )}
            {item.url && (
              <div className="website">
                <span className="fas fa-external-link-alt"></span>
                <a target="_blank" href={item.url}>
                  {item.url}
                </a>
              </div>
            )}

            <div className="item">
              {item.summary && <div className="summary">{item.summary}</div>}
              {item.highlights && item.highlights.length > 0 && (
                <ul className="highlights">
                  {item.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
      </section>
    </section>
  );
};
