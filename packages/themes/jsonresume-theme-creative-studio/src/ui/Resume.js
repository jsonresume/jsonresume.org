import React from 'react';
import styled from 'styled-components';
import { Section, SectionTitle, DateRange, ContactInfo } from '@resume/core';

// Creative Studio Theme - Artistic yet professional
// Rounded sans-serif with slightly taller line height
// Color: #ff6363 (warm coral)

const Layout = styled.div`
  max-width: 820px;
  margin: 0 auto;
  padding: 50px 40px;
  background: white;
  font-family: 'Nunito', 'Quicksand', 'Rounded Mplus', -apple-system,
    BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #2d3748;
  line-height: 1.8;

  @media print {
    padding: 40px;
  }
`;

const Header = styled.header`
  margin-bottom: 50px;
  padding-bottom: 30px;
  border-bottom: 3px solid #ff6363;
  background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%);
  padding: 40px;
  border-radius: 16px;
`;

const Name = styled.h1`
  font-size: 44px;
  font-weight: 800;
  color: #ff6363;
  margin: 0 0 10px 0;
  letter-spacing: -0.5px;
`;

const Label = styled.div`
  font-size: 18px;
  color: #718096;
  margin-bottom: 20px;
  font-weight: 600;
`;

const StyledContactInfo = styled(ContactInfo)`
  font-size: 15px;

  a {
    font-size: 15px;
    color: #ff6363;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Summary = styled.p`
  font-size: 16px;
  line-height: 1.9;
  color: #4a5568;
  margin: 20px 0 0 0;
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-size: 26px;
  font-weight: 700;
  color: #ff6363;
  margin: 45px 0 25px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #ffb3b3;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 80px;
    height: 2px;
    background: #ff6363;
  }
`;

const WorkItem = styled.div`
  margin-bottom: 35px;
  padding: 25px;
  background: linear-gradient(135deg, #fff9f9 0%, #ffffff 100%);
  border-radius: 12px;
  border-left: 4px solid #ff6363;

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
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
`;

const Company = styled.div`
  font-size: 17px;
  color: #ff6363;
  font-weight: 600;
  margin-top: 6px;
`;

const DateText = styled.div`
  font-size: 14px;
  color: #a0aec0;
  font-weight: 600;
  white-space: nowrap;
`;

const WorkSummary = styled.p`
  margin: 14px 0;
  color: #4a5568;
  line-height: 1.9;
  font-size: 15px;
`;

const Highlights = styled.ul`
  margin: 14px 0 0 0;
  padding-left: 24px;
  list-style-type: none;

  li {
    margin: 10px 0;
    color: #4a5568;
    line-height: 1.9;
    font-size: 15px;
    padding-left: 8px;
    position: relative;

    &:before {
      content: '◆';
      position: absolute;
      left: -20px;
      color: #ff6363;
      font-size: 12px;
    }
  }
`;

const EducationItem = styled.div`
  margin-bottom: 28px;
  padding: 20px;
  background: #fafafa;
  border-radius: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Institution = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px 0;
`;

const Degree = styled.div`
  font-size: 16px;
  color: #4a5568;
  margin-bottom: 6px;
  font-weight: 600;
`;

const EducationDate = styled.div`
  font-size: 14px;
  color: #a0aec0;
  font-weight: 600;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
`;

const SkillCategory = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #fff9f9 0%, #ffffff 100%);
  border-radius: 12px;
  border: 2px solid #ffe4e4;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 99, 99, 0.15);
  }
`;

const SkillName = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: #ff6363;
  margin: 0 0 10px 0;
`;

const SkillTags = styled.div`
  font-size: 14px;
  color: #718096;
  line-height: 1.7;
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
        {basics.name && <Name>{basics.name}</Name>}
        {basics.label && <Label>{basics.label}</Label>}
        <StyledContactInfo basics={basics} />
        {basics.summary && <Summary>{basics.summary}</Summary>}
      </Header>

      {work?.length > 0 && (
        <Section>
          <StyledSectionTitle>Work Experience</StyledSectionTitle>
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
                  <SkillTags>{skill.keywords.join(' • ')}</SkillTags>
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
                  <SkillTags>{interest.keywords.join(' • ')}</SkillTags>
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
