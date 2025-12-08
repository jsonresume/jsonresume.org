import React from 'react';
import styled from 'styled-components';
import {
  Section,
  SectionTitle,
  DateRange,
  ContactInfo,
} from '@jsonresume/core';

/**
 * Marketing Narrative Resume Theme
 * Professional storytelling design with warm rose red tones, compelling narratives,
 * and strong visual hierarchy for marketing/communications professionals
 */

const Layout = styled.div`
  max-width: 950px;
  margin: 0 auto;
  padding: 0;
  background: linear-gradient(to bottom, #fff1f2 0%, #ffffff 400px);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  color: #1f2937;
  font-size: 11pt;
  line-height: 1.6;
  min-height: 100vh;

  @media print {
    background: white;
    min-height: auto;
  }
`;

const Header = styled.header`
  background: linear-gradient(135deg, #9f1239 0%, #be123c 50%, #e11d48 100%);
  color: white;
  padding: 70px 60px 90px;
  position: relative;
  clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);

  @media print {
    padding: 50px 40px 70px;
    clip-path: none;
  }
`;

const HeaderContent = styled.div`
  max-width: 850px;
  margin: 0 auto;
`;

const Name = styled.h1`
  font-size: 56px;
  font-weight: 800;
  color: white;
  margin: 0 0 16px 0;
  letter-spacing: -1px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  @media print {
    font-size: 48px;
  }
`;

const Tagline = styled.div`
  font-size: 22px;
  color: #fecdd3;
  margin-bottom: 24px;
  font-weight: 500;
  letter-spacing: 0.3px;
`;

const StyledContactInfo = styled(ContactInfo)`
  font-size: 15px;
  justify-content: flex-start;
  color: #fecdd3;

  a {
    font-size: 15px;
    color: white;
    text-decoration: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    transition: border-color 0.2s;

    &:hover {
      border-bottom-color: white;
    }
  }

  @media print {
    a {
      border-bottom: none;
    }
  }
`;

const Content = styled.div`
  padding: 60px 60px 80px;
  max-width: 850px;
  margin: 0 auto;

  @media print {
    padding: 40px;
  }
`;

const Summary = styled.div`
  font-size: 18px;
  line-height: 1.8;
  color: #374151;
  margin: 0 0 50px 0;
  padding: 35px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(159, 18, 57, 0.08);
  border-left: 5px solid #e11d48;
  position: relative;

  &::before {
    content: '"';
    position: absolute;
    top: 10px;
    left: 15px;
    font-size: 80px;
    color: #fecdd3;
    font-family: Georgia, serif;
    line-height: 1;
  }

  p {
    margin: 0;
    padding-left: 20px;
  }

  @media print {
    box-shadow: none;
    border: 1px solid #e5e7eb;
  }
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-size: 26px;
  font-weight: 700;
  color: #9f1239;
  margin: 0 0 30px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 16px;

  &::after {
    content: '';
    flex: 1;
    height: 3px;
    background: linear-gradient(to right, #e11d48, transparent);
    border-radius: 2px;
  }
`;

const WorkItem = styled.div`
  margin-bottom: 35px;
  padding-bottom: 35px;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }
`;

const WorkHeader = styled.div`
  margin-bottom: 12px;
`;

const Position = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #9f1239;
  margin: 0 0 6px 0;
`;

const CompanyMeta = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 8px;
`;

const Company = styled.div`
  font-size: 17px;
  color: #374151;
  font-weight: 600;
`;

const DateText = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;

  &::before {
    content: '•';
    margin-right: 8px;
    color: #e11d48;
  }
`;

const WorkSummary = styled.p`
  margin: 14px 0;
  color: #374151;
  line-height: 1.8;
  font-size: 15px;
  font-style: italic;
  border-left: 3px solid #fecdd3;
  padding-left: 16px;
`;

const Highlights = styled.ul`
  margin: 14px 0 0 0;
  padding-left: 20px;
  list-style-type: none;

  li {
    margin: 10px 0;
    color: #4b5563;
    line-height: 1.7;
    padding-left: 8px;
    position: relative;

    &::before {
      content: '▸';
      position: absolute;
      left: -12px;
      color: #e11d48;
      font-weight: bold;
    }
  }
`;

const EducationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
`;

const EducationCard = styled.div`
  padding: 24px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(159, 18, 57, 0.06);
  border-top: 4px solid #e11d48;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(159, 18, 57, 0.12);
    transform: translateY(-2px);
  }

  @media print {
    box-shadow: none;
    border: 1px solid #e5e7eb;
    transform: none !important;
  }
`;

const Institution = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #9f1239;
  margin: 0 0 8px 0;
`;

const Degree = styled.div`
  font-size: 16px;
  color: #374151;
  margin-bottom: 6px;
  font-weight: 600;
`;

const EducationMeta = styled.div`
  font-size: 14px;
  color: #6b7280;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Courses = styled.div`
  margin-top: 12px;
  font-size: 13px;
  color: #4b5563;
  line-height: 1.6;

  strong {
    color: #374151;
    display: block;
    margin-bottom: 4px;
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const SkillCategory = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%);
  border-radius: 10px;
  border-left: 4px solid #e11d48;
`;

const SkillName = styled.h4`
  font-size: 15px;
  font-weight: 700;
  color: #9f1239;
  margin: 0 0 10px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SkillTags = styled.div`
  font-size: 14px;
  color: #4b5563;
  line-height: 1.7;
`;

const ProjectItem = styled(WorkItem)``;

const ProjectTitle = styled(Position)`
  font-size: 18px;
`;

