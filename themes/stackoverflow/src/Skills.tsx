import React from "react";
import { Skill } from "./types";
import { withTranslation, WithTranslation } from "react-i18next";

export const Skills = withTranslation()(
  ({ skills, t }: { skills: Skill[] } & WithTranslation) =>
    skills.length > 0 ? (
      <section className="section">
        <header>
          <h2 className="section-title">{t("Skills")}</h2>
        </header>
        <section id="skills">
          {skills.map((skill, index) => (
            <div className="item" key={index}>
              {skill.name && <h3 className="name">{skill.name}</h3>}
              {skill.level && (
                <div className={`level ${skill.level.toLowerCase()}`}>
                  <em>{skill.level}</em>
                  <div className="bar"></div>
                </div>
              )}
              {skill.keywords?.length && (
                <ul className="keywords">
                  {skill.keywords.map((keyword, index) => (
                    <li key={index}>{keyword}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      </section>
    ) : null
);
