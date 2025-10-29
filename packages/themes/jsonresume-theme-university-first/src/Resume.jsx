import React from 'react';
import styled from 'styled-components';
import { Section, SectionTitle, DateRange, ContactInfo } from '@resume/core';

const Layout = styled.div`
  max-width: 850px;
  margin: 0 auto;
  padding: 50px 40px;
  background: white;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  color: #1f2937;
  font-size: 11pt;
  line-height: 1.6;

  @media print {
    padding: 40px;
  }
`;

const Header = styled.header`
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
  text-align: center;
`;

const Name = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 6px 0;
  letter-spacing: -0.3px;
`;

const Label = styled.div`
  font-size: 15px;
  color: #6b7280;
  margin-bottom: 16px;
  font-weight: 500;
`;

const StyledContactInfo = styled(ContactInfo)`
  font-size: 14px;
  justify-content: center;

  a {
    font-size: 14px;
  }
`;

const Summary = styled.p`
  font-size: 14px;
  line-height: 1.7;
  color: #4b5563;
  margin: 16px 0 0 0;
  text-align: center;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-size: 18px;
  font-weight: 700;
  color: #2563eb;
  margin: 32px 0 20px 0;
  padding-bottom: 6px;
  border-bottom: 2px solid #2563eb;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const EducationItem = styled.div`
  margin-bottom: 28px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Institution = styled.h3`
  font-size: 17px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 6px 0;
  font-family: Georgia, 'Times New Roman', serif;
`;

const Degree = styled.div`
  font-size: 15px;
  color: #374151;
  margin-bottom: 4px;
  font-weight: 500;
`;

const EducationMeta = styled.div`
  font-size: 14px;
  color: #6b7280;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Courses = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: #4b5563;

  strong {
    color: #374151;
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
  margin-bottom: 8px;
  gap: 16px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
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
  font-size: 15px;
  color: #2563eb;
  font-weight: 500;
  margin-top: 4px;
`;

const DateText = styled.div`
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
  white-space: nowrap;
`;

const WorkSummary = styled.p`
  margin: 10px 0;
  color: #4b5563;
  line-height: 1.7;
  font-size: 14px;
`;

const Highlights = styled.ul`
  margin: 10px 0 0 0;
  padding-left: 20px;
  list-style-type: disc;

  li {
    margin: 6px 0;
    color: #4b5563;
    line-height: 1.7;
    padding-left: 4px;
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
`;

const SkillCategory = styled.div`
  padding: 14px;
  background: #f0f9ff;
  border-radius: 6px;
  border-left: 3px solid #2563eb;
`;

const SkillName = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 6px 0;
`;

const SkillTags = styled.div`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
`;

const ProjectItem = styled(WorkItem)``;

const ProjectTitle = styled(Position)`
  font-size: 16px;
`;

const ProjectMeta = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 4px;
  font-size: 13px;
  color: #6b7280;
  flex-wrap: wrap;
`;

const ProjectLink = styled.a`
  color: #2563eb;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const AwardItem = styled(EducationItem)``;

const AwardTitle = styled(Institution)`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  font-size: 16px;
`;

const SimpleList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
`;

const SimpleItem = styled.div`
  font-size: 14px;
  color: #4b5563;

  strong {
    color: #111827;
    font-weight: 600;
  }
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

      {education?.length > 0 && (
        <Section>
          <StyledSectionTitle>Education</StyledSectionTitle>
          {education.map((edu, index) => (
            <EducationItem key={index}>
              <Institution>{edu.institution}</Institution>
              <Degree>
                {edu.studyType} in {edu.area}
              </Degree>
              <EducationMeta>
                <DateText>
                  <DateRange startDate={edu.startDate} endDate={edu.endDate} />
                </DateText>
                {edu.score && <span>GPA: {edu.score}</span>}
              </EducationMeta>
              {edu.courses?.length > 0 && (
                <Courses>
                  <strong>Relevant Coursework:</strong> {edu.courses.join(', ')}
                </Courses>
              )}
            </EducationItem>
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

      {projects?.length > 0 && (
        <Section>
          <StyledSectionTitle>Projects</StyledSectionTitle>
          {projects.map((project, index) => (
            <ProjectItem key={index}>
              <ProjectTitle>{project.name}</ProjectTitle>
              <ProjectMeta>
                {project.startDate && (
                  <DateText>
                    <DateRange
                      startDate={project.startDate}
                      endDate={project.endDate}
                    />
                  </DateText>
                )}
                {project.url && (
                  <ProjectLink
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project
                  </ProjectLink>
                )}
              </ProjectMeta>
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

      {volunteer?.length > 0 && (
        <Section>
          <StyledSectionTitle>Volunteer Experience</StyledSectionTitle>
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
          <StyledSectionTitle>Awards & Honors</StyledSectionTitle>
          {awards.map((award, index) => (
            <AwardItem key={index}>
              <AwardTitle>{award.title}</AwardTitle>
              {award.awarder && <Degree>Awarded by {award.awarder}</Degree>}
              {award.date && <DateText>{award.date}</DateText>}
              {award.summary && <WorkSummary>{award.summary}</WorkSummary>}
            </AwardItem>
          ))}
        </Section>
      )}

      {publications?.length > 0 && (
        <Section>
          <StyledSectionTitle>Publications</StyledSectionTitle>
          {publications.map((pub, index) => (
            <AwardItem key={index}>
              <AwardTitle>{pub.name}</AwardTitle>
              {pub.publisher && <Degree>Published by {pub.publisher}</Degree>}
              {pub.releaseDate && <DateText>{pub.releaseDate}</DateText>}
              {pub.summary && <WorkSummary>{pub.summary}</WorkSummary>}
            </AwardItem>
          ))}
        </Section>
      )}

      {languages?.length > 0 && (
        <Section>
          <StyledSectionTitle>Languages</StyledSectionTitle>
          <SimpleList>
            {languages.map((lang, index) => (
              <SimpleItem key={index}>
                <strong>{lang.language}</strong>
                {lang.fluency && ` - ${lang.fluency}`}
              </SimpleItem>
            ))}
          </SimpleList>
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
            <AwardItem key={index}>
              <AwardTitle>{ref.name}</AwardTitle>
              {ref.reference && <WorkSummary>{ref.reference}</WorkSummary>}
            </AwardItem>
          ))}
        </Section>
      )}
    </Layout>
  );
}

export default Resume;
