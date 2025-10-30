import React from 'react';
import styled from 'styled-components';
import {
  Section,
  SectionTitle,
  ListItem,
  DateRange,
  ContactInfo,
  Link,
  safeUrl,
  isExternalUrl,
} from '@resume/core';

const ResumeContainer = styled.div`
  max-width: 850px;
  margin: 0 auto;
  padding: 80px 60px;
  background: #f8f8f8;
  font-family: 'Roboto Condensed', 'Arial Narrow', 'Helvetica Neue', sans-serif;
  color: #000000;
  line-height: 1.6;
  letter-spacing: -0.3px;

  @media print {
    padding: 40px 30px;
    max-width: 100%;
    background: white;
  }
`;

const Header = styled.header`
  margin-bottom: 60px;
  padding-bottom: 40px;
  border-bottom: 1px solid #ffffff;
`;

const Name = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  color: #000000;
  margin: 0 0 12px 0;
  letter-spacing: -2px;
  line-height: 0.9;
  text-transform: uppercase;
`;

const Label = styled.p`
  font-size: 1.125rem;
  font-weight: 400;
  color: #000000;
  margin: 0 0 24px 0;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const Summary = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: #1a1a1a;
  margin: 24px 0 0 0;
  font-weight: 300;
  max-width: 700px;
`;

const StyledContactInfo = styled(ContactInfo)`
  font-size: 0.875rem;
  color: #333333;
  letter-spacing: -0.2px;

  a {
    color: #000000;
    text-decoration: none;
    border-bottom: 1px solid #000000;

    &:hover {
      border-bottom: 2px solid #000000;
    }
  }
`;

const ContentSection = styled.div`
  margin-bottom: 50px;
  padding-bottom: 40px;
  border-bottom: 1px solid #ffffff;

  &:last-child {
    margin-bottom: 0;
    border-bottom: none;
  }
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-size: 0.9375rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #000000;
  margin: 0 0 30px 0;
`;

const ExperienceItem = styled.div`
  margin-bottom: 35px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ExperienceHeader = styled.div`
  margin-bottom: 12px;
`;

const Position = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #000000;
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;
`;

const Company = styled.div`
  font-size: 1rem;
  color: #1a1a1a;
  font-weight: 500;
  margin-bottom: 6px;
  letter-spacing: -0.2px;
`;

const StyledDateRange = styled(DateRange)`
  font-size: 0.8125rem;
  color: #666666;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Description = styled.p`
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #1a1a1a;
  margin: 12px 0 16px 0;
  font-weight: 300;
`;

const Highlights = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Highlight = styled.li`
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #1a1a1a;
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;
  font-weight: 300;

  &:before {
    content: '—';
    position: absolute;
    left: 0;
    color: #000000;
    font-weight: 700;
  }
`;

const EducationItem = styled.div`
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Institution = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #000000;
  margin: 0 0 6px 0;
  letter-spacing: -0.3px;
`;

const Degree = styled.div`
  font-size: 1rem;
  color: #1a1a1a;
  font-weight: 400;
  margin-bottom: 6px;
  letter-spacing: -0.2px;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
`;

const SkillCategory = styled.div`
  padding: 0;
`;

const SkillName = styled.h4`
  font-size: 0.875rem;
  font-weight: 700;
  color: #000000;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const SkillKeywords = styled.div`
  font-size: 0.875rem;
  line-height: 1.5;
  color: #333333;
  font-weight: 300;
`;

const ProjectItem = styled.div`
  margin-bottom: 35px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ProjectName = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #000000;
  margin: 0 0 6px 0;
  letter-spacing: -0.3px;
`;

const ProjectUrl = styled.div`
  font-size: 0.875rem;
  margin-bottom: 8px;

  a {
    color: #000000;
    text-decoration: none;
    border-bottom: 1px solid #000000;

    &:hover {
      border-bottom: 2px solid #000000;
    }
  }
