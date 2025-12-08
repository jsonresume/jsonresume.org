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
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 60px;
  background: #ffffff;
  font-family: 'Lato', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #2c3e50;
  line-height: 1.8;

  @media print {
    padding: 40px 30px;
    max-width: 100%;
  }
`;

const Header = styled.header`
  margin-bottom: 60px;
  border-bottom: 1px solid #ecf0f1;
  padding-bottom: 40px;
`;

const Name = styled.h1`
  font-size: 3rem;
  font-weight: 300;
  color: #2c3e50;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
`;

const Title = styled.p`
  font-size: 1.25rem;
  font-weight: 300;
  color: #7f8c8d;
  margin: 0 0 20px 0;
`;

const Summary = styled.p`
  font-size: 1rem;
  line-height: 1.9;
  color: #34495e;
  margin: 20px 0 0 0;
  font-weight: 300;
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 60px;

  @media print {
    gap: 40px;
  }
`;

const Sidebar = styled.aside`
  padding-right: 20px;
  border-right: 1px solid #ecf0f1;
`;

const MainContent = styled.main`
  min-width: 0;
`;

const StyledSection = styled(Section)`
  margin-bottom: 50px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #4682b4;
  margin: 0 0 24px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #4682b4;
`;

const ExperienceItem = styled.div`
  margin-bottom: 40px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ExperienceHeader = styled.div`
  margin-bottom: 12px;
`;

const Position = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  color: #2c3e50;
  margin: 0 0 4px 0;
`;

const Company = styled.div`
  font-size: 1rem;
  color: #4682b4;
  font-weight: 400;
  margin-bottom: 4px;
`;

const StyledDateRange = styled(DateRange)`
  font-size: 0.875rem;
  color: #95a5a6;
  font-weight: 300;
`;

const Description = styled.p`
  font-size: 0.9375rem;
  line-height: 1.8;
  color: #34495e;
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
  line-height: 1.7;
  color: #34495e;
  margin-bottom: 8px;
  padding-left: 16px;
  position: relative;
  font-weight: 300;

  &:before {
    content: '•';
    position: absolute;
    left: 0;
    color: #4682b4;
    font-weight: 700;
  }
`;

const EducationItem = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Institution = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: #2c3e50;
  margin: 0 0 4px 0;
`;

const Degree = styled.div`
  font-size: 0.9375rem;
  color: #7f8c8d;
  font-weight: 300;
  margin-bottom: 4px;
`;

const SkillCategory = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SkillName = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SkillKeywords = styled.div`
  font-size: 0.875rem;
  line-height: 1.6;
  color: #34495e;
  font-weight: 300;
`;

const ContactItem = styled.div`
  margin-bottom: 16px;
  font-size: 0.875rem;
  color: #34495e;
  font-weight: 300;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ContactLabel = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #95a5a6;
  margin-bottom: 4px;
  font-weight: 600;
`;

const ContactValue = styled.div`
  color: #2c3e50;
  word-break: break-word;
`;

const InterestsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const InterestTag = styled.span`
  display: inline-block;
  padding: 4px 12px;
  background: #ecf0f1;
  color: #34495e;
  border-radius: 12px;
  font-size: 0.8125rem;
  font-weight: 400;
`;

const LanguageItem = styled.div`
  margin-bottom: 16px;
  font-size: 0.875rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const LanguageName = styled.span`
  font-weight: 500;
  color: #2c3e50;
