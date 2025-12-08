import React from 'react';
import styled from 'styled-components';
import {
  Section,
  SectionTitle,
  DateRange,
  ContactInfo,
} from '@jsonresume/core';

const Layout = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  max-width: 1100px;
  margin: 0 auto;
  background: white;
  box-shadow: 0 0 60px rgba(0, 0, 0, 0.12);
  min-height: 100vh;

  @media print {
    box-shadow: none;
    min-height: auto;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  background: linear-gradient(to bottom, #475569 0%, #334155 100%);
  color: white;
  padding: 60px 40px;

  @media print {
    background: #475569;
  }
`;

const MainContent = styled.main`
  padding: 60px 50px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  color: #334155;

  @media print {
    padding: 40px;
  }
`;

const Header = styled.header`
  margin-bottom: 50px;
`;

const Name = styled.h1`
  font-family: 'Merriweather', Georgia, serif;
  font-size: 36px;
  font-weight: 700;
  color: white;
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
  line-height: 1.2;
`;

const Label = styled.div`
  font-size: 15px;
  color: #cbd5e1;
  margin-bottom: 30px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding-bottom: 30px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
`;

const StyledContactInfo = styled(ContactInfo)`
  font-size: 13px;
  color: #e2e8f0;

  a {
    color: #e2e8f0;
    text-decoration: none;

    &:hover {
      color: white;
    }
  }
`;

const Summary = styled.p`
  font-size: 15px;
  line-height: 1.8;
  color: #475569;
  margin: 0 0 30px 0;
`;

const SidebarSectionTitle = styled(SectionTitle)`
  font-family: 'Merriweather', Georgia, serif;
  font-size: 16px;
  font-weight: 700;
  color: white;
  margin: 40px 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-family: 'Merriweather', Georgia, serif;
  font-size: 24px;
  font-weight: 700;
  color: #475569;
  margin: 50px 0 30px 0;
  padding-bottom: 12px;
  border-bottom: 3px solid #475569;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 60px;
    height: 3px;
    background: #94a3b8;
  }
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
    gap: 6px;
  }
`;

const Position = styled.h3`
  font-family: 'Merriweather', Georgia, serif;
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const Company = styled.div`
  font-size: 17px;
  color: #2f4f4f;
  font-weight: 600;
  margin-top: 6px;
`;

const DateText = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
  white-space: nowrap;
`;

const WorkSummary = styled.p`
  margin: 14px 0;
  color: #4b5563;
  line-height: 1.8;
  font-size: 15px;
`;

const Highlights = styled.ul`
  margin: 14px 0 0 0;
  padding-left: 24px;
  list-style-type: disc;

  li {
    margin: 10px 0;
    color: #4b5563;
    line-height: 1.8;
    padding-left: 6px;
  }
`;

const EducationItem = styled.div`
  margin-bottom: 28px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Institution = styled.h3`
  font-family: 'Merriweather', Georgia, serif;
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
`;

const Degree = styled.div`
  font-size: 16px;
  color: #4b5563;
  margin-bottom: 6px;
`;

const EducationDate = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
`;

const SkillCategory = styled.div`
  padding: 20px 24px;
  background: white;
  border-radius: 6px;
  border-left: 4px solid #475569;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

const SkillName = styled.h4`
  font-family: 'Merriweather', Georgia, serif;
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 10px 0;
`;

const SkillTags = styled.div`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.7;
`;

const SidebarSkill = styled.div`
  margin-bottom: 20px;
  font-size: 14px;
  color: #e2e8f0;
  line-height: 1.7;

  strong {
    display: block;
    color: white;
    font-weight: 600;
    margin-bottom: 6px;
    font-size: 13px;
  }
`;

const SidebarEducation = styled.div`
  margin-bottom: 20px;

  h4 {
    font-family: 'Merriweather', Georgia, serif;
    font-size: 14px;
    font-weight: 700;
    color: white;
    margin: 0 0 6px 0;
  }

  p {
    font-size: 13px;
    color: #cbd5e1;
    line-height: 1.6;
    margin: 0 0 4px 0;
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
      <Sidebar>
        <Header>
          <Name>{basics.name}</Name>
          {basics.label && <Label>{basics.label}</Label>}
        </Header>

        <StyledContactInfo basics={basics} />

        {skills?.length > 0 && (
          <Section>
            <SidebarSectionTitle>Skills</SidebarSectionTitle>
            {skills.map((skill, index) => (
              <SidebarSkill key={index}>
                <strong>{skill.name}</strong>
                {skill.keywords?.length > 0 && skill.keywords.join(', ')}
              </SidebarSkill>
            ))}
          </Section>
        )}

        {education?.length > 0 && (
          <Section>
            <SidebarSectionTitle>Education</SidebarSectionTitle>
            {education.map((edu, index) => (
              <SidebarEducation key={index}>
                <h4>{edu.institution}</h4>
                <p>
                  {edu.studyType} in {edu.area}
                </p>
                {(edu.startDate || edu.endDate) && (
                  <p>
                    <DateRange
                      startDate={edu.startDate}
                      endDate={edu.endDate}
                    />
                  </p>
                )}
              </SidebarEducation>
            ))}
          </Section>
        )}

        {languages?.length > 0 && (
          <Section>
            <SidebarSectionTitle>Languages</SidebarSectionTitle>
            {languages.map((lang, index) => (
              <SidebarSkill key={index}>
                <strong>{lang.language}</strong>
                {lang.fluency}
              </SidebarSkill>
            ))}
          </Section>
        )}
      </Sidebar>

      <MainContent>
        {basics.summary && <Summary>{basics.summary}</Summary>}

        {work?.length > 0 && (
          <Section>
            <StyledSectionTitle>Professional Experience</StyledSectionTitle>
            {work.map((job, index) => (
              <WorkItem key={index}>
                <WorkHeader>
                  <div>
                    <Position>{job.position}</Position>
                    {job.name && <Company>{job.name}</Company>}
                  </div>
                  <DateText>
                    <DateRange
                      startDate={job.startDate}
                      endDate={job.endDate}
                    />
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

        {projects?.length > 0 && (
          <Section>
            <StyledSectionTitle>Notable Projects</StyledSectionTitle>
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
            <StyledSectionTitle>Volunteer Work</StyledSectionTitle>
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
            <StyledSectionTitle>Awards & Recognition</StyledSectionTitle>
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
      </MainContent>
    </Layout>
  );
}

export default Resume;
