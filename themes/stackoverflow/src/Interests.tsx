import React from "react";
import { Interest } from "./types";

export const Interests: React.FC<{ interests: Interest[] }> = ({
  interests,
}) => {
  if (!interests.length) {
    return null;
  }

  return (
    <section className="section">
      <header>
        <h2 className="section-title">Interests</h2>
      </header>
      <section id="interests">
        {interests.map((interest, index) => (
          <div key={index} className="item">
            {interest.name && <h3 className="name">{interest.name}</h3>}
            {interest.keywords?.length && (
              <ul className="keywords">
                {interest.keywords.map((keyword, i) => (
                  <li key={i}>{keyword}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>
    </section>
  );
};
