'use client';

import {
  AwardsSection,
  CertificatesSection,
  PublicationsSection,
} from './AccomplishmentsSections';

export const AccomplishmentsSection = ({ resume, handlers }) => {
  return (
    <>
      <AwardsSection awards={resume.awards} handlers={handlers} />
      <CertificatesSection
        certificates={resume.certificates}
        handlers={handlers}
      />
      <PublicationsSection
        publications={resume.publications}
        handlers={handlers}
      />
    </>
  );
};
