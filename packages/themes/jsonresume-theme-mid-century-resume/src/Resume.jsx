import React from 'react';
import styled from 'styled-components';
import {
  Section,
  SectionTitle,
  DateRange,
  ContactInfo,
} from '@jsonresume/core';

const Layout = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 60px 50px;
  background: #fef8e7;
  font-family: 'League Spartan', 'Josefin Sans', 'Futura', sans-serif;
  color: #2c1810;
  position: relative;

  @media print {
    padding: 40px;
    background: white;
  }
`;

const DecorativeCircle = styled.div`
  position: absolute;
  top: 40px;
  right: 40px;
  width: 80px;
  height: 80px;
  border: 3px solid #b45309;
  border-radius: 50%;
  opacity: 0.5;

  @media print {
    display: none;
  }
`;

const DecorativeRectangle = styled.div`
  position: absolute;
  bottom: 40px;
  left: 40px;
  width: 60px;
  height: 60px;
  background: #b45309;
  opacity: 0.25;

  @media print {
    display: none;
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 50px;
  padding-bottom: 30px;
  border-bottom: 4px solid #b45309;
`;

const Name = styled.h1`
  font-size: 48px;
  font-weight: 700;
  color: #2c1810;
  margin: 0 0 12px 0;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const Label = styled.div`
  font-size: 18px;
  color: #b45309;
  margin-bottom: 24px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const StyledContactInfo = styled(ContactInfo)`
  font-size: 15px;
  justify-content: center;

  a {
    font-size: 15px;
    color: #b45309;
    text-decoration: none;
    border-bottom: 2px solid transparent;
    transition: border-color 0.2s ease;

    &:hover {
      border-bottom-color: #b45309;
    }
  }
`;

const Summary = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: #4a3426;
  margin: 24px auto 0;
  text-align: left;
  max-width: 700px;
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-size: 24px;
  font-weight: 700;
  color: #b45309;
  margin: 48px 0 28px 0;
  text-align: center;
  letter-spacing: 3px;
  text-transform: uppercase;
  position: relative;
  padding: 0 100px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 60px;
    height: 3px;
    background: #b45309;
  }

  &::before {
    left: 20px;
  }

  &::after {
    right: 20px;
  }

  @media (max-width: 640px) {
    padding: 0 80px;

    &::before {
      left: 10px;
      width: 50px;
    }

    &::after {
      right: 10px;
      width: 50px;
    }
  }
`;

const WorkItem = styled.div`
  margin-bottom: 36px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.5);
  border-left: 4px solid #b45309;

  &:last-child {
    margin-bottom: 0;
  }
`;

const WorkHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
  gap: 16px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
`;

const Position = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #2c1810;
  margin: 0;
  letter-spacing: 0.5px;
`;

const Company = styled.div`
  font-size: 17px;
  color: #b45309;
  font-weight: 600;
  margin-top: 6px;
`;

const DateText = styled.div`
  font-size: 14px;
  color: #6b5a4d;
  font-weight: 500;
  white-space: nowrap;
  letter-spacing: 1px;
`;

const WorkSummary = styled.p`
  margin: 14px 0;
  color: #4a3426;
  line-height: 1.8;
  font-size: 15px;
  text-align: left;
`;

const Highlights = styled.ul`
  margin: 14px 0 0 0;
  padding-left: 24px;
  list-style-type: square;

  li {
    margin: 10px 0;
    color: #4a3426;
    line-height: 1.7;
    padding-left: 6px;
  }
`;

const EducationItem = styled.div`
  margin-bottom: 28px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.5);
  border-left: 4px solid #b45309;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Institution = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #2c1810;
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
`;

const Degree = styled.div`
  font-size: 16px;
  color: #4a3426;
  margin-bottom: 6px;
`;

const EducationDate = styled.div`
  font-size: 14px;
  color: #6b5a4d;
  letter-spacing: 1px;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
`;

const SkillCategory = styled.div`
  padding: 20px;
  background: rgba(255, 255, 255, 0.6);
  border: 2px solid #b45309;
  text-align: center;
`;

const SkillName = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #b45309;
  margin: 0 0 10px 0;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const SkillTags = styled.div`
  font-size: 14px;
  color: #4a3426;
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
      <DecorativeCircle />
      <DecorativeRectangle />

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
