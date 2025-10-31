import React from 'react';
import styled from 'styled-components';
import {
  Section,
  SectionTitle,
  DateRange,
  ContactInfo,
  Link,
  Badge,
  BadgeList,
} from '@resume/core';

const Layout = styled.div`
  max-width: 850px;
  margin: 0 auto;
  padding: 60px 40px;
  background: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  color: #1f2937;
  line-height: 1.6;

  @media print {
    padding: 40px;
    background: white;
  }

  @media (max-width: 640px) {
    padding: 40px 20px;
  }
`;

const Header = styled.header`
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 2px solid #e9d5ff;
`;

const Name = styled.h1`
  font-size: 42px;
  font-weight: 800;
  color: #111827;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
`;

const Label = styled.p`
  font-size: 18px;
  font-weight: 500;
  color: #7c3aed;
  margin: 0 0 20px 0;
`;

const StyledContactInfo = styled(ContactInfo)`
  font-size: 15px;
  color: #6b7280;
  margin-bottom: 24px;

  a {
    font-size: 15px;
    color: #7c3aed;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Summary = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: #374151;
  margin: 24px 0 0 0;
`;

const StyledSection = styled(Section)`
  margin-bottom: 48px;
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  margin: 0 0 24px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  padding-bottom: 12px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background: #7c3aed;
  }
`;

const WorkItem = styled.div`
  margin-bottom: 40px;
  padding: 24px;
  background: #faf5ff;
  border-left: 6px solid #7c3aed;
  border-radius: 4px;

  &:last-child {
    margin-bottom: 0;
  }

  @media print {
    background: white;
    border: 1px solid #e9d5ff;
    border-left: 6px solid #7c3aed;
  }
`;

const WorkHeader = styled.div`
  margin-bottom: 16px;
`;

const WorkTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
`;

const Position = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const Company = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #7c3aed;
  margin-top: 4px;
`;

const StyledDateRange = styled(DateRange)`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
`;

const WorkSummary = styled.p`
  margin: 14px 0;
  color: #374151;
  line-height: 1.8;
  font-size: 15px;
`;

const ImpactLabel = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: #7c3aed;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin: 16px 0 8px 0;
`;

const HighlightsList = styled.ul`
  margin: 0;
  padding-left: 20px;
  list-style: none;

  li {
    position: relative;
    margin-bottom: 8px;
    padding-left: 0;
    color: #374151;
    line-height: 1.7;

    &::before {
      content: '▸';
      position: absolute;
      left: -20px;
      color: #7c3aed;
      font-weight: bold;
    }

    strong {
      color: #7c3aed;
      font-weight: 700;
    }
  }
`;

const EducationItem = styled.div`
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }
`;

const EducationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
`;

const Degree = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const Institution = styled.div`
  font-size: 16px;
  color: #6b7280;
  font-weight: 500;
  margin-top: 4px;
`;

const StudyType = styled.div`
  font-size: 15px;
  color: #7c3aed;
  font-weight: 500;
  margin-top: 4px;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const SkillCard = styled.div`
  background: white;
  border: 2px solid #e9d5ff;
  border-radius: 6px;
  padding: 18px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #7c3aed;
    box-shadow: 0 2px 8px rgba(124, 58, 237, 0.1);
  }

  @media print {
    break-inside: avoid;
  }
`;

const SkillName = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 12px 0;
`;

const KeywordList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Keyword = styled.span`
  font-size: 13px;
  color: #7c3aed;
  background: #faf5ff;
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: 500;
`;

const ProjectItem = styled.div`
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }
`;

const ProjectHeader = styled.div`
  margin-bottom: 12px;
`;

const ProjectName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
`;

const ProjectDescription = styled.p`
  font-size: 15px;
  color: #374151;
  line-height: 1.7;
  margin: 0;
`;

const ProjectHighlights = styled.ul`
  margin: 12px 0 0 0;
  padding-left: 20px;
  list-style: none;

  li {
    position: relative;
    margin-bottom: 6px;
    padding-left: 0;
    color: #4b5563;
    font-size: 14px;

    &::before {
      content: '•';
      position: absolute;
      left: -20px;
      color: #7c3aed;
      font-weight: bold;
    }
  }
`;

const SimpleList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const SimpleItem = styled.div`
  padding: 16px;
  background: #f9fafb;
  border-left: 3px solid #7c3aed;
  border-radius: 4px;
`;

const ItemTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
`;

