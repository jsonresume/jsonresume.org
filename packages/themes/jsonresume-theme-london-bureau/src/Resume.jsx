import React from 'react';
import styled from 'styled-components';
import {
  Section,
  SectionTitle,
  DateRange,
  Badge,
  BadgeList,
  ContactInfo,
  Link,
  safeUrl,
} from '@jsonresume/core';

const Layout = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 48px 40px;
  background: #faf8f5;
  font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #2a2a2a;
  line-height: 1.6;
  font-size: 10.5pt;

  @media print {
    background: white;
    padding: 30px 25px;
  }
`;

const Header = styled.header`
  border-bottom: 3px solid #2a2a2a;
  padding-bottom: 24px;
  margin-bottom: 32px;
`;

const Name = styled.h1`
  font-family: 'Crimson Text', Georgia, serif;
  font-size: 42px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #2a2a2a;
  letter-spacing: -0.5px;
  line-height: 1.1;
`;

const Tagline = styled.div`
  font-family: 'Crimson Text', Georgia, serif;
  font-size: 16px;
  color: #4a4a4a;
  margin: 0 0 16px 0;
  font-weight: 400;
  font-style: italic;
`;

const Summary = styled.p`
  font-size: 11pt;
  line-height: 1.7;
  color: #3a3a3a;
  margin: 16px 0 0 0;
  font-weight: 400;
`;

const StyledContactInfo = styled(ContactInfo)`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
  font-size: 10pt;

  a {
    color: #2a2a2a;
    text-decoration: none;
    border-bottom: 1px solid #999;
    transition: border-color 0.2s;

    &:hover {
      border-bottom-color: #2a2a2a;
    }
  }
`;

const StyledSection = styled(Section)`
  margin-bottom: 32px;
  padding-top: 20px;
  border-top: 1px solid #d4cfc7;

  &:first-of-type {
    border-top: none;
    padding-top: 0;
  }
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-family: 'Crimson Text', Georgia, serif;
  font-size: 20px;
  font-weight: 700;
  color: #2a2a2a;
  margin: 0 0 20px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const WorkItem = styled.div`
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e8e4dd;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
  gap: 16px;
`;

const ItemTitle = styled.h3`
  font-family: 'Crimson Text', Georgia, serif;
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: #2a2a2a;
  flex: 1;
`;

const ItemDate = styled.div`
  font-size: 9.5pt;
  font-weight: 400;
  color: #666;
  white-space: nowrap;
  font-style: italic;
`;

const ItemSubtitle = styled.div`
  font-size: 11pt;
  font-weight: 600;
  color: #4a4a4a;
  margin-bottom: 4px;
`;

const ItemLocation = styled.div`
  font-size: 10pt;
  color: #666;
  margin-bottom: 8px;
`;

const ItemDescription = styled.p`
  font-size: 10.5pt;
  line-height: 1.6;
  color: #3a3a3a;
  margin: 8px 0;
`;

const HighlightsList = styled.ul`
  margin: 8px 0 0 0;
  padding-left: 20px;
  list-style: disc;

  li {
    margin-bottom: 6px;
    font-size: 10.5pt;
    line-height: 1.6;
    color: #3a3a3a;

    &::marker {
      color: #666;
    }
  }
`;

const SkillsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SkillCategory = styled.div`
  h4 {
    font-family: 'Crimson Text', Georgia, serif;
    font-size: 14px;
    font-weight: 700;
    color: #2a2a2a;
    margin: 0 0 8px 0;
    text-transform: none;
  }
`;

const StyledBadgeList = styled(BadgeList)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const StyledBadge = styled(Badge)`
  font-size: 10pt;
  padding: 4px 12px;
  background: transparent;
  border: 1px solid #999;
  color: #3a3a3a;
  font-weight: 400;
  border-radius: 0;

  &:hover {
    border-color: #2a2a2a;
    background: #f5f3f0;
  }
`;

