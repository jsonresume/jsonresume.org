import React from 'react';
import {
  Layout,
  Header,
  Name,
  Label,
  StyledContactInfo,
  Summary,
} from './styles.js';
import { WorkSection } from './sections/WorkSection.jsx';
import { SkillsSection } from './sections/SkillsSection.jsx';
import { ProjectsSection } from './sections/ProjectsSection.jsx';
import { EducationSection } from './sections/EducationSection.jsx';
import {
  VolunteerSection,
  AwardsSection,
  PublicationsSection,
  LanguagesSection,
  InterestsSection,
  ReferencesSection,
} from './sections/OtherSections.jsx';

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
      <ProjectsSection projects={projects} />
      <EducationSection education={education} />
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
