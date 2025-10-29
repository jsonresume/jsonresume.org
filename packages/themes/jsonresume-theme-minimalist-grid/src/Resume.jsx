import React from 'react';
import styled from 'styled-components';
import { Section, SectionTitle, DateRange, ContactInfo } from '@resume/core';

const Layout = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 80px 60px;
  background: white;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  color: #374151;
  font-weight: 300;
  line-height: 1.8;

  @media print {
    padding: 40px;
  }
`;

const Header = styled.header`
  margin-bottom: 64px;
  padding-bottom: 40px;
  border-bottom: 1px solid #e5e7eb;
`;

const Name = styled.h1`
  font-size: 40px;
  font-weight: 300;
  color: #111827;
  margin: 0 0 12px 0;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Label = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 24px;
  font-weight: 300;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const StyledContactInfo = styled(ContactInfo)`
  font-size: 14px;
  letter-spacing: 0.05em;

  a {
    font-size: 14px;
    font-weight: 300;
  }
`;

const Summary = styled.p`
  font-size: 15px;
  line-height: 1.9;
  color: #4b5563;
  margin: 28px 0 0 0;
  font-weight: 300;
  letter-spacing: 0.02em;
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-size: 14px;
  font-weight: 400;
  color: #111827;
  margin: 56px 0 32px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const WorkItem = styled.div`
  margin-bottom: 40px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const WorkHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
  gap: 20px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const Position = styled.h3`
  font-size: 17px;
  font-weight: 400;
  color: #111827;
  margin: 0;
  letter-spacing: 0.04em;
`;

const Company = styled.div`
  font-size: 15px;
  color: #6b7280;
  font-weight: 300;
  margin-top: 6px;
  letter-spacing: 0.03em;
`;

const DateText = styled.div`
  font-size: 13px;
  color: #9ca3af;
  font-weight: 300;
  white-space: nowrap;
  letter-spacing: 0.05em;
`;

const WorkSummary = styled.p`
  margin: 16px 0;
  color: #4b5563;
  line-height: 1.9;
  font-size: 15px;
  font-weight: 300;
  letter-spacing: 0.02em;
`;

const Highlights = styled.ul`
  margin: 16px 0 0 0;
  padding-left: 24px;
  list-style-type: none;

  li {
    margin: 10px 0;
    color: #4b5563;
    line-height: 1.9;
    padding-left: 0;
    font-weight: 300;
    letter-spacing: 0.02em;
    position: relative;

    &:before {
      content: '·';
      position: absolute;
      left: -16px;
      color: #d1d5db;
    }
  }
`;

const EducationItem = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Institution = styled.h3`
  font-size: 16px;
  font-weight: 400;
  color: #111827;
  margin: 0 0 8px 0;
  letter-spacing: 0.04em;
`;

const Degree = styled.div`
  font-size: 15px;
  color: #4b5563;
  margin-bottom: 6px;
  font-weight: 300;
  letter-spacing: 0.02em;
`;

const EducationDate = styled.div`
  font-size: 13px;
  color: #9ca3af;
  font-weight: 300;
  letter-spacing: 0.05em;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
`;

const SkillCategory = styled.div`
  padding: 20px;
  background: #fafafa;
  border-left: 1px solid #e5e7eb;
`;

const SkillName = styled.h4`
  font-size: 14px;
  font-weight: 400;
  color: #111827;
  margin: 0 0 12px 0;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const SkillTags = styled.div`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.8;
  font-weight: 300;
  letter-spacing: 0.02em;
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