`;

const LanguageFluency = styled.span`
  color: #7f8c8d;
  font-weight: 300;
  margin-left: 8px;
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
  } = resume;

  return (
    <ResumeContainer>
      <Header>
        {basics && (
          <>
            {basics.name && <Name>{basics.name}</Name>}
            {basics.label && <Title>{basics.label}</Title>}
            {basics.summary && <Summary>{basics.summary}</Summary>}
          </>
        )}
      </Header>

      <TwoColumnLayout>
        <Sidebar>
          {/* Contact Information */}
          {basics && (
            <StyledSection>
              <StyledSectionTitle>Contact</StyledSectionTitle>

              {basics.email && (
                <ContactItem>
                  <ContactLabel>Email</ContactLabel>
                  <ContactValue>
                    <Link href={`mailto:${basics.email}`}>{basics.email}</Link>
                  </ContactValue>
                </ContactItem>
              )}

              {basics.phone && (
                <ContactItem>
                  <ContactLabel>Phone</ContactLabel>
                  <ContactValue>{basics.phone}</ContactValue>
                </ContactItem>
              )}

              {basics.location && (
                <ContactItem>
                  <ContactLabel>Location</ContactLabel>
                  <ContactValue>
                    {[
                      basics.location.city,
                      basics.location.region,
                      basics.location.countryCode,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </ContactValue>
                </ContactItem>
              )}

              {basics.url && (
                <ContactItem>
                  <ContactLabel>Website</ContactLabel>
                  <ContactValue>
                    <Link
                      href={safeUrl(basics.url)}
                      target={isExternalUrl(basics.url) ? '_blank' : undefined}
                    >
                      {basics.url.replace(/^https?:\/\//, '')}
                    </Link>
                  </ContactValue>
                </ContactItem>
              )}

              {basics.profiles &&
                basics.profiles.length > 0 &&
                basics.profiles.map((profile, index) => (
                  <ContactItem key={index}>
                    <ContactLabel>{profile.network}</ContactLabel>
                    <ContactValue>
                      <Link
                        href={safeUrl(profile.url)}
                        target={
                          isExternalUrl(profile.url) ? '_blank' : undefined
                        }
                      >
                        {profile.username ||
                          profile.url.replace(/^https?:\/\//, '')}
                      </Link>
                    </ContactValue>
                  </ContactItem>
                ))}
            </StyledSection>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <StyledSection>
              <StyledSectionTitle>Skills</StyledSectionTitle>
              {skills.map((skill, index) => (
                <SkillCategory key={index}>
                  {skill.name && <SkillName>{skill.name}</SkillName>}
                  {skill.keywords && skill.keywords.length > 0 && (
                    <SkillKeywords>{skill.keywords.join(' • ')}</SkillKeywords>
                  )}
                </SkillCategory>
              ))}
            </StyledSection>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <StyledSection>
              <StyledSectionTitle>Languages</StyledSectionTitle>
              {languages.map((language, index) => (
                <LanguageItem key={index}>
                  <LanguageName>{language.language}</LanguageName>
                  {language.fluency && (
                    <LanguageFluency>({language.fluency})</LanguageFluency>
                  )}
                </LanguageItem>
              ))}
            </StyledSection>
          )}

          {/* Interests */}
          {interests && interests.length > 0 && (
            <StyledSection>
              <StyledSectionTitle>Interests</StyledSectionTitle>
              <InterestsList>
                {interests.map((interest, index) => (
                  <InterestTag key={index}>{interest.name}</InterestTag>
                ))}
              </InterestsList>
            </StyledSection>
          )}
        </Sidebar>

        <MainContent>
          {/* Work Experience */}
          {work && work.length > 0 && (
            <StyledSection>
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
            </StyledSection>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <StyledSection>
              <StyledSectionTitle>Education</StyledSectionTitle>
              {education.map((edu, index) => (
                <EducationItem key={index}>
                  {edu.institution && (
                    <Institution>{edu.institution}</Institution>
                  )}
                  {edu.studyType && edu.area && (
                    <Degree>
                      {edu.studyType} in {edu.area}
                    </Degree>
                  )}
                  <StyledDateRange
                    startDate={edu.startDate}
                    endDate={edu.endDate}
                  />
                </EducationItem>
              ))}
            </StyledSection>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <StyledSection>
              <StyledSectionTitle>Projects</StyledSectionTitle>
              {projects.map((project, index) => (
                <ExperienceItem key={index}>
                  <ExperienceHeader>
                    {project.name && <Position>{project.name}</Position>}
                    {project.url && (
                      <Company>
                        <Link
                          href={safeUrl(project.url)}
                          target={
                            isExternalUrl(project.url) ? '_blank' : undefined
                          }
                        >
                          {project.url.replace(/^https?:\/\//, '')}
                        </Link>
                      </Company>
                    )}
                    <StyledDateRange
                      startDate={project.startDate}
                      endDate={project.endDate}
                    />
                  </ExperienceHeader>

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
                </ExperienceItem>
              ))}
            </StyledSection>
          )}

          {/* Awards */}
          {awards && awards.length > 0 && (
            <StyledSection>
              <StyledSectionTitle>Awards</StyledSectionTitle>
              {awards.map((award, index) => (
                <EducationItem key={index}>
                  {award.title && <Institution>{award.title}</Institution>}
                  {award.awarder && <Degree>{award.awarder}</Degree>}
                  {award.date && <StyledDateRange startDate={award.date} />}
                  {award.summary && <Description>{award.summary}</Description>}
                </EducationItem>
              ))}
            </StyledSection>
          )}
        </MainContent>
      </TwoColumnLayout>
    </ResumeContainer>
  );
}

export default Resume;
