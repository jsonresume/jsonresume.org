import React from "react";
import { Project } from "./types";
import { MY } from "./dateHelpers";

export const Projects: React.FC<{ projects: Project[] }> = ({ projects }) => (
  <>
    {projects.length > 0 && (
      <section className="section">
        <header>
          <h2 className="section-title">
            Projects <span className="item-count">({projects.length})</span>
          </h2>
        </header>
        <section id="projects">
          {projects.map((project, index) => (
            <section className="project-item" key={index}>
              {project.description && (
                <label htmlFor={`project-item-${index}`}></label>
              )}
              {project.name && (
                <header className="clear">
                  {project.name && (
                    <div className="position">{project.name}</div>
                  )}
                  {project.startDate && (
                    <div className="date">
                      <span className="startDate">
                        {MY(project.startDate)}
                        {"\u00A0"}
                      </span>
                      {project.endDate ? (
                        <span className="endDate">- {MY(project.endDate)}</span>
                      ) : (
                        <span className="endDate">- Current</span>
                      )}
                    </div>
                  )}
                </header>
              )}

              {project.url && (
                <span className="website">
                  <span className="fas fa-external-link-alt"></span>
                  <a target="_blank" href={project.url}>
                    {"\u00A0"}
                    {project.url}
                  </a>
                </span>
              )}
              {project.keywords?.length && (
                <ul className="keywords">
                  {project.keywords.map((keyword, index) => (
                    <li key={index}>{keyword}</li>
                  ))}
                </ul>
              )}
              <div className="item">
                {project.description && (
                  <div className="summary">{project.description}</div>
                )}
                {project.highlights?.length && (
                  <ul className="highlights">
                    {project.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </section>
      </section>
    )}
  </>
);