const ItemMeta = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 6px;
`;

const ItemDescription = styled.p`
  font-size: 14px;
  color: #4b5563;
  margin: 8px 0 0 0;
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
      <Header>
        <Name>{basics.name}</Name>
        {basics.label && <Label>{basics.label}</Label>}
        <StyledContactInfo basics={basics} />
        {basics.summary && <Summary>{basics.summary}</Summary>}
      </Header>

      {work && work.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Experience</StyledSectionTitle>
          {work.map((job, index) => (
            <WorkItem key={index}>
              <WorkHeader>
                <WorkTitle>
                  <div>
                    <Position>{job.position}</Position>
                    <Company>{job.name}</Company>
                  </div>
                  <StyledDateRange
                    startDate={job.startDate}
                    endDate={job.endDate}
                  />
                </WorkTitle>
              </WorkHeader>
              {job.summary && <WorkSummary>{job.summary}</WorkSummary>}
              {job.highlights && job.highlights.length > 0 && (
                <>
                  <ImpactLabel>Impact & Achievements</ImpactLabel>
                  <HighlightsList>
                    {job.highlights.map((highlight, i) => (
                      <li
                        key={i}
                        dangerouslySetInnerHTML={{ __html: highlight }}
                      />
                    ))}
                  </HighlightsList>
                </>
              )}
            </WorkItem>
          ))}
        </StyledSection>
      )}

      {skills && skills.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Skills</StyledSectionTitle>
          <SkillsGrid>
            {skills.map((skill, index) => (
              <SkillCard key={index}>
                <SkillName>{skill.name}</SkillName>
                {skill.keywords && skill.keywords.length > 0 && (
                  <KeywordList>
                    {skill.keywords.map((keyword, i) => (
                      <Keyword key={i}>{keyword}</Keyword>
                    ))}
                  </KeywordList>
                )}
              </SkillCard>
            ))}
          </SkillsGrid>
        </StyledSection>
      )}

      {education && education.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Education</StyledSectionTitle>
          {education.map((edu, index) => (
            <EducationItem key={index}>
              <EducationHeader>
                <div>
                  <Degree>{edu.area}</Degree>
                  {edu.studyType && <StudyType>{edu.studyType}</StudyType>}
                  <Institution>{edu.institution}</Institution>
                </div>
                <StyledDateRange
                  startDate={edu.startDate}
                  endDate={edu.endDate}
                />
              </EducationHeader>
              {edu.score && <ItemMeta>GPA: {edu.score}</ItemMeta>}
              {edu.courses && edu.courses.length > 0 && (
                <ItemDescription>
                  Relevant coursework: {edu.courses.join(', ')}
                </ItemDescription>
              )}
            </EducationItem>
          ))}
        </StyledSection>
      )}

      {projects && projects.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Projects</StyledSectionTitle>
          {projects.map((project, index) => (
            <ProjectItem key={index}>
              <ProjectHeader>
                <ProjectName>
                  {project.url ? (
                    <Link href={project.url}>{project.name}</Link>
                  ) : (
                    project.name
                  )}
                </ProjectName>
                {project.description && (
                  <ProjectDescription>{project.description}</ProjectDescription>
                )}
              </ProjectHeader>
              {project.highlights && project.highlights.length > 0 && (
                <ProjectHighlights>
                  {project.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ProjectHighlights>
              )}
            </ProjectItem>
          ))}
        </StyledSection>
      )}

      {volunteer && volunteer.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Volunteer</StyledSectionTitle>
          <SimpleList>
            {volunteer.map((vol, index) => (
              <SimpleItem key={index}>
                <ItemTitle>{vol.position}</ItemTitle>
                <ItemMeta>
                  {vol.organization}
                  {vol.startDate && (
                    <>
                      {' • '}
                      <DateRange
                        startDate={vol.startDate}
                        endDate={vol.endDate}
                      />
                    </>
                  )}
                </ItemMeta>
                {vol.summary && (
                  <ItemDescription>{vol.summary}</ItemDescription>
                )}
              </SimpleItem>
            ))}
          </SimpleList>
        </StyledSection>
      )}

      {awards && awards.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Awards</StyledSectionTitle>
          <SimpleList>
            {awards.map((award, index) => (
              <SimpleItem key={index}>
                <ItemTitle>{award.title}</ItemTitle>
                <ItemMeta>
                  {award.awarder}
                  {award.date && <> • {award.date}</>}
                </ItemMeta>
                {award.summary && (
                  <ItemDescription>{award.summary}</ItemDescription>
                )}
              </SimpleItem>
            ))}
          </SimpleList>
        </StyledSection>
      )}

      {publications && publications.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Publications</StyledSectionTitle>
          {publications.map((pub, index) => (
            <ProjectItem key={index}>
              <ProjectHeader>
                <ProjectName>
                  {pub.url ? <Link href={pub.url}>{pub.name}</Link> : pub.name}
                </ProjectName>
                <ItemMeta>
                  {pub.publisher}
                  {pub.releaseDate && <> • {pub.releaseDate}</>}
                </ItemMeta>
              </ProjectHeader>
              {pub.summary && (
                <ProjectDescription>{pub.summary}</ProjectDescription>
              )}
            </ProjectItem>
          ))}
        </StyledSection>
      )}

      {languages && languages.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Languages</StyledSectionTitle>
          <SimpleList>
            {languages.map((lang, index) => (
              <SimpleItem key={index}>
                <ItemTitle>{lang.language}</ItemTitle>
                {lang.fluency && <ItemMeta>{lang.fluency}</ItemMeta>}
              </SimpleItem>
            ))}
          </SimpleList>
        </StyledSection>
      )}

      {interests && interests.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Interests</StyledSectionTitle>
          <SimpleList>
            {interests.map((interest, index) => (
              <SimpleItem key={index}>
                <ItemTitle>{interest.name}</ItemTitle>
                {interest.keywords && interest.keywords.length > 0 && (
                  <ItemDescription>
                    {interest.keywords.join(', ')}
                  </ItemDescription>
                )}
              </SimpleItem>
            ))}
          </SimpleList>
        </StyledSection>
      )}

      {references && references.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>References</StyledSectionTitle>
          {references.map((ref, index) => (
            <ProjectItem key={index}>
              <ItemTitle>{ref.name}</ItemTitle>
              {ref.reference && (
                <ItemDescription>{ref.reference}</ItemDescription>
              )}
            </ProjectItem>
          ))}
        </StyledSection>
      )}
    </Layout>
  );
}

export default Resume;
