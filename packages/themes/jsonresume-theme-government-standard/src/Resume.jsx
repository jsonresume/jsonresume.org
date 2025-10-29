import React from 'react';
import { Section } from '@resume/core';
import {
  Layout,
  Header,
  Name,
  Label,
  StyledContactInfo,
  Summary,
  StyledSectionTitle,
} from './styles.js';
import { WorkSection } from './components/WorkSection.jsx';
import { EducationSection } from './components/EducationSection.jsx';
import { SkillsSection } from './components/SkillsSection.jsx';
import {
  ProjectsSection,
  VolunteerSection,
  AwardsSection,
  PublicationsSection,
  LanguagesSection,
  InterestsSection,
  ReferencesSection,
} from './components/OtherSections.jsx';

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
      </Header>

      {basics.summary && (
        <Section>
          <StyledSectionTitle>Professional Summary</StyledSectionTitle>
          <Summary>{basics.summary}</Summary>
        </Section>
      )}

      <WorkSection work={work} />
      <EducationSection education={education} />
      <SkillsSection skills={skills} />
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
