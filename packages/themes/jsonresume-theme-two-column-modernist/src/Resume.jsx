import React from 'react';
import {
  Container,
  LeftColumn,
  RightColumn,
  Divider,
} from './components/styles.jsx';
import { Header } from './components/Header';
import { Skills } from './components/Skills';
import { Languages } from './components/Languages';
import {
  SummarySection,
  WorkSection,
  EducationSection,
  ProjectsSection,
  InterestsSection,
} from './components/ContentSection';
import {
  VolunteerSection,
  AwardsSection,
  PublicationsSection,
  ReferencesSection,
} from './components/AdditionalSections';

function Resume({ resume }) {
  const {
    basics,
    work,
    education,
    skills,
    languages,
    projects,
    volunteer,
    awards,
    publications,
    interests,
    references,
  } = resume;

  return (
    <Container>
      <LeftColumn>
        <Header basics={basics} />
        {(basics?.email ||
          basics?.phone ||
          basics?.url ||
          basics?.location) && <Divider />}
        {basics?.profiles && basics.profiles.length > 0 && <Divider />}
        {skills && skills.length > 0 && (
          <>
            <Divider />
            <Skills skills={skills} />
          </>
        )}
        {languages && languages.length > 0 && (
          <>
            <Divider />
            <Languages languages={languages} />
          </>
        )}
      </LeftColumn>

      <RightColumn>
        <SummarySection summary={basics?.summary} />
        <WorkSection work={work} />
        <EducationSection education={education} />
        <ProjectsSection projects={projects} />
        <VolunteerSection volunteer={volunteer} />
        <AwardsSection awards={awards} />
        <PublicationsSection publications={publications} />
        <InterestsSection interests={interests} />
        <ReferencesSection references={references} />
      </RightColumn>
    </Container>
  );
}

export default Resume;
