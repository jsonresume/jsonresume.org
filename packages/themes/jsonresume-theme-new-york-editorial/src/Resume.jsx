import React from 'react';
import styled from 'styled-components';
import {
  Section,
  SectionTitle,
  DateRange,
  ContactInfo,
  Link,
} from '@jsonresume/core';

const Layout = styled.div`
  max-width: 680px;
  margin: 0 auto;
  padding: 80px 100px;
  background: #ffffff;
  font-family: 'Source Sans Pro', -apple-system, sans-serif;
  color: #2a2a2a;
  line-height: 1.75;

  @media print {
    padding: 60px 80px;
  }

  @media (max-width: 1024px) {
    padding: 60px 50px;
  }

  @media (max-width: 640px) {
    padding: 40px 24px;
    max-width: 100%;
  }
`;

const Header = styled.header`
  margin-bottom: 60px;
  padding-bottom: 40px;
  border-bottom: 3px solid #222222;
  text-align: center;
`;

const Name = styled.h1`
  font-size: 52px;
  font-weight: 900;
  font-family: 'Merriweather', Georgia, serif;
  color: #222222;
  margin: 0 0 16px 0;
  letter-spacing: -1px;
  line-height: 1.1;
`;

const Label = styled.p`
  font-size: 20px;
  font-weight: 400;
  font-family: 'Merriweather', Georgia, serif;
  font-style: italic;
  color: #555555;
  margin: 0 0 28px 0;
  letter-spacing: 0.3px;
`;

const StyledContactInfo = styled(ContactInfo)`
  font-size: 15px;
  color: #666666;
  margin-bottom: 28px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px 20px;

  a {
    font-size: 15px;
    color: #b22222;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;

    &:hover {
      border-bottom-color: #b22222;
    }
  }
`;

const Summary = styled.p`
  font-size: 17px;
  line-height: 1.8;
  color: #3a3a3a;
  margin: 28px 0 0 0;
  text-align: left;
  font-style: italic;
  border-left: 3px solid #b22222;
  padding-left: 20px;
`;

const StyledSection = styled(Section)`
  margin-bottom: 56px;
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-size: 28px;
  font-weight: 700;
  font-family: 'Merriweather', Georgia, serif;
  color: #222222;
  margin: 0 0 32px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e0e0e0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 80px;
    height: 2px;
    background: #b22222;
  }
`;

const WorkItem = styled.article`
  margin-bottom: 44px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const WorkHeader = styled.div`
  margin-bottom: 16px;
`;

const Position = styled.h3`
  font-size: 22px;
  font-weight: 700;
  font-family: 'Merriweather', Georgia, serif;
  color: #222222;
  margin: 0 0 8px 0;
  line-height: 1.3;
`;

const CompanyLine = styled.div`
  font-size: 17px;
  font-weight: 400;
  color: #555555;
  margin-bottom: 6px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
`;

const Company = styled.span`
  font-style: italic;
  color: #444444;
`;

const StyledDateRange = styled(DateRange)`
  font-size: 15px;
  color: #777777;
  font-variant-numeric: oldstyle-nums;
`;

const WorkSummary = styled.p`
  margin: 16px 0;
  color: #3a3a3a;
  line-height: 1.8;
  font-size: 16px;
`;

const HighlightsList = styled.ul`
  margin: 16px 0 0 0;
  padding-left: 28px;
  list-style: none;

  li {
    position: relative;
    margin-bottom: 12px;
    padding-left: 0;
    color: #3a3a3a;
    line-height: 1.75;
    font-size: 16px;

    &::before {
      content: '—';
      position: absolute;
      left: -28px;
      color: #b22222;
      font-weight: bold;
    }
  }
`;

const EducationItem = styled.article`
  margin-bottom: 36px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Degree = styled.h3`
  font-size: 20px;
  font-weight: 700;
  font-family: 'Merriweather', Georgia, serif;
  color: #222222;
  margin: 0 0 8px 0;
`;

const InstitutionLine = styled.div`
  font-size: 17px;
  color: #555555;
  margin-bottom: 6px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
`;

const Institution = styled.span`
  font-style: italic;
`;

const StudyType = styled.div`
  font-size: 15px;
  color: #777777;
  margin-top: 6px;
`;

const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
`;

const SkillGroup = styled.div`
  min-width: 200px;
  flex: 1;
`;

const SkillName = styled.h4`
  font-size: 17px;
  font-weight: 700;
  font-family: 'Merriweather', Georgia, serif;
  color: #222222;
  margin: 0 0 10px 0;
  border-bottom: 1px solid #b22222;
  padding-bottom: 6px;
  display: inline-block;
`;

const KeywordList = styled.p`
  font-size: 15px;
  color: #555555;
  line-height: 1.7;
  margin: 0;
`;

const ProjectItem = styled.article`
  margin-bottom: 40px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ProjectName = styled.h3`
  font-size: 20px;
  font-weight: 700;
  font-family: 'Merriweather', Georgia, serif;
  color: #222222;
  margin: 0 0 10px 0;
`;

