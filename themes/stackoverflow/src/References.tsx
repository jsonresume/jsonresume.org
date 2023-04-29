import React from "react";
import { Reference } from "./types";

export const References: React.FC<{ references: Reference[] }> = ({
  references,
}) =>
  references.length ? (
    <section className="section">
      <header>
        <h2 className="section-title">References</h2>
      </header>
      <section id="references">
        {references.map((reference, index) => (
          <div className="item" key={index}>
            {reference.reference && (
              <blockquote className="reference">
                &#8220;{reference.reference}&#8221;
                {reference.name && <div className="name">{reference.name}</div>}
              </blockquote>
            )}
          </div>
        ))}
      </section>
    </section>
  ) : null;
