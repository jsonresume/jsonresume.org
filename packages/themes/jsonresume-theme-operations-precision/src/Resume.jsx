import React from 'react';
import styled from 'styled-components';
import { Section, SectionTitle, DateRange, ContactInfo } from '@resume/core';

const Layout = styled.div`
  max-width: 850px;
  margin: 0 auto;
  padding: 40px 35px;
  background: white;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  color: #1f2937;
  font-size: 15px;
  line-height: 1.5;

  @media print {
    padding: 30px;
  }
`;

const Header = styled.header`
  margin-bottom: 35px;
  padding-bottom: 20px;
  border-bottom: 2px solid #0f766e;
`;

const Name = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #0f766e;
  margin: 0 0 6px 0;
  letter-spacing: -0.3px;
`;

const Label = styled.div`
  font-size: 15px;
  color: #4b5563;
  margin-bottom: 16px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StyledContactInfo = styled(ContactInfo)`
  font-size: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  a {
    font-size: 14px;
    color: #0f766e;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Summary = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: #374151;
  margin: 16px 0 0 0;
  text-align: justify;
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-size: 16px;
  font-weight: 700;
  color: #0f766e;
  margin: 28px 0 16px 0;
  padding-bottom: 6px;
  border-bottom: 2px solid #0f766e;
  text-transform: uppercase;
  letter-spacing: 0.8px;
`;

const WorkItem = styled.div`
  margin-bottom: 24px;
  page-break-inside: avoid;

  &:last-child {
    margin-bottom: 0;
  }
`;

const WorkHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  margin-bottom: 6px;
  align-items: baseline;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 4px;
  }
`;

const Position = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const Company = styled.div`
  font-size: 14px;
  color: #0f766e;
  font-weight: 500;
  margin-top: 2px;
`;

const DateText = styled.div`
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
`;

const WorkSummary = styled.p`
  margin: 8px 0;
  color: #4b5563;
  line-height: 1.6;
  font-size: 14px;
`;

const Highlights = styled.ul`
  margin: 8px 0 0 0;
  padding-left: 18px;
  list-style-type: square;

  li {
    margin: 6px 0;
    color: #4b5563;
    line-height: 1.6;
    font-size: 14px;
    padding-left: 4px;
  }
`;

const EducationItem = styled.div`
  margin-bottom: 20px;
  page-break-inside: avoid;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Institution = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
`;

const Degree = styled.div`
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 3px;
`;

const EducationDate = styled.div`
  font-size: 13px;
  color: #6b7280;
  font-variant-numeric: tabular-nums;
`;

const SkillsTable = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 12px 20px;
  border: 1px solid #e5e7eb;
  padding: 16px;
  background: #f9fafb;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const SkillName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #0f766e;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  align-self: start;
  padding-top: 2px;
`;

const SkillTags = styled.div`
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
`;

const ProjectItem = styled.div`
  margin-bottom: 20px;
  page-break-inside: avoid;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 6px;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 4px;
  }
`;

const ProjectName = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const CompactItem = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: #4b5563;
`;

const CompactTitle = styled.span`
  font-weight: 600;
  color: #111827;
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
          <StyledSectionTitle>Skills & Tools</StyledSectionTitle>
          <SkillsTable>
            {skills.map((skill, index) => (
              <React.Fragment key={index}>
                <SkillName>{skill.name}</SkillName>
                <SkillTags>
                  {skill.keywords?.length > 0
                    ? skill.keywords.join(' • ')
                    : '—'}
                </SkillTags>
              </React.Fragment>
            ))}
          </SkillsTable>
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
            <ProjectItem key={index}>
              <ProjectHeader>
                <ProjectName>{project.name}</ProjectName>
                {(project.startDate || project.endDate) && (
                  <DateText>
                    <DateRange
                      startDate={project.startDate}
                      endDate={project.endDate}
                    />
                  </DateText>
                )}
              </ProjectHeader>
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
            </ProjectItem>
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
          <TwoColumnGrid>
            {languages.map((lang, index) => (
              <CompactItem key={index}>
                <CompactTitle>{lang.language}:</CompactTitle>{' '}
                {lang.fluency || '—'}
              </CompactItem>
            ))}
          </TwoColumnGrid>
        </Section>
      )}

      {interests?.length > 0 && (
        <Section>
          <StyledSectionTitle>Interests</StyledSectionTitle>
          <TwoColumnGrid>
            {interests.map((interest, index) => (
              <CompactItem key={index}>
                <CompactTitle>{interest.name}</CompactTitle>
                {interest.keywords?.length > 0 && (
                  <>: {interest.keywords.join(', ')}</>
                )}
              </CompactItem>
            ))}
          </TwoColumnGrid>
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
