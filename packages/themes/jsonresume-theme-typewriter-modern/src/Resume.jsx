import React from 'react';
import styled from 'styled-components';
import { Section, SectionTitle } from '@resume/core';
import { Header } from './components/Header.jsx';
import { WorkExperience } from './components/WorkExperience.jsx';
import { Education } from './components/Education.jsx';
import { Skills } from './components/Skills.jsx';

const Layout = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 60px 40px;
  background: #fefce8;
  font-family: 'Courier Prime', 'Courier New', monospace;
  color: #333333;
  line-height: 1.8;

  @media print {
    padding: 40px;
    background: white;
  }
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-family: 'Work Sans', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  margin: 40px 0 24px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #333333;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

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
      <Header basics={basics} />

      {work?.length > 0 && (
        <Section>
          <StyledSectionTitle>Experience</StyledSectionTitle>
          <WorkExperience work={work} />
        </Section>
      )}

      {skills?.length > 0 && (
        <Section>
          <StyledSectionTitle>Skills</StyledSectionTitle>
          <Skills skills={skills} />
        </Section>
      )}

      {education?.length > 0 && (
        <Section>
          <StyledSectionTitle>Education</StyledSectionTitle>
          <Education education={education} />
        </Section>
      )}

      {projects?.length > 0 && (
        <Section>
          <StyledSectionTitle>Projects</StyledSectionTitle>
          <WorkExperience work={projects} />
        </Section>
      )}

      {volunteer?.length > 0 && (
        <Section>
          <StyledSectionTitle>Volunteer</StyledSectionTitle>
          <WorkExperience work={volunteer} />
        </Section>
      )}

      {awards?.length > 0 && (
        <Section>
          <StyledSectionTitle>Awards</StyledSectionTitle>
          <Education
            education={awards.map((a) => ({ ...a, institution: a.title }))}
          />
        </Section>
      )}

      {publications?.length > 0 && (
        <Section>
          <StyledSectionTitle>Publications</StyledSectionTitle>
          <Education
            education={publications.map((p) => ({ ...p, institution: p.name }))}
          />
        </Section>
      )}

      {languages?.length > 0 && (
        <Section>
          <StyledSectionTitle>Languages</StyledSectionTitle>
          <Skills
            skills={languages.map((l) => ({
              name: l.language,
              keywords: [l.fluency],
            }))}
          />
        </Section>
      )}

      {interests?.length > 0 && (
        <Section>
          <StyledSectionTitle>Interests</StyledSectionTitle>
          <Skills skills={interests} />
        </Section>
      )}

      {references?.length > 0 && (
        <Section>
          <StyledSectionTitle>References</StyledSectionTitle>
          <Education
            education={references.map((r) => ({ ...r, institution: r.name }))}
          />
        </Section>
      )}
    </Layout>
  );
}

export default Resume;
