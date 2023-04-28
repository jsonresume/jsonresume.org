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
                &#8220;&#32;{reference.reference}&#32;&#8221;
              </blockquote>
            )}
            {reference.name && <div className="name">{reference.name}</div>}
          </div>
        ))}
      </section>
    </section>
  ) : null;