`;

const AwardItem = styled.div`
  margin-bottom: 25px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const AwardTitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: #000000;
  margin: 0 0 6px 0;
  letter-spacing: -0.2px;
`;

const Awarder = styled.div`
  font-size: 0.9375rem;
  color: #1a1a1a;
  font-weight: 400;
  margin-bottom: 6px;
`;

const LanguageList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const LanguageItem = styled.div`
  font-size: 0.9375rem;
`;

const LanguageName = styled.span`
  font-weight: 700;
  color: #000000;
  letter-spacing: -0.2px;
`;

const LanguageFluency = styled.span`
  color: #666666;
  font-weight: 300;
  margin-left: 8px;
`;

const InterestsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const InterestTag = styled.span`
  display: inline-block;
  padding: 8px 16px;
  background: #000000;
  color: #ffffff;
  font-size: 0.8125rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

function Resume({ resume }) {
  const {
    basics,
    work,
    education,
    skills,
    volunteer,
    awards,
    publications,
    languages,
    interests,
    projects,
    references,
  } = resume;

  return (
    <ResumeContainer>
      <Header>
        {basics && (
          <>
            {basics.name && <Name>{basics.name}</Name>}
            {basics.label && <Label>{basics.label}</Label>}
            <StyledContactInfo basics={basics} />
            {basics.summary && <Summary>{basics.summary}</Summary>}
          </>
        )}
      </Header>

      {/* Work Experience */}
      {work && work.length > 0 && (
        <ContentSection>
          <StyledSectionTitle>Experience</StyledSectionTitle>
          {work.map((job, index) => (
            <ExperienceItem key={index}>
              <ExperienceHeader>
                {job.position && <Position>{job.position}</Position>}
                {job.name && <Company>{job.name}</Company>}
                <StyledDateRange
                  startDate={job.startDate}
                  endDate={job.endDate}
                />
              </ExperienceHeader>

              {job.summary && <Description>{job.summary}</Description>}

              {job.highlights && job.highlights.length > 0 && (
                <Highlights>
                  {job.highlights.map((highlight, i) => (
                    <Highlight key={i}>{highlight}</Highlight>
                  ))}
                </Highlights>
              )}
            </ExperienceItem>
          ))}
        </ContentSection>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <ContentSection>
          <StyledSectionTitle>Education</StyledSectionTitle>
          {education.map((edu, index) => (
            <EducationItem key={index}>
              {edu.institution && <Institution>{edu.institution}</Institution>}
              {edu.studyType && edu.area && (
                <Degree>
                  {edu.studyType} in {edu.area}
                </Degree>
              )}
              <StyledDateRange
                startDate={edu.startDate}
                endDate={edu.endDate}
              />
              {edu.score && <Description>GPA: {edu.score}</Description>}
            </EducationItem>
          ))}
        </ContentSection>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <ContentSection>
          <StyledSectionTitle>Skills</StyledSectionTitle>
          <SkillsGrid>
            {skills.map((skill, index) => (
              <SkillCategory key={index}>
                {skill.name && <SkillName>{skill.name}</SkillName>}
                {skill.keywords && skill.keywords.length > 0 && (
                  <SkillKeywords>{skill.keywords.join(', ')}</SkillKeywords>
                )}
              </SkillCategory>
            ))}
          </SkillsGrid>
        </ContentSection>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <ContentSection>
          <StyledSectionTitle>Projects</StyledSectionTitle>
          {projects.map((project, index) => (
            <ProjectItem key={index}>
              {project.name && <ProjectName>{project.name}</ProjectName>}
              {project.url && (
                <ProjectUrl>
                  <Link
                    href={safeUrl(project.url)}
                    target={isExternalUrl(project.url) ? '_blank' : undefined}
                  >
                    {project.url.replace(/^https?:\/\//, '')}
                  </Link>
                </ProjectUrl>
              )}
              <StyledDateRange
                startDate={project.startDate}
                endDate={project.endDate}
              />
              {project.description && (
                <Description>{project.description}</Description>
              )}
              {project.highlights && project.highlights.length > 0 && (
                <Highlights>
                  {project.highlights.map((highlight, i) => (
                    <Highlight key={i}>{highlight}</Highlight>
                  ))}
                </Highlights>
              )}
            </ProjectItem>
          ))}
        </ContentSection>
      )}

      {/* Volunteer */}
      {volunteer && volunteer.length > 0 && (
        <ContentSection>
          <StyledSectionTitle>Volunteer</StyledSectionTitle>
          {volunteer.map((vol, index) => (
            <ExperienceItem key={index}>
              <ExperienceHeader>
                {vol.position && <Position>{vol.position}</Position>}
                {vol.organization && <Company>{vol.organization}</Company>}
                <StyledDateRange
                  startDate={vol.startDate}
                  endDate={vol.endDate}
                />
              </ExperienceHeader>
              {vol.summary && <Description>{vol.summary}</Description>}
              {vol.highlights && vol.highlights.length > 0 && (
                <Highlights>
                  {vol.highlights.map((highlight, i) => (
                    <Highlight key={i}>{highlight}</Highlight>
                  ))}
                </Highlights>
              )}
            </ExperienceItem>
          ))}
        </ContentSection>
      )}

      {/* Awards */}
      {awards && awards.length > 0 && (
        <ContentSection>
          <StyledSectionTitle>Awards</StyledSectionTitle>
          {awards.map((award, index) => (
            <AwardItem key={index}>
              {award.title && <AwardTitle>{award.title}</AwardTitle>}
              {award.awarder && <Awarder>{award.awarder}</Awarder>}
              {award.date && <StyledDateRange startDate={award.date} />}
              {award.summary && <Description>{award.summary}</Description>}
            </AwardItem>
          ))}
        </ContentSection>
      )}

      {/* Publications */}
      {publications && publications.length > 0 && (
        <ContentSection>
          <StyledSectionTitle>Publications</StyledSectionTitle>
          {publications.map((pub, index) => (
            <AwardItem key={index}>
              {pub.name && <AwardTitle>{pub.name}</AwardTitle>}
              {pub.publisher && <Awarder>{pub.publisher}</Awarder>}
              {pub.releaseDate && (
                <StyledDateRange startDate={pub.releaseDate} />
              )}
              {pub.summary && <Description>{pub.summary}</Description>}
              {pub.url && (
                <ProjectUrl>
                  <Link
                    href={safeUrl(pub.url)}
                    target={isExternalUrl(pub.url) ? '_blank' : undefined}
                  >
                    {pub.url.replace(/^https?:\/\//, '')}
                  </Link>
                </ProjectUrl>
              )}
            </AwardItem>
          ))}
        </ContentSection>
      )}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <ContentSection>
          <StyledSectionTitle>Languages</StyledSectionTitle>
          <LanguageList>
            {languages.map((language, index) => (
              <LanguageItem key={index}>
                <LanguageName>{language.language}</LanguageName>
                {language.fluency && (
                  <LanguageFluency>— {language.fluency}</LanguageFluency>
                )}
              </LanguageItem>
            ))}
          </LanguageList>
        </ContentSection>
      )}

      {/* Interests */}
      {interests && interests.length > 0 && (
        <ContentSection>
          <StyledSectionTitle>Interests</StyledSectionTitle>
          <InterestsList>
            {interests.map((interest, index) => (
              <InterestTag key={index}>{interest.name}</InterestTag>
            ))}
          </InterestsList>
        </ContentSection>
      )}

      {/* References */}
      {references && references.length > 0 && (
        <ContentSection>
          <StyledSectionTitle>References</StyledSectionTitle>
          {references.map((ref, index) => (
            <AwardItem key={index}>
              {ref.name && <AwardTitle>{ref.name}</AwardTitle>}
              {ref.reference && <Description>{ref.reference}</Description>}
            </AwardItem>
          ))}
        </ContentSection>
      )}
    </ResumeContainer>
  );
}

export default Resume;
