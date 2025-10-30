import React from 'react';
import styled from 'styled-components';
import { Section, SectionTitle, ContactInfo, DateRange } from '@resume/core';

// Layout
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

// Header
const HeaderContainer = styled.header`
  margin-bottom: 48px;
  padding-bottom: 24px;
  border-bottom: 2px solid #333333;
`;

const Name = styled.h1`
  font-family: 'Work Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 38px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const Label = styled.div`
  font-size: 16px;
  color: #666666;
  margin-bottom: 16px;
  font-weight: 400;
  letter-spacing: 0.5px;
`;

const StyledContactInfo = styled(ContactInfo)`
  font-size: 14px;
  font-family: 'Courier Prime', monospace;

  a {
    font-size: 14px;
    color: #333333;
    text-decoration: underline;
  }
`;

const Summary = styled.p`
  font-size: 15px;
  line-height: 1.8;
  color: #444444;
  margin: 20px 0 0 0;
  font-family: 'Courier Prime', monospace;
`;

// Work section
const WorkItem = styled.div`
  margin-bottom: 32px;
  position: relative;
  padding-left: 120px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 640px) {
    padding-left: 0;
  }
`;

const DateText = styled.div`
  position: absolute;
  left: 0;
  top: 2px;
  font-size: 13px;
  color: #666666;
  font-weight: 400;
  width: 100px;
  text-align: left;
  font-family: 'Courier Prime', monospace;

  @media (max-width: 640px) {
    position: static;
    margin-bottom: 8px;
  }
`;

const Position = styled.h3`
  font-family: 'Work Sans', sans-serif;
  font-size: 17px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 6px 0;
`;

const Company = styled.div`
  font-size: 15px;
  color: #555555;
  font-weight: 400;
  margin-bottom: 8px;
  font-family: 'Courier Prime', monospace;
`;

const WorkSummary = styled.p`
  margin: 12px 0;
  color: #444444;
  line-height: 1.8;
  font-size: 14px;
  font-family: 'Courier Prime', monospace;
`;

const Highlights = styled.ul`
  margin: 12px 0 0 0;
  padding-left: 20px;
  list-style-type: square;

  li {
    margin: 8px 0;
    color: #444444;
    line-height: 1.8;
    padding-left: 4px;
    font-family: 'Courier Prime', monospace;
    font-size: 14px;
  }
`;

// Education section
const EducationItem = styled.div`
  margin-bottom: 24px;
  position: relative;
  padding-left: 120px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 640px) {
    padding-left: 0;
  }
`;

const Institution = styled.h3`
  font-family: 'Work Sans', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 6px 0;
`;

const Degree = styled.div`
  font-size: 14px;
  color: #555555;
  margin-bottom: 4px;
  font-family: 'Courier Prime', monospace;
`;

// Skills section
const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
`;

const SkillCategory = styled.div`
  padding: 12px;
  background: #fefce8;
  border: 2px solid #333333;
`;

const SkillName = styled.h4`
  font-family: 'Work Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 6px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SkillTags = styled.div`
  font-size: 13px;
  color: #555555;
  line-height: 1.6;
  font-family: 'Courier Prime', monospace;
`;

// Sub-components
function Header({ basics = {} }) {
  return (
    <HeaderContainer>
      <Name>{basics.name}</Name>
      {basics.label && <Label>{basics.label}</Label>}
      <StyledContactInfo basics={basics} />
      {basics.summary && <Summary>{basics.summary}</Summary>}
    </HeaderContainer>
  );
}

function WorkExperience({ work = [] }) {
  if (!work?.length) return null;

  return (
    <>
      {work.map((job, index) => (
        <WorkItem key={index}>
          <DateText>
            <DateRange startDate={job.startDate} endDate={job.endDate} />
          </DateText>
          <Position>{job.position}</Position>
          {job.name && <Company>{job.name}</Company>}
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
    </>
  );
}

function Education({ education = [] }) {
  if (!education?.length) return null;

  return (
    <>
      {education.map((edu, index) => (
        <EducationItem key={index}>
          <DateText>
            <DateRange startDate={edu.startDate} endDate={edu.endDate} />
          </DateText>
          <Institution>{edu.institution}</Institution>
          <Degree>
            {edu.studyType} in {edu.area}
            {edu.score && ` • ${edu.score}`}
          </Degree>
        </EducationItem>
      ))}
    </>
  );
}

function Skills({ skills = [] }) {
  if (!skills?.length) return null;

  return (
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
  );
}

function Projects({ projects = [] }) {
  if (!projects?.length) return null;

  return (
    <>
      {projects.map((project, index) => (
        <WorkItem key={index}>
          <DateText>
            {project.startDate && (
              <DateRange
                startDate={project.startDate}
                endDate={project.endDate}
              />
            )}
          </DateText>
          <Position>{project.name}</Position>
          {project.description && <Company>{project.description}</Company>}
          {project.summary && <WorkSummary>{project.summary}</WorkSummary>}
          {project.highlights?.length > 0 && (
            <Highlights>
              {project.highlights.map((highlight, i) => (
                <li key={i}>{highlight}</li>
              ))}
            </Highlights>
          )}
        </WorkItem>
      ))}
    </>
  );
}

function Volunteer({ volunteer = [] }) {
  if (!volunteer?.length) return null;

  return (
    <>
      {volunteer.map((vol, index) => (
        <WorkItem key={index}>
          <DateText>
            {(vol.startDate || vol.endDate) && (
              <DateRange startDate={vol.startDate} endDate={vol.endDate} />
            )}
          </DateText>
          <Position>{vol.position}</Position>
          {vol.organization && <Company>{vol.organization}</Company>}
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
    </>
  );
}

function Awards({ awards = [] }) {
  if (!awards?.length) return null;

  return (
    <>
      {awards.map((award, index) => (
        <EducationItem key={index}>
          <DateText>{award.date || ''}</DateText>
          <Institution>{award.title}</Institution>
          {award.awarder && <Degree>Awarded by {award.awarder}</Degree>}
          {award.summary && <WorkSummary>{award.summary}</WorkSummary>}
        </EducationItem>
      ))}
    </>
  );
}

function Publications({ publications = [] }) {
  if (!publications?.length) return null;

  return (
    <>
      {publications.map((pub, index) => (
        <EducationItem key={index}>
          <DateText>{pub.releaseDate || ''}</DateText>
          <Institution>{pub.name}</Institution>
          {pub.publisher && <Degree>Published by {pub.publisher}</Degree>}
          {pub.summary && <WorkSummary>{pub.summary}</WorkSummary>}
        </EducationItem>
      ))}
    </>
  );
}

function References({ references = [] }) {
  if (!references?.length) return null;

  return (
    <>
      {references.map((ref, index) => (
        <EducationItem key={index}>
          <Institution>{ref.name}</Institution>
          {ref.reference && <WorkSummary>{ref.reference}</WorkSummary>}
        </EducationItem>
      ))}
    </>
  );
}

// Main component
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
          <Projects projects={projects} />
        </Section>
      )}

      {volunteer?.length > 0 && (
        <Section>
          <StyledSectionTitle>Volunteer</StyledSectionTitle>
          <Volunteer volunteer={volunteer} />
        </Section>
      )}

      {awards?.length > 0 && (
        <Section>
          <StyledSectionTitle>Awards</StyledSectionTitle>
          <Awards awards={awards} />
        </Section>
      )}

      {publications?.length > 0 && (
        <Section>
          <StyledSectionTitle>Publications</StyledSectionTitle>
          <Publications publications={publications} />
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
          <References references={references} />
        </Section>
      )}
    </Layout>
  );
}

export default Resume;
