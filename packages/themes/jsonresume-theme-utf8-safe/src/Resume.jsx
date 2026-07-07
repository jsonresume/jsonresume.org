/*
 * UTF-8 Safe — Resume Component
 *
 * Two-column layout with SAP OpenUI5 Horizon design tokens.
 * Print-optimized and fully UTF-8 safe for international content.
 *
 * Rules:
 *   1. Inline styled-components (collected by renderResumeDocument SSR).
 *   2. Use @jsonresume/utils helpers, never reimplement dates/location/urls.
 *   3. Sidebar: contact, profiles, skills, languages, interests, certificates.
 *   4. Main: work, education, projects, volunteer, awards, publications, references.
 *   5. Never name a styled-component "Date" (conflicts with JS Date).
 *   6. Render ALL sections so the theme is complete.
 */
import React from 'react';
import {
  Page,
  Header,
  Name,
  LabelBadge,
  SummaryText,
  StyledContactInfo,
  Layout,
  Sidebar,
  Main,
} from './styled.js';
import {
  renderSidebarBasics,
  renderSidebarProfiles,
  renderSidebarSkills,
  renderSidebarLanguages,
  renderSidebarInterests,
  renderSidebarCertificates,
} from './sections/sidebar.jsx';
import {
  renderWork,
  renderEducation,
  renderProjects,
  renderVolunteer,
  renderAwards,
  renderPublications,
  renderReferences,
} from './sections/main.jsx';

export default function Resume({ resume }) {
  const {
    basics = {},
    work = [],
    education = [],
    skills = [],
    projects = [],
    volunteer = [],
    awards = [],
    certificates = [],
    publications = [],
    languages = [],
    interests = [],
    references = [],
  } = resume;

  return (
    <Page>
      <Header>
        {basics.name && <Name>{basics.name}</Name>}
        {basics.label && <LabelBadge>{basics.label}</LabelBadge>}
        {basics.summary && <SummaryText>{basics.summary}</SummaryText>}
        <StyledContactInfo basics={basics} />
      </Header>

      <Layout>
        <Sidebar>
          {renderSidebarBasics(basics)}
          {renderSidebarProfiles(basics.profiles)}
          {renderSidebarSkills(skills)}
          {renderSidebarLanguages(languages)}
          {renderSidebarInterests(interests)}
          {renderSidebarCertificates(certificates)}
        </Sidebar>

        <Main>
          {renderWork(work)}
          {renderEducation(education)}
          {renderProjects(projects)}
          {renderVolunteer(volunteer)}
          {renderAwards(awards)}
          {renderPublications(publications)}
          {renderReferences(references)}
        </Main>
      </Layout>
    </Page>
  );
}