const ProjectMeta = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 6px;
  font-size: 14px;
  color: #6b7280;
  flex-wrap: wrap;
`;

const ProjectLink = styled.a`
  color: #e11d48;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const AwardCard = styled(EducationCard)``;

const AwardTitle = styled(Institution)`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  font-size: 17px;
`;

const SimpleList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
`;

const SimpleItem = styled.div`
  font-size: 15px;
  color: #4b5563;
  padding: 14px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(159, 18, 57, 0.05);

  strong {
    color: #9f1239;
    font-weight: 600;
    display: block;
    margin-bottom: 4px;
  }

  @media print {
    box-shadow: none;
    border: 1px solid #e5e7eb;
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
        <HeaderContent>
          <Name>{basics.name}</Name>
          {basics.label && <Tagline>{basics.label}</Tagline>}
          <StyledContactInfo basics={basics} />
        </HeaderContent>
      </Header>

      <Content>
        {basics.summary && (
          <Summary>
            <p>{basics.summary}</p>
          </Summary>
        )}

        {work?.length > 0 && (
          <Section>
            <StyledSectionTitle>Professional Experience</StyledSectionTitle>
            {work.map((job, index) => (
              <WorkItem key={index}>
                <WorkHeader>
                  <Position>{job.position}</Position>
                  <CompanyMeta>
                    {job.name && <Company>{job.name}</Company>}
                    {(job.startDate || job.endDate) && (
                      <DateText>
                        <DateRange
                          startDate={job.startDate}
                          endDate={job.endDate}
                        />
                      </DateText>
                    )}
                  </CompanyMeta>
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

        {education?.length > 0 && (
          <Section>
            <StyledSectionTitle>Education</StyledSectionTitle>
            <EducationGrid>
              {education.map((edu, index) => (
                <EducationCard key={index}>
                  <Institution>{edu.institution}</Institution>
                  <Degree>
                    {edu.studyType} in {edu.area}
                  </Degree>
                  <EducationMeta>
                    <DateText>
                      <DateRange
                        startDate={edu.startDate}
                        endDate={edu.endDate}
                      />
                    </DateText>
                    {edu.score && <span>GPA: {edu.score}</span>}
                  </EducationMeta>
                  {edu.courses?.length > 0 && (
                    <Courses>
                      <strong>Key Coursework:</strong>
                      {edu.courses.join(', ')}
                    </Courses>
                  )}
                </EducationCard>
              ))}
            </EducationGrid>
          </Section>
        )}

        {skills?.length > 0 && (
          <Section>
            <StyledSectionTitle>Core Competencies</StyledSectionTitle>
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

        {projects?.length > 0 && (
          <Section>
            <StyledSectionTitle>Featured Projects</StyledSectionTitle>
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
                      View Project →
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

        {volunteer?.length > 0 && (
          <Section>
            <StyledSectionTitle>Community Involvement</StyledSectionTitle>
            {volunteer.map((vol, index) => (
              <WorkItem key={index}>
                <WorkHeader>
                  <Position>{vol.position}</Position>
                  <CompanyMeta>
                    {vol.organization && <Company>{vol.organization}</Company>}
                    {(vol.startDate || vol.endDate) && (
                      <DateText>
                        <DateRange
                          startDate={vol.startDate}
                          endDate={vol.endDate}
                        />
                      </DateText>
                    )}
                  </CompanyMeta>
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
            <StyledSectionTitle>Recognition & Awards</StyledSectionTitle>
            <EducationGrid>
              {awards.map((award, index) => (
                <AwardCard key={index}>
                  <AwardTitle>{award.title}</AwardTitle>
                  {award.awarder && <Degree>Awarded by {award.awarder}</Degree>}
                  {award.date && <DateText>{award.date}</DateText>}
                  {award.summary && <WorkSummary>{award.summary}</WorkSummary>}
                </AwardCard>
              ))}
            </EducationGrid>
          </Section>
        )}

        {publications?.length > 0 && (
          <Section>
            <StyledSectionTitle>Publications</StyledSectionTitle>
            <EducationGrid>
              {publications.map((pub, index) => (
                <AwardCard key={index}>
                  <AwardTitle>{pub.name}</AwardTitle>
                  {pub.publisher && (
                    <Degree>Published by {pub.publisher}</Degree>
                  )}
                  {pub.releaseDate && <DateText>{pub.releaseDate}</DateText>}
                  {pub.summary && <WorkSummary>{pub.summary}</WorkSummary>}
                </AwardCard>
              ))}
            </EducationGrid>
          </Section>
        )}

        {languages?.length > 0 && (
          <Section>
            <StyledSectionTitle>Languages</StyledSectionTitle>
            <SimpleList>
              {languages.map((lang, index) => (
                <SimpleItem key={index}>
                  <strong>{lang.language}</strong>
                  {lang.fluency && <span>{lang.fluency}</span>}
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
                    <SkillTags>{interest.keywords.join(' • ')}</SkillTags>
                  )}
                </SkillCategory>
              ))}
            </SkillsGrid>
          </Section>
        )}

        {references?.length > 0 && (
          <Section>
            <StyledSectionTitle>Testimonials</StyledSectionTitle>
            {references.map((ref, index) => (
              <WorkItem key={index}>
                <AwardTitle>{ref.name}</AwardTitle>
                {ref.reference && <WorkSummary>{ref.reference}</WorkSummary>}
              </WorkItem>
            ))}
          </Section>
        )}
      </Content>
    </Layout>
  );
}

export default Resume;
