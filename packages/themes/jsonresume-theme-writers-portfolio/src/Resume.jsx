import React from 'react';
import styled from 'styled-components';
import { Section, SectionTitle, DateRange, ContactInfo } from '@resume/core';

/**
 * Writer's Portfolio Resume Theme
 * Literary, elegant design with transitional serif typography
 * Perfect for content writers, editors, and communications professionals
 */

const Layout = styled.div`
  max-width: 680px;
  margin: 0 auto;
  padding: 60px 50px;
  background: #fefdfb;
  font-family: 'Merriweather', 'Charter', Georgia, serif;
  color: #2f2f2f;
  font-size: 17px;
  line-height: 1.75;

  @media print {
    padding: 40px 30px;
    background: white;
  }

  @media (max-width: 768px) {
    padding: 40px 30px;
  }
`;

const Header = styled.header`
  margin-bottom: 50px;
  padding-bottom: 30px;
  border-bottom: 1px solid #d4d0c8;
  text-align: center;
`;

const Name = styled.h1`
  font-size: 38px;
  font-weight: 400;
  color: #2f2f2f;
  margin: 0 0 12px 0;
  letter-spacing: 0.5px;
  font-family: 'Merriweather', 'Charter', Georgia, serif;
`;

const Label = styled.div`
  font-size: 16px;
  color: #5a5a5a;
  margin-bottom: 20px;
  font-weight: 300;
  font-style: italic;
  letter-spacing: 0.3px;
`;

const StyledContactInfo = styled(ContactInfo)`
  font-size: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  margin-top: 20px;

  a {
    font-size: 15px;
    color: #2f2f2f;
    text-decoration: none;
    border-bottom: 1px solid #d4d0c8;
    transition: border-color 0.2s;

    &:hover {
      border-bottom-color: #2f2f2f;
    }
  }
`;

const Summary = styled.div`
  font-size: 18px;
  line-height: 1.8;
  color: #3a3a3a;
  margin: 40px 0 0 0;
  text-align: left;
  text-indent: 2em;

  &::first-letter {
    font-size: 2.5em;
    float: left;
    line-height: 0.85;
    margin: 0.05em 0.1em 0 0;
    color: #2f2f2f;
  }
`;

const StyledSection = styled(Section)`
  margin: 45px 0;
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-size: 22px;
  font-weight: 400;
  color: #2f2f2f;
  margin: 0 0 25px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #d4d0c8;
  text-align: center;
  letter-spacing: 1px;
  font-family: 'Merriweather', 'Charter', Georgia, serif;
`;

const WorkItem = styled.div`
  margin-bottom: 35px;
  page-break-inside: avoid;

  &:last-child {
    margin-bottom: 0;
  }
`;

const WorkHeader = styled.div`
  margin-bottom: 10px;
`;

const Position = styled.h3`
  font-size: 19px;
  font-weight: 700;
  color: #2f2f2f;
  margin: 0 0 6px 0;
  font-family: 'Merriweather', 'Charter', Georgia, serif;
`;

const CompanyLine = styled.div`
  font-size: 16px;
  color: #5a5a5a;
  display: flex;
  gap: 12px;
  align-items: center;
  font-style: italic;
  flex-wrap: wrap;
`;

const Company = styled.span`
  font-weight: 400;
`;

const DateText = styled.span`
  font-size: 15px;
  color: #7a7a7a;
  font-style: normal;
  font-variant-numeric: oldstyle-nums;

  &::before {
    content: '•';
    margin-right: 12px;
    color: #d4d0c8;
  }
`;

const WorkSummary = styled.p`
  margin: 15px 0;
  color: #3a3a3a;
  line-height: 1.8;
  font-size: 17px;
  text-align: justify;
`;

const Highlights = styled.ul`
  margin: 15px 0 0 25px;
  padding: 0;
  list-style-type: '—';

  li {
    margin: 10px 0;
    padding-left: 12px;
    color: #3a3a3a;
    line-height: 1.8;
    font-size: 16px;
    text-align: justify;
  }
`;

const EducationItem = styled.div`
  margin-bottom: 30px;
  page-break-inside: avoid;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Institution = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #2f2f2f;
  margin: 0 0 6px 0;
  font-family: 'Merriweather', 'Charter', Georgia, serif;
`;