const SimpleCard = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #e8e4dd;

  h4 {
    font-family: 'Crimson Text', Georgia, serif;
    font-size: 14px;
    font-weight: 700;
    color: #2a2a2a;
    margin: 0 0 6px 0;
  }

  p {
    font-size: 10pt;
    margin: 4px 0 0 0;
    color: #4a4a4a;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const EducationItem = styled(WorkItem)``;

const ProjectItem = styled(WorkItem)``;

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
        {basics.label && <Tagline>{basics.label}</Tagline>}
        <StyledContactInfo
          email={basics.email}
          phone={basics.phone}
          url={basics.url}
          location={basics.location}
          profiles={basics.profiles}
        />
        {basics.summary && <Summary>{basics.summary}</Summary>}
      </Header>

      {work.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Experience</StyledSectionTitle>
          {work.map((job, index) => (
            <WorkItem key={index}>
              <ItemHeader>
                <ItemTitle>{job.position || job.name}</ItemTitle>
                <ItemDate>
                  <DateRange startDate={job.startDate} endDate={job.endDate} />
                </ItemDate>
              </ItemHeader>
              {job.name && <ItemSubtitle>{job.name}</ItemSubtitle>}
              {job.location && <ItemLocation>{job.location}</ItemLocation>}
              {job.summary && <ItemDescription>{job.summary}</ItemDescription>}
              {job.highlights && job.highlights.length > 0 && (
                <HighlightsList>
                  {job.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </HighlightsList>
              )}
            </WorkItem>
          ))}
        </StyledSection>
      )}

      {education.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Education</StyledSectionTitle>
          {education.map((edu, index) => (
            <EducationItem key={index}>
              <ItemHeader>
                <ItemTitle>{edu.institution}</ItemTitle>
                <ItemDate>
                  <DateRange startDate={edu.startDate} endDate={edu.endDate} />
                </ItemDate>
              </ItemHeader>
              {edu.studyType && edu.area && (
                <ItemSubtitle>
                  {edu.studyType} in {edu.area}
                </ItemSubtitle>
              )}
              {edu.score && (
                <ItemDescription>Score: {edu.score}</ItemDescription>
              )}
              {edu.courses && edu.courses.length > 0 && (
                <HighlightsList>
                  {edu.courses.map((course, i) => (
                    <li key={i}>{course}</li>
                  ))}
                </HighlightsList>
              )}
            </EducationItem>
          ))}
        </StyledSection>
      )}

      {skills.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Skills</StyledSectionTitle>
          <SkillsContainer>
            {skills.map((skill, index) => (
              <SkillCategory key={index}>
                <h4>{skill.name}</h4>
                <StyledBadgeList>
                  {skill.keywords?.map((keyword, i) => (
                    <StyledBadge key={i}>{keyword}</StyledBadge>
                  ))}
                </StyledBadgeList>
              </SkillCategory>
            ))}
          </SkillsContainer>
        </StyledSection>
      )}

      {projects.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Projects</StyledSectionTitle>
          {projects.map((project, index) => (
            <ProjectItem key={index}>
              <ItemHeader>
                <ItemTitle>
                  {project.url ? (
                    <Link href={safeUrl(project.url)}>{project.name}</Link>
                  ) : (
                    project.name
                  )}
                </ItemTitle>
                <ItemDate>
                  <DateRange
                    startDate={project.startDate}
                    endDate={project.endDate}
                  />
                </ItemDate>
              </ItemHeader>
              {project.type && <ItemLocation>{project.type}</ItemLocation>}
              {project.description && (
                <ItemDescription>{project.description}</ItemDescription>
              )}
              {project.highlights && project.highlights.length > 0 && (
                <HighlightsList>
                  {project.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </HighlightsList>
              )}
            </ProjectItem>
          ))}
        </StyledSection>
      )}

      {awards.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Awards</StyledSectionTitle>
          {awards.map((award, index) => (
            <SimpleCard key={index}>
              <h4>{award.title}</h4>
              <p>
                {award.awarder} {award.date && `• ${award.date}`}
              </p>
              {award.summary && <p>{award.summary}</p>}
            </SimpleCard>
          ))}
        </StyledSection>
      )}

      {publications.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Publications</StyledSectionTitle>
          {publications.map((pub, index) => (
            <SimpleCard key={index}>
              <h4>
                {pub.url ? (
                  <Link href={safeUrl(pub.url)}>{pub.name}</Link>
                ) : (
                  pub.name
                )}
              </h4>
              <p>
                {pub.publisher} {pub.releaseDate && `• ${pub.releaseDate}`}
              </p>
              {pub.summary && <p>{pub.summary}</p>}
            </SimpleCard>
          ))}
        </StyledSection>
      )}

      {volunteer.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Volunteer</StyledSectionTitle>
          {volunteer.map((vol, index) => (
            <WorkItem key={index}>
              <ItemHeader>
                <ItemTitle>{vol.position}</ItemTitle>
                <ItemDate>
                  <DateRange startDate={vol.startDate} endDate={vol.endDate} />
                </ItemDate>
              </ItemHeader>
              {vol.organization && (
                <ItemSubtitle>{vol.organization}</ItemSubtitle>
              )}
              {vol.summary && <ItemDescription>{vol.summary}</ItemDescription>}
              {vol.highlights && vol.highlights.length > 0 && (
                <HighlightsList>
                  {vol.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </HighlightsList>
              )}
            </WorkItem>
          ))}
        </StyledSection>
      )}

      {languages.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Languages</StyledSectionTitle>
          <StyledBadgeList>
            {languages.map((lang, index) => (
              <StyledBadge key={index}>
                {lang.language} {lang.fluency && `— ${lang.fluency}`}
              </StyledBadge>
            ))}
          </StyledBadgeList>
        </StyledSection>
      )}

      {interests.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Interests</StyledSectionTitle>
          {interests.map((interest, index) => (
            <SimpleCard key={index}>
              <h4>{interest.name}</h4>
              {interest.keywords && interest.keywords.length > 0 && (
                <p>{interest.keywords.join(', ')}</p>
              )}
            </SimpleCard>
          ))}
        </StyledSection>
      )}

      {references.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>References</StyledSectionTitle>
          {references.map((ref, index) => (
            <SimpleCard key={index}>
              <h4>{ref.name}</h4>
              {ref.reference && <p>{ref.reference}</p>}
            </SimpleCard>
          ))}
        </StyledSection>
      )}
    </Layout>
  );
}

export default Resume;
