import React from 'react';
import styled from 'styled-components';
import { Section, DateRange, ContactInfo } from '@resume/core';

// Layout styled components
const Layout = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 72px 48px;
  background: #fafaf9;
  font-family: 'Jost', 'Red Hat Display', -apple-system, BlinkMacSystemFont,
    sans-serif;
  color: #1f2937;
  line-height: 1.6;

  @media print {
    padding: 40px;
    background: white;
  }
`;

const Header = styled.header`
  margin-bottom: 56px;
  padding-bottom: 32px;
  border-bottom: 1px solid #e5e7eb;
`;

const Name = styled.h1`
  font-size: 48px;
  font-weight: 300;
  color: #111827;
  margin: 0 0 12px 0;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const Label = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 24px;
  font-weight: 400;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const StyledContactInfo = styled(ContactInfo)`
  font-size: 14px;
  color: #6b7280;

  a {
    font-size: 14px;
    color: #6b7280;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;

    &:hover {
      border-bottom-color: #6b7280;
    }
  }
`;

const Summary = styled.p`
  font-size: 15px;
  line-height: 1.8;
  color: #374151;
  margin: 24px 0 0 0;
  font-weight: 300;
`;

const SectionTitle = styled.h2`
  font-size: 12px;
  font-weight: 400;
  color: #6b7280;
  margin: 48px 0 24px 0;
  letter-spacing: 3px;
  text-transform: uppercase;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    right: 0;
    height: 1px;
    background: #e5e7eb;
  }
`;

// Section styled components
const WorkItem = styled.div`
  padding: 24px 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const WorkHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px;
  margin-bottom: 12px;
  align-items: baseline;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const Position = styled.h3`
  font-size: 18px;
  font-weight: 400;
  color: #111827;
  margin: 0;
  letter-spacing: 0.5px;
`;

const Company = styled.div`
  font-size: 15px;
  color: #6b7280;
  font-weight: 300;
  margin-top: 4px;
`;

const DateText = styled.div`
  font-size: 13px;
  color: #9ca3af;
  font-weight: 300;
  white-space: nowrap;
  letter-spacing: 0.5px;
`;

const WorkSummary = styled.p`
  margin: 12px 0;
  color: #4b5563;
  line-height: 1.8;
  font-size: 14px;
  font-weight: 300;
`;

const Highlights = styled.ul`
  margin: 12px 0 0 0;
  padding-left: 20px;
  list-style-type: none;

  li {
    margin: 8px 0;
    color: #4b5563;
    line-height: 1.8;
    font-size: 14px;
    font-weight: 300;
    position: relative;

    &::before {
      content: '—';
      position: absolute;
      left: -20px;
      color: #6b7280;
    }
  }
`;

const EducationItem = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const Institution = styled.h3`
  font-size: 16px;
  font-weight: 400;
  color: #111827;
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
`;

const Degree = styled.div`
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 6px;
  font-weight: 300;
`;

const EducationDate = styled.div`
  font-size: 13px;
  color: #9ca3af;
  font-weight: 300;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1px;
  background: #e5e7eb;
  border: 1px solid #e5e7eb;
`;

const SkillCategory = styled.div`
  padding: 20px;
  background: #fafaf9;
`;

const SkillName = styled.h4`
  font-size: 13px;
  font-weight: 400;
  color: #6b7280;
  margin: 0 0 8px 0;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const SkillTags = styled.div`
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  font-weight: 300;
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
      <Header>
        <Name>{basics.name}</Name>
        {basics.label && <Label>{basics.label}</Label>}
        <StyledContactInfo basics={basics} />
        {basics.summary && <Summary>{basics.summary}</Summary>}
      </Header>

      {work && work.length > 0 && (
        <Section>
          <SectionTitle>Experience</SectionTitle>
          {work.map((job, index) => (
            <WorkItem key={index}>
              <WorkHeader>
                <div>
                  {job.position && <Position>{job.position}</Position>}
                  {job.name && <Company>{job.name}</Company>}
                </div>
                <DateText>
                  <DateRange startDate={job.startDate} endDate={job.endDate} />
                </DateText>
              </WorkHeader>
              {job.summary && <WorkSummary>{job.summary}</WorkSummary>}
              {job.highlights && job.highlights.length > 0 && (
                <Highlights>
                  {job.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </Highlights>
              )}
            </WorkItem>
          ))}
        </Section>
      )}

      {skills && skills.length > 0 && (
        <Section>
          <SectionTitle>Skills</SectionTitle>
          <SkillsGrid>
            {skills.map((skill, index) => (
              <SkillCategory key={index}>
                {skill.name && <SkillName>{skill.name}</SkillName>}
                {skill.keywords && skill.keywords.length > 0 && (
                  <SkillTags>{skill.keywords.join(', ')}</SkillTags>
                )}
              </SkillCategory>
            ))}
          </SkillsGrid>
        </Section>
      )}

      {education && education.length > 0 && (
        <Section>
          <SectionTitle>Education</SectionTitle>
          {education.map((edu, index) => (
            <EducationItem key={index}>
              {edu.institution && <Institution>{edu.institution}</Institution>}
              {(edu.studyType || edu.area) && (
                <Degree>
                  {edu.studyType && edu.area
                    ? `${edu.studyType} in ${edu.area}`
                    : edu.studyType || edu.area}
                </Degree>
              )}
              {(edu.startDate || edu.endDate) && (
                <EducationDate>
                  <DateRange startDate={edu.startDate} endDate={edu.endDate} />
                </EducationDate>
              )}
            </EducationItem>
          ))}
        </Section>
      )}
    </Layout>
  );
}

export default Resume;
