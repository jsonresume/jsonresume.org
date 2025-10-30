import React from 'react';
import {
  Layout,
  Header,
  Name,
  Label,
  StyledContactInfo,
  Summary,
} from './components/layout-styles.jsx';
import { WorkSection } from './components/WorkSection';
import { SkillsSection } from './components/SkillsSection';
import { EducationSection } from './components/EducationSection';
import {
  ProjectsSection,
  VolunteerSection,
  AwardsSection,
  PublicationsSection,
  LanguagesSection,
  InterestsSection,
  ReferencesSection,
} from './components/OptionalSections';

function Resume({ resume }) {
  const {
    basics = {},
    work = [],
    education = [],
    skills = [],
    projects = [],
    volunteer = [],
    awards = [],
    publications = [],
    languages = [],
    interests = [],
    references = [],
  } = resume;

  return (
    <Layout>
      <Header>
        <Name>{basics.name}</Name>
        {basics.label && <Label>{basics.label}</Label>}
        <StyledContactInfo basics={basics} />
        {basics.summary && <Summary>{basics.summary}</Summary>}
      </Header>

      <WorkSection work={work} />
      <SkillsSection skills={skills} />
      <EducationSection education={education} />
      <ProjectsSection projects={projects} />
      <VolunteerSection volunteer={volunteer} />
      <AwardsSection awards={awards} />
      <PublicationsSection publications={publications} />
      <LanguagesSection languages={languages} />
      <InterestsSection interests={interests} />
      <ReferencesSection references={references} />
    </Layout>
  );
}

export default Resume;