const ProjectDescription = styled.p`
  font-size: 16px;
  color: #3a3a3a;
  line-height: 1.75;
  margin: 0 0 12px 0;
  font-style: italic;
`;

const ProjectHighlights = styled.ul`
  margin: 12px 0 0 0;
  padding-left: 24px;
  list-style: disc;

  li {
    margin-bottom: 8px;
    color: #444444;
    font-size: 15px;
    line-height: 1.7;
  }
`;

const SimpleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const SimpleItem = styled.div``;

const ItemTitle = styled.h4`
  font-size: 18px;
  font-weight: 700;
  font-family: 'Merriweather', Georgia, serif;
  color: #222222;
  margin: 0 0 8px 0;
`;

const ItemMeta = styled.div`
  font-size: 15px;
  color: #777777;
  margin-bottom: 8px;
  font-style: italic;
`;

const ItemDescription = styled.p`
  font-size: 15px;
  color: #444444;
  margin: 0;
  line-height: 1.7;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 48px 0;
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
                <Position>{job.position}</Position>
                <CompanyLine>
                  <Company>{job.name}</Company>
                  <StyledDateRange
                    startDate={job.startDate}
                    endDate={job.endDate}
                  />
                </CompanyLine>
              </WorkHeader>
              {job.summary && <WorkSummary>{job.summary}</WorkSummary>}
              {job.highlights && job.highlights.length > 0 && (
                <HighlightsList>
                  {job.highlights.map((highlight, i) => (
                    <li
                      key={i}
                      dangerouslySetInnerHTML={{ __html: highlight }}
                    />
                  ))}
                </HighlightsList>
              )}
            </WorkItem>
          ))}
        </StyledSection>
      )}

      {skills && skills.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Expertise</StyledSectionTitle>
          <SkillsContainer>
            {skills.map((skill, index) => (
              <SkillGroup key={index}>
                <SkillName>{skill.name}</SkillName>
                {skill.keywords && skill.keywords.length > 0 && (
                  <KeywordList>{skill.keywords.join(', ')}</KeywordList>
                )}
              </SkillGroup>
            ))}
          </SkillsContainer>
        </StyledSection>
      )}

      {education && education.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Education</StyledSectionTitle>
          {education.map((edu, index) => (
            <EducationItem key={index}>
              <Degree>{edu.area}</Degree>
              <InstitutionLine>
                <Institution>{edu.institution}</Institution>
                <StyledDateRange
                  startDate={edu.startDate}
                  endDate={edu.endDate}
                />
              </InstitutionLine>
              {edu.studyType && <StudyType>{edu.studyType}</StudyType>}
              {edu.score && <ItemMeta>GPA: {edu.score}</ItemMeta>}
            </EducationItem>
          ))}
        </StyledSection>
      )}

      {projects && projects.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Projects</StyledSectionTitle>
          {projects.map((project, index) => (
            <ProjectItem key={index}>
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

      {publications && publications.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Publications</StyledSectionTitle>
          {publications.map((pub, index) => (
            <ProjectItem key={index}>
              <ProjectName>
                {pub.url ? <Link href={pub.url}>{pub.name}</Link> : pub.name}
              </ProjectName>
              <ItemMeta>
                {pub.publisher}
                {pub.releaseDate && <> • {pub.releaseDate}</>}
              </ItemMeta>
              {pub.summary && (
                <ProjectDescription>{pub.summary}</ProjectDescription>
              )}
            </ProjectItem>
          ))}
        </StyledSection>
      )}

      {volunteer && volunteer.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Volunteer Work</StyledSectionTitle>
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
          <StyledSectionTitle>Awards & Honors</StyledSectionTitle>
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

      {languages && languages.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Languages</StyledSectionTitle>
          <SkillsContainer>
            {languages.map((lang, index) => (
              <SkillGroup key={index}>
                <SkillName>{lang.language}</SkillName>
                {lang.fluency && <KeywordList>{lang.fluency}</KeywordList>}
              </SkillGroup>
            ))}
          </SkillsContainer>
        </StyledSection>
      )}

      {interests && interests.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Interests</StyledSectionTitle>
          <SkillsContainer>
            {interests.map((interest, index) => (
              <SkillGroup key={index}>
                <SkillName>{interest.name}</SkillName>
                {interest.keywords && interest.keywords.length > 0 && (
                  <KeywordList>{interest.keywords.join(', ')}</KeywordList>
                )}
              </SkillGroup>
            ))}
          </SkillsContainer>
        </StyledSection>
      )}

      {references && references.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>References</StyledSectionTitle>
          <SimpleList>
            {references.map((ref, index) => (
              <SimpleItem key={index}>
                <ItemTitle>{ref.name}</ItemTitle>
                {ref.reference && (
                  <ItemDescription>{ref.reference}</ItemDescription>
                )}
              </SimpleItem>
            ))}
          </SimpleList>
        </StyledSection>
      )}
    </Layout>
  );
}

export default Resume;
