import React from 'react';
import styled from 'styled-components';
import {
  Section,
  SectionTitle,
  DateRange,
  ContactInfo,
} from '@jsonresume/core';

const Layout = styled.div`
  position: relative;
  max-width: 850px;
  margin: 0 auto;
  padding: 60px 50px;
  background: white;
  font-family: 'Barlow Condensed', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  color: #1f2937;
  overflow: hidden;

  /* Diagonal accent bar using pseudo-element */
  &::before {
    content: '';
    position: fixed;
    top: -10%;
    left: -5%;
    width: 6px;
    height: 150%;
    background: linear-gradient(180deg, #e11d48 0%, #be123c 50%, #9f1239 100%);
    transform: rotate(-30deg);
    transform-origin: top left;
    z-index: 1;
    opacity: 0.85;
    box-shadow: 0 0 15px rgba(225, 29, 72, 0.2);
  }

  /* Content wrapper to sit above diagonal bar */
  & > * {
    position: relative;
    z-index: 2;
  }

  @media print {
    padding: 40px;

    &::before {
      position: absolute;
      box-shadow: none;
    }
  }
`;

const Header = styled.header`
  margin-bottom: 50px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e5e7eb;
  padding-left: 40px;
`;

const Name = styled.h1`
  font-family: 'Barlow Expanded', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  font-size: 48px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const Label = styled.div`
  font-family: 'Barlow Expanded', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  font-size: 16px;
  color: #e11d48;
  margin-bottom: 20px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
`;

const StyledContactInfo = styled(ContactInfo)`
  font-size: 14px;

  a {
    font-size: 14px;
    color: #4b5563;
    transition: color 0.2s ease;

    &:hover {
      color: #e11d48;
    }
  }
`;

const Summary = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: #4b5563;
  margin: 20px 0 0 0;
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-family: 'Barlow Expanded', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 40px 0 24px 0;
  padding-bottom: 8px;
  padding-left: 40px;
  letter-spacing: 2px;
  text-transform: uppercase;
  border-bottom: 2px solid #e11d48;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 30px;
    height: 2px;
    background: #9f1239;
  }
`;

const WorkItem = styled.div`
  margin-bottom: 36px;
  padding-left: 40px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const WorkHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
  gap: 16px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
`;

const Position = styled.h3`
  font-family: 'Barlow Expanded', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  font-size: 19px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  letter-spacing: 1px;
`;

const Company = styled.div`
  font-size: 16px;
  color: #e11d48;
  font-weight: 500;
  margin-top: 4px;
`;

const DateText = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
  white-space: nowrap;
`;

const WorkSummary = styled.p`
  margin: 12px 0;
  color: #4b5563;
  line-height: 1.8;
  font-size: 15px;
`;

const Highlights = styled.ul`
  margin: 12px 0 0 0;
  padding-left: 20px;
  list-style-type: none;

  li {
    margin: 8px 0;
    color: #4b5563;
    line-height: 1.8;
    padding-left: 4px;
    position: relative;

    &::before {
      content: '▸';
      position: absolute;
      left: -16px;
      color: #e11d48;
      font-weight: bold;
    }
  }
`;

const EducationItem = styled.div`
  margin-bottom: 24px;
  padding-left: 40px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Institution = styled.h3`
  font-family: 'Barlow Expanded', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 6px 0;
  letter-spacing: 1px;
`;

const Degree = styled.div`
  font-size: 15px;
  color: #4b5563;
  margin-bottom: 4px;
`;

const EducationDate = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  padding-left: 40px;
`;

const SkillCategory = styled.div`
  padding: 18px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  border-left: 4px solid #e11d48;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const SkillName = styled.h4`
  font-family: 'Barlow Expanded', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const SkillTags = styled.div`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
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