const Degree = styled.div`
  font-size: 16px;
  color: #5a5a5a;
  margin-bottom: 4px;
  font-style: italic;
`;

const EducationDate = styled.div`
  font-size: 15px;
  color: #7a7a7a;
  font-variant-numeric: oldstyle-nums;
`;

const SkillsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SkillItem = styled.div`
  border-left: 2px solid #d4d0c8;
  padding-left: 20px;
`;

const SkillName = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: #2f2f2f;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Merriweather', 'Charter', Georgia, serif;
`;

const SkillKeywords = styled.div`
  font-size: 16px;
  color: #5a5a5a;
  line-height: 1.7;
`;

const ProjectItem = styled.div`
  margin-bottom: 30px;
  page-break-inside: avoid;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ProjectHeader = styled.div`
  margin-bottom: 10px;
`;

const ProjectName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #2f2f2f;
  margin: 0 0 6px 0;
  font-family: 'Merriweather', 'Charter', Georgia, serif;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const CompactItem = styled.div`
  font-size: 16px;
  line-height: 1.7;
  color: #3a3a3a;
`;

const CompactTitle = styled.span`
  font-weight: 700;
  color: #2f2f2f;
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
      </Header>

      {basics.summary && <Summary>{basics.summary}</Summary>}

      {work?.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Experience</StyledSectionTitle>
          {work.map((job, index) => (
            <WorkItem key={index}>
              <WorkHeader>
                <Position>{job.position}</Position>
                <CompanyLine>
                  {job.name && <Company>{job.name}</Company>}
                  <DateText>
                    <DateRange
                      startDate={job.startDate}
                      endDate={job.endDate}
                    />
                  </DateText>
                </CompanyLine>
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
        </StyledSection>
      )}

      {publications?.length > 0 && (
        <StyledSection>
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
        </StyledSection>
      )}

      {skills?.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Skills & Expertise</StyledSectionTitle>
          <SkillsContainer>
            {skills.map((skill, index) => (
              <SkillItem key={index}>
                <SkillName>{skill.name}</SkillName>
                <SkillKeywords>
                  {skill.keywords?.length > 0
                    ? skill.keywords.join(' · ')
                    : '—'}
                </SkillKeywords>
              </SkillItem>
            ))}
          </SkillsContainer>
        </StyledSection>
      )}

      {education?.length > 0 && (
        <StyledSection>
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
        </StyledSection>
      )}

      {projects?.length > 0 && (
        <StyledSection>
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
        </StyledSection>
      )}

      {volunteer?.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Volunteer</StyledSectionTitle>
          {volunteer.map((vol, index) => (
            <WorkItem key={index}>
              <WorkHeader>
                <Position>{vol.position}</Position>
                <CompanyLine>
                  {vol.organization && <Company>{vol.organization}</Company>}
                  {(vol.startDate || vol.endDate) && (
                    <DateText>
                      <DateRange
                        startDate={vol.startDate}
                        endDate={vol.endDate}
                      />
                    </DateText>
                  )}
                </CompanyLine>
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
        </StyledSection>
      )}

      {awards?.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Awards & Recognition</StyledSectionTitle>
          {awards.map((award, index) => (
            <EducationItem key={index}>
              <Institution>{award.title}</Institution>
              {award.awarder && <Degree>Awarded by {award.awarder}</Degree>}
              {award.date && <EducationDate>{award.date}</EducationDate>}
              {award.summary && <WorkSummary>{award.summary}</WorkSummary>}
            </EducationItem>
          ))}
        </StyledSection>
      )}

      {languages?.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Languages</StyledSectionTitle>
          <TwoColumnGrid>
            {languages.map((lang, index) => (
              <CompactItem key={index}>
                <CompactTitle>{lang.language}:</CompactTitle>{' '}
                {lang.fluency || '—'}
              </CompactItem>
            ))}
          </TwoColumnGrid>
        </StyledSection>
      )}

      {interests?.length > 0 && (
        <StyledSection>
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
        </StyledSection>
      )}

      {references?.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>References</StyledSectionTitle>
          {references.map((ref, index) => (
            <EducationItem key={index}>
              <Institution>{ref.name}</Institution>
              {ref.reference && <WorkSummary>"{ref.reference}"</WorkSummary>}
            </EducationItem>
          ))}
        </StyledSection>
      )}
    </Layout>
  );
}

export default Resume;
