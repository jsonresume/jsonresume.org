import React from 'react';
import styled from 'styled-components';
import { Section, SectionTitle, DateRange, ContactInfo } from '@resume/core';

// Developer Mono Theme - Technical, efficient, minimalist
// Monospace headers with sans-serif body, code-style aesthetics
// Color: #2563eb (developer blue)

const Layout = styled.div`
  max-width: 850px;
  margin: 0 auto;
  padding: 60px 40px;
  background: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #1f2937;

  @media print {
    padding: 40px;
  }
`;

const Header = styled.header`
  margin-bottom: 48px;
  padding-bottom: 20px;
  border-bottom: 2px solid #2563eb;
`;

const Name = styled.h1`
  font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Consolas', 'Courier New',
    monospace;
  font-size: 32px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
  letter-spacing: -0.01em;

  &::before {
    content: '// ';
    color: #2563eb;
  }
`;

const Label = styled.div`
  font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Consolas', 'Courier New',
    monospace;
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
  font-weight: 500;

  &::before {
    content: '/* ';
    color: #94a3b8;
  }

  &::after {
    content: ' */';
    color: #94a3b8;
  }
`;

const StyledContactInfo = styled(ContactInfo)`
  font-size: 13px;

  a {
    font-size: 13px;
    color: #2563eb;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Summary = styled.p`
  font-size: 14px;
  line-height: 1.7;
  color: #4b5563;
  margin: 16px 0 0 0;
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Consolas', 'Courier New',
    monospace;
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
  margin: 40px 0 20px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
  letter-spacing: 0.05em;
  text-transform: uppercase;

  &::before {
    content: '// ';
    color: #94a3b8;
  }
`;

const WorkItem = styled.div`
  margin-bottom: 28px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const WorkHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
  gap: 16px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
`;

const Position = styled.h3`
  font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Consolas', 'Courier New',
    monospace;
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  letter-spacing: -0.01em;
`;

const Company = styled.div`
  font-size: 14px;
  color: #4b5563;
  font-weight: 500;
  margin-top: 4px;
`;

const DateText = styled.div`
  font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Consolas', 'Courier New',
    monospace;
  font-size: 12px;
  color: #6b7280;
  font-weight: 400;
  white-space: nowrap;
`;

const WorkSummary = styled.p`
  margin: 10px 0;
  color: #4b5563;
  line-height: 1.6;
  font-size: 14px;
`;

const Highlights = styled.ul`
  margin: 10px 0 0 0;
  padding-left: 18px;
  list-style-type: none;

  li {
    margin: 6px 0;
    color: #4b5563;
    line-height: 1.6;
    font-size: 13px;
    padding-left: 4px;
    position: relative;

    &:before {
      content: '>';
      position: absolute;
      left: -14px;
      color: #2563eb;
      font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Consolas',
        'Courier New', monospace;
      font-weight: 600;
    }
  }
`;

const EducationItem = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Institution = styled.h3`
  font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Consolas', 'Courier New',
    monospace;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 6px 0;
  letter-spacing: -0.01em;
`;

const Degree = styled.div`
  font-size: 13px;
  color: #4b5563;
  margin-bottom: 4px;
`;

const EducationDate = styled.div`
  font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Consolas', 'Courier New',
    monospace;
  font-size: 12px;
  color: #6b7280;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
`;

const SkillCategory = styled.div`
  padding: 12px;
  background: #f8fafc;
  border-radius: 2px;
  border-left: 3px solid #2563eb;
  border: 1px solid #e2e8f0;
`;

const SkillName = styled.h4`
  font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Consolas', 'Courier New',
    monospace;
  font-size: 12px;
  font-weight: 600;
  color: #2563eb;
  margin: 0 0 6px 0;
  letter-spacing: 0.01em;
