import React from "react";
import { Certificate } from "./types";

export const Certificates: React.FC<{ certificates: Certificate[] }> = ({
  certificates,
}) => (
  <>
    {certificates.length > 0 && (
      <section className="section">
        <header>
          <h2 className="section-title">Certificates</h2>
        </header>
        <section id="certificates">
          {certificates.map((certificate, index) => (
            <section key={index} className="certificate-item">
              <header className="clear">
                {certificate.date && (
                  <div className="date">{certificate.date}</div>
                )}
                <div className="header-left">
                  {certificate.name && (
                    <div className="name">{certificate.name}</div>
                  )}
                  {certificate.issuer && (
                    <div className="issuer">{certificate.issuer}</div>
                  )}
                </div>
              </header>
              <div className="item">
                {certificate.url && (
                  <span className="url">
                    <span className="fas fa-external-link-alt"></span>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={certificate.url}
                    >
                      {certificate.url}
                    </a>
                  </span>
                )}
              </div>
            </section>
          ))}
        </section>
      </section>
    )}
  </>
);
