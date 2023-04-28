import React from "react";
import { Language } from "./types";

export const Languages: React.FC<{ languages: Language[] }> = ({
  languages,
}) => (
  <>
    {languages.length && (
      <section className="section">
        <header>
          <h2 className="section-title">Languages</h2>
        </header>
        <section id="languages">
          {languages.map((language, index) => (
            <div key={index} className="display">
              {language.language && (
                <h3 className="language">{language.language}</h3>
              )}
              <div className="item">
                {language.fluency && (
                  <div
                    className={`level fluency ${language.fluency.toLowerCase()}`}
                  >
                    <em>{language.fluency}</em>
                    <div className="bar"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>
      </section>
    )}
  </>
);
