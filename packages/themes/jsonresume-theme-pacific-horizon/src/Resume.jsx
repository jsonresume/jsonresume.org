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
  max-width: 900px;
  margin: 0 auto;
  padding: 64px 48px;
  background: white;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  color: #111827;
  line-height: 1.7;
  font-size: 15px;

  @media print {
    padding: 40px 30px;
  }
`;

const Header = styled.header`
  margin-bottom: 48px;
  text-align: center;
`;

const Name = styled.h1`
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #111827;
  letter-spacing: -1px;
  line-height: 1.1;
`;

const Tagline = styled.div`
  font-size: 20px;
  color: #2563eb;
  margin: 0 0 24px 0;
  font-weight: 500;
`;

const Summary = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: #4b5563;
  margin: 24px auto 0 auto;
  max-width: 700px;
`;

const StyledContactInfo = styled(ContactInfo)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  margin-top: 24px;

  a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;
    font-size: 14px;
    transition: color 0.2s;

    &:hover {
      color: #1d4ed8;
    }
  }
`;

const StyledSection = styled(Section)`
  margin-bottom: 48px;
  padding-top: 32px;
  border-top: 1px solid #e5e7eb;

  &:first-of-type {
    padding-top: 0;
    border-top: none;
  }
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 32px 0;
  letter-spacing: -0.5px;
`;

const WorkItem = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
  gap: 16px;
`;

const ItemTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #111827;
  flex: 1;
`;

const ItemDate = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  white-space: nowrap;
`;

const ItemSubtitle = styled.div`
  font-size: 17px;
  font-weight: 500;
  color: #2563eb;
  margin-bottom: 4px;
`;

const ItemLocation = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 12px;
`;

const ItemDescription = styled.p`
  font-size: 15px;
  line-height: 1.7;
  color: #4b5563;
  margin: 12px 0;
`;

const HighlightsList = styled.ul`
  margin: 12px 0 0 0;
  padding-left: 20px;
  list-style: disc;

  li {
    margin-bottom: 8px;
    font-size: 15px;
    line-height: 1.7;
    color: #4b5563;

    &::marker {
      color: #2563eb;
    }
  }
`;

const SkillsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

const SkillCategory = styled.div`
  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 12px 0;
  }
`;

const StyledBadgeList = styled(BadgeList)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const StyledBadge = styled(Badge)`
  font-size: 13px;
  padding: 6px 14px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e40af;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: #dbeafe;
    border-color: #93c5fd;
  }
`;

const SimpleCard = styled.div`
  margin-bottom: 20px;

  h4 {
    font-size: 17px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 14px;
    margin: 4px 0 0 0;
    color: #6b7280;
  }

  &:last-child {
    margin-bottom: 0;
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
              {edu.score && <ItemDescription>GPA: {edu.score}</ItemDescription>}
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
