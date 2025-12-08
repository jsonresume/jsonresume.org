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
} from '@jsonresume/core';

const ResumeContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 50px;
  font-family: 'Roboto Mono', 'SF Mono', 'Monaco', 'Courier New', monospace;
  color: #1f2937;
  line-height: 1.7;
  min-height: 100vh;

  @media print {
    padding: 40px 30px;
    max-width: 100%;
  }
`;

const Header = styled.header`
  margin-bottom: 50px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid #374151;
  position: relative;
`;

const Name = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  text-transform: uppercase;
`;

const Label = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
  margin: 0 0 20px 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const Summary = styled.p`
  font-size: 0.9375rem;
  line-height: 1.8;
  color: #374151;
  margin: 20px 0 0 0;
  font-weight: 400;
`;

const StyledContactInfo = styled(ContactInfo)`
  font-size: 0.875rem;
  color: #4b5563;

  a {
    color: #374151;
    text-decoration: underline;
    font-weight: 500;

    &:hover {
      color: #111827;
    }
  }
`;

const ContentSection = styled.div`
  margin-bottom: 50px;
  padding: 25px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #d1d5db;

  &:last-child {
    margin-bottom: 0;
  }
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #111827;
  margin: 0 0 20px 0;
  padding-bottom: 8px;
  border-bottom: 3px solid #374151;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const ExperienceItem = styled.div`
  margin-bottom: 30px;
  padding-left: 20px;
  border-left: 3px solid #9ca3af;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ExperienceHeader = styled.div`
  margin-bottom: 10px;
`;

const Position = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const Company = styled.div`
  font-size: 0.9375rem;
  color: #374151;
  font-weight: 600;
  margin-bottom: 4px;
`;

const StyledDateRange = styled(DateRange)`
  font-size: 0.8125rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Description = styled.p`
  font-size: 0.875rem;
  line-height: 1.7;
  color: #374151;
  margin: 10px 0 12px 0;
`;

const Highlights = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Highlight = styled.li`
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
  margin-bottom: 6px;
  padding-left: 16px;
  position: relative;

  &:before {
    content: '▸';
    position: absolute;
    left: 0;
    color: #374151;
    font-weight: 700;
  }
`;

const EducationItem = styled.div`
  margin-bottom: 25px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Institution = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const Degree = styled.div`
  font-size: 0.9375rem;
  color: #374151;
  font-weight: 500;
  margin-bottom: 4px;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
`;

const SkillCategory = styled.div`
  padding: 12px;
  background: #f9fafb;
  border: 2px solid #d1d5db;
`;

const SkillName = styled.h4`
  font-size: 0.8125rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 6px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const SkillKeywords = styled.div`
  font-size: 0.8125rem;
  line-height: 1.5;
  color: #4b5563;
`;

const ProjectItem = styled.div`
  margin-bottom: 30px;
  padding: 15px;
  border: 2px dashed #d1d5db;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ProjectName = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const ProjectUrl = styled.div`
  font-size: 0.875rem;
  margin-bottom: 8px;

  a {
    color: #374151;
    text-decoration: underline;

    &:hover {
      color: #111827;
    }
  }
`;

const AwardItem = styled.div`
  margin-bottom: 20px;
  padding-left: 15px;
  border-left: 2px solid #d1d5db;

  &:last-child {
    margin-bottom: 0;
  }
`;

const AwardTitle = styled.h4`
  font-size: 0.9375rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const Awarder = styled.div`
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
`;

const LanguageList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
`;

const LanguageItem = styled.div`
  font-size: 0.875rem;
  padding: 8px 12px;
  background: #f3f4f6;
  border-left: 3px solid #9ca3af;
`;

const LanguageName = styled.span`
  font-weight: 700;
  color: #111827;
`;

const LanguageFluency = styled.span`
  color: #6b7280;
  font-weight: 400;
  margin-left: 6px;
`;

const InterestsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const InterestTag = styled.span`
  display: inline-block;
  padding: 6px 14px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  font-size: 0.8125rem;
  font-weight: 600;
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
                  <LanguageFluency>- {language.fluency}</LanguageFluency>
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