`;

const SkillTags = styled.div`
  font-size: 12px;
  color: #6b7280;
  line-height: 1.5;
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

      {work?.length > 0 && (
        <Section>
          <StyledSectionTitle>Experience</StyledSectionTitle>
          {work.map((job, index) => (
            <WorkItem key={index}>
              <WorkHeader>
                <div>
                  <Position>{job.position}</Position>
                  {job.name && <Company>{job.name}</Company>}
                </div>
                <DateText>
                  <DateRange startDate={job.startDate} endDate={job.endDate} />
                </DateText>
              </WorkHeader>
              {job.summary && <WorkSummary>{job.summary}</WorkSummary>}
              {job.highlights?.length > 0 && (
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

      {skills?.length > 0 && (
        <Section>
          <StyledSectionTitle>Skills</StyledSectionTitle>
          <SkillsGrid>
            {skills.map((skill, index) => (
              <SkillCategory key={index}>
                <SkillName>{skill.name}</SkillName>
                {skill.keywords?.length > 0 && (
                  <SkillTags>{skill.keywords.join(', ')}</SkillTags>
                )}
              </SkillCategory>
            ))}
          </SkillsGrid>
        </Section>
      )}

      {education?.length > 0 && (
        <Section>
          <StyledSectionTitle>Education</StyledSectionTitle>
          {education.map((edu, index) => (
            <EducationItem key={index}>
              <Institution>{edu.institution}</Institution>
              <Degree>
                {edu.studyType} in {edu.area}
                {edu.score && ` • ${edu.score}`}
              </Degree>
              <EducationDate>
                <DateRange startDate={edu.startDate} endDate={edu.endDate} />
              </EducationDate>
            </EducationItem>
          ))}
        </Section>
      )}

      {projects?.length > 0 && (
        <Section>
          <StyledSectionTitle>Projects</StyledSectionTitle>
          {projects.map((project, index) => (
            <WorkItem key={index}>
              <Position>{project.name}</Position>
              {project.description && (
                <WorkSummary>{project.description}</WorkSummary>
              )}
              {project.highlights?.length > 0 && (
                <Highlights>
                  {project.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </Highlights>
              )}
            </WorkItem>
          ))}
        </Section>
      )}

      {volunteer?.length > 0 && (
        <Section>
          <StyledSectionTitle>Volunteer</StyledSectionTitle>
          {volunteer.map((vol, index) => (
            <WorkItem key={index}>
              <WorkHeader>
                <div>
                  <Position>{vol.position}</Position>
                  {vol.organization && <Company>{vol.organization}</Company>}
                </div>
                {(vol.startDate || vol.endDate) && (
                  <DateText>
                    <DateRange
                      startDate={vol.startDate}
                      endDate={vol.endDate}
                    />
                  </DateText>
                )}
              </WorkHeader>
              {vol.summary && <WorkSummary>{vol.summary}</WorkSummary>}
              {vol.highlights?.length > 0 && (
                <Highlights>
                  {vol.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </Highlights>
              )}
            </WorkItem>
          ))}
        </Section>
      )}

      {awards?.length > 0 && (
        <Section>
          <StyledSectionTitle>Awards</StyledSectionTitle>
          {awards.map((award, index) => (
            <EducationItem key={index}>
              <Institution>{award.title}</Institution>
              {award.awarder && <Degree>Awarded by {award.awarder}</Degree>}
              {award.date && <EducationDate>{award.date}</EducationDate>}
              {award.summary && <WorkSummary>{award.summary}</WorkSummary>}
            </EducationItem>
          ))}
        </Section>
      )}

      {publications?.length > 0 && (
        <Section>
          <StyledSectionTitle>Publications</StyledSectionTitle>
          {publications.map((pub, index) => (
            <EducationItem key={index}>
              <Institution>{pub.name}</Institution>
              {pub.publisher && <Degree>Published by {pub.publisher}</Degree>}
              {pub.releaseDate && (
                <EducationDate>{pub.releaseDate}</EducationDate>
              )}
              {pub.summary && <WorkSummary>{pub.summary}</WorkSummary>}
            </EducationItem>
          ))}
        </Section>
      )}

      {languages?.length > 0 && (
        <Section>
          <StyledSectionTitle>Languages</StyledSectionTitle>
          <SkillsGrid>
            {languages.map((lang, index) => (
              <SkillCategory key={index}>
                <SkillName>{lang.language}</SkillName>
                {lang.fluency && <SkillTags>{lang.fluency}</SkillTags>}
              </SkillCategory>
            ))}
          </SkillsGrid>
        </Section>
      )}

      {interests?.length > 0 && (
        <Section>
          <StyledSectionTitle>Interests</StyledSectionTitle>
          <SkillsGrid>
            {interests.map((interest, index) => (
              <SkillCategory key={index}>
                <SkillName>{interest.name}</SkillName>
                {interest.keywords?.length > 0 && (
                  <SkillTags>{interest.keywords.join(', ')}</SkillTags>
                )}
              </SkillCategory>
            ))}
          </SkillsGrid>
        </Section>
      )}

      {references?.length > 0 && (
        <Section>
          <StyledSectionTitle>References</StyledSectionTitle>
          {references.map((ref, index) => (
            <EducationItem key={index}>
              <Institution>{ref.name}</Institution>
              {ref.reference && <WorkSummary>{ref.reference}</WorkSummary>}
            </EducationItem>
          ))}
        </Section>
      )}
    </Layout>
  );
}

export default Resume;
