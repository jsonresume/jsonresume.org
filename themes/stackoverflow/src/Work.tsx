import React from "react";
import { Work as WorkItem } from "./types";
import { MY } from "./dateHelpers";
import { withTranslation, WithTranslation } from "react-i18next";

export const Work = withTranslation()(
  ({ work, t }: { work: WorkItem[] } & WithTranslation) =>
    work.length ? (
      <section className="section">
        <header>
          <h2 className="section-title">
            {t("Work Experience")}{" "}
            <span className="item-count">({work.length})</span>
          </h2>
        </header>

        <section id="work">
          {work.map((workItem, index) => (
            <section key={index} className="work-item">
              {workItem.name && (
                <>
                  {workItem.summary && <label htmlFor={`work-item-${index}`} />}
                  <header className="clear">
                    <div className="date">
                      {workItem.startDate && (
                        <span className="startDate">
                          {MY(workItem.startDate)}
                          {"\u00A0"}
                        </span>
                      )}
                      {workItem.endDate ? (
                        <span className="endDate">
                          - {MY(workItem.endDate)}
                        </span>
                      ) : (
                        <span className="endDate">- Current</span>
                      )}
                    </div>
                    {workItem.position && (
                      <div className="position">{workItem.position}</div>
                    )}
                    <div className="company">{workItem.name}</div>
                  </header>
                </>
              )}

              {workItem.location && (
                <>
                  <span className="fas fa-map-marker-alt" />
                  <span className="location">
                    {"\u00A0"}
                    {workItem.location}
                  </span>
                </>
              )}

              {workItem.url && (
                <span className="url">
                  <span className="fas fa-external-link-alt" />
                  <a target="_blank" href={workItem.url} rel="noreferrer">
                    {"\u00A0"}
                    {workItem.url}
                  </a>
                </span>
              )}

              <div className="item" id="work-item">
                {workItem.summary && (
                  <div className="summary">{workItem.summary}</div>
                )}

                {workItem.highlights?.length && (
                  <ul className="highlights">
                    {workItem.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </section>
      </section>
    ) : null
);
