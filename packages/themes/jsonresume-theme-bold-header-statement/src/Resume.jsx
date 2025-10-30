import React from 'react';
import styled from 'styled-components';
import { Header } from './components/Header.jsx';
import { WorkSection } from './components/WorkSection.jsx';
import { SkillsSection } from './components/SkillsSection.jsx';
import { EducationSection } from './components/EducationSection.jsx';
import { ProjectsSection } from './components/ProjectsSection.jsx';

const Layout = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0;
  background: white;
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  color: #1f2937;

  @media print {
    padding: 0;
  }
`;

const ContentWrapper = styled.div`
  padding: 0 60px 60px 60px;

  @media print {
    padding: 0 40px 40px 40px;
  }
`;

const Summary = styled.p`
  font-size: 18px;
  line-height: 1.8;
  color: #374151;
  margin: 0 0 60px 0;
  font-weight: 300;
  max-width: 800px;
`;

function Resume({ resume }) {
  const {
    basics = {},
    work = [],
    education = [],
    skills = [],
    projects = [],
  } = resume;

  return (
    <Layout>
      <Header basics={basics} />
      <ContentWrapper>
        {basics.summary && <Summary>{basics.summary}</Summary>}
        <WorkSection work={work} />
        <SkillsSection skills={skills} />
        <EducationSection education={education} />
        <ProjectsSection projects={projects} />
      </ContentWrapper>
    </Layout>
  );
}

export default Resume;
