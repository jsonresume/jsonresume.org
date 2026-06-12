import React from 'react';
import styled from 'styled-components';
import {
  Section,
  SectionTitle,
  ContactInfo,
  DateRange,
} from '@jsonresume/core';

// Layout
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

// Header
const HeaderSection = styled.header`
  width: 100%;
  background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%);
  padding: 80px 60px;
  margin-bottom: 60px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
    transform: translate(30%, -30%);
  }

  @media print {
    padding: 60px 40px;
    background: #0f766e;
  }
`;

const Name = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  color: white;
  margin: 0 0 16px 0;
  letter-spacing: -2px;
  line-height: 1;
  text-transform: uppercase;
  position: relative;
  z-index: 1;

  @media print {
    font-size: 3.5rem;
  }
`;

const Label = styled.div`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 32px;
  font-weight: 300;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;
`;

const StyledContactInfo = styled(ContactInfo)`
  font-size: 16px;
  position: relative;
  z-index: 1;

  a {
    color: white;
    font-weight: 400;
  }

  span {
    color: rgba(255, 255, 255, 0.9);
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

// Section styles
const StyledSectionTitle = styled(SectionTitle)`
  font-size: 14px;
  font-weight: 700;
  color: #0f766e;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 60px 0 32px 0;
  padding-bottom: 12px;
  border-bottom: 3px solid #0f766e;
`;

const ContentBlock = styled.div`
  margin-bottom: 50px;
  background: #fafafa;
  padding: 32px;
  border-radius: 8px;
  border-left: 5px solid #0f766e;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:last-child {
    margin-bottom: 0;
  }

  @media print {
    background: white;
    border: 1px solid #e5e7eb;
    padding: 24px;
  }
`;

// Work section
const WorkHeader = styled.div`
  margin-bottom: 16px;
`;

const Position = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
`;

const Company = styled.div`
  font-size: 18px;
  color: #0f766e;
  font-weight: 500;
  margin-bottom: 8px;
`;

const DateText = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const WorkSummary = styled.p`
  margin: 16px 0;
  color: #4b5563;
  line-height: 1.7;
  font-size: 16px;
  font-weight: 300;
`;

const Highlights = styled.ul`
  margin: 16px 0 0 0;
  padding-left: 24px;
  list-style-type: none;

  li {
    margin: 10px 0;
    color: #374151;
    line-height: 1.7;
    font-weight: 300;
    position: relative;
    padding-left: 8px;

    &::before {
      content: '▸';
      position: absolute;
      left: -16px;
      color: #0f766e;
      font-weight: 700;
    }
  }
`;

// Skills section
const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 28px;
`;

const SkillCategory = styled.div`
  padding: 28px;
  background: white;
  border-radius: 8px;
  border: 2px solid #0f766e;
  transition: transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const SkillName = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: #0f766e;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const SkillTags = styled.div`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  font-weight: 300;
`;

// Education section
const Institution = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
`;

const Degree = styled.div`
  font-size: 16px;
  color: #4b5563;
  margin-bottom: 8px;
  font-weight: 400;
`;

const EducationDate = styled.div`
  font-size: 14px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

// Sub-components
function Header({ basics }) {
  return (
    <HeaderSection>
      <Name>{basics.name}</Name>
      {basics.label && <Label>{basics.label}</Label>}
      <StyledContactInfo basics={basics} />
    </HeaderSection>
  );
}

function WorkSection({ work }) {
  if (!work?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>Experience</StyledSectionTitle>
      {work.map((job, index) => (
        <ContentBlock key={index}>
          <WorkHeader>
            <Position>{job.position}</Position>
            {job.name && <Company>{job.name}</Company>}
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
        </ContentBlock>
      ))}
    </Section>
  );
}

function SkillsSection({ skills }) {
  if (!skills?.length) return null;

  return (
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
  );
}

function EducationSection({ education }) {
  if (!education?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>Education</StyledSectionTitle>
      {education.map((edu, index) => (
        <ContentBlock key={index}>
          <Institution>{edu.institution}</Institution>
          <Degree>
            {edu.studyType} in {edu.area}
            {edu.score && ` • ${edu.score}`}
          </Degree>
          <EducationDate>
            <DateRange startDate={edu.startDate} endDate={edu.endDate} />
          </EducationDate>
        </ContentBlock>
      ))}
    </Section>
  );
}

function ProjectsSection({ projects }) {
  if (!projects?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>Projects</StyledSectionTitle>
      {projects.map((project, index) => (
        <ContentBlock key={index}>
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
        </ContentBlock>
      ))}
    </Section>
  );
}

function VolunteerSection({ volunteer }) {
  if (!volunteer?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>Volunteer</StyledSectionTitle>
      {volunteer.map((vol, index) => (
        <ContentBlock key={index}>
          <WorkHeader>
            <Position>{vol.position}</Position>
            {vol.organization && <Company>{vol.organization}</Company>}
            {(vol.startDate || vol.endDate) && (
              <DateText>
                <DateRange startDate={vol.startDate} endDate={vol.endDate} />
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
        </ContentBlock>
      ))}
    </Section>
  );
}

function AwardsSection({ awards }) {
  if (!awards?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>Awards</StyledSectionTitle>
      {awards.map((award, index) => (
        <ContentBlock key={index}>
          <Institution>{award.title}</Institution>
          {award.awarder && <Degree>Awarded by {award.awarder}</Degree>}
          {award.date && <EducationDate>{award.date}</EducationDate>}
          {award.summary && <WorkSummary>{award.summary}</WorkSummary>}
        </ContentBlock>
      ))}
    </Section>
  );
}

function CertificatesSection({ certificates }) {
  if (!certificates?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>Certificates</StyledSectionTitle>
      {certificates.map((cert, index) => (
        <ContentBlock key={index}>
          <Institution>{cert.name}</Institution>
          {cert.issuer && <Degree>Issued by {cert.issuer}</Degree>}
          {cert.date && <EducationDate>{cert.date}</EducationDate>}
        </ContentBlock>
      ))}
    </Section>
  );
}

function PublicationsSection({ publications }) {
  if (!publications?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>Publications</StyledSectionTitle>
      {publications.map((pub, index) => (
        <ContentBlock key={index}>
          <Institution>{pub.name}</Institution>
          {pub.publisher && <Degree>Published by {pub.publisher}</Degree>}
          {pub.releaseDate && <EducationDate>{pub.releaseDate}</EducationDate>}
          {pub.summary && <WorkSummary>{pub.summary}</WorkSummary>}
        </ContentBlock>
      ))}
    </Section>
  );
}

function LanguagesSection({ languages }) {
  if (!languages?.length) return null;

  return (
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
  );
}

function ReferencesSection({ references }) {
  if (!references?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>References</StyledSectionTitle>
      {references.map((ref, index) => (
        <ContentBlock key={index}>
          <Institution>{ref.name}</Institution>
          {ref.reference && <WorkSummary>{ref.reference}</WorkSummary>}
        </ContentBlock>
      ))}
    </Section>
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
    certificates = [],
    publications = [],
    languages = [],
    references = [],
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
        <VolunteerSection volunteer={volunteer} />
        <AwardsSection awards={awards} />
        <CertificatesSection certificates={certificates} />
        <PublicationsSection publications={publications} />
        <LanguagesSection languages={languages} />
        <ReferencesSection references={references} />
      </ContentWrapper>
    </Layout>
  );
}

export default Resume;
