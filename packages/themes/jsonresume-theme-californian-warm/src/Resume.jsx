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
  max-width: 820px;
  margin: 0 auto;
  padding: 60px 50px;
  background: #fff8f1;
  font-family: 'Nunito', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #3d2a1f;
  line-height: 1.8;
  font-size: 15px;

  @media print {
    background: white;
    padding: 40px 30px;
  }
`;

const Header = styled.header`
  margin-bottom: 50px;
  padding: 40px;
  background: linear-gradient(135deg, #fef5e7 0%, #fef0dc 100%);
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.08);
`;

const Name = styled.h1`
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 12px 0;
  color: #d97706;
  letter-spacing: -0.5px;
  line-height: 1.2;
`;

const Tagline = styled.div`
  font-size: 20px;
  color: #92400e;
  margin: 0 0 24px 0;
  font-weight: 600;
  opacity: 0.9;
`;

const Summary = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: #4d3319;
  margin: 24px 0 30px 0;
  padding: 20px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  border-left: 4px solid #f59e0b;
`;

const StyledContactInfo = styled(ContactInfo)`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;

  a {
    color: #d97706;
    text-decoration: none;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.2s ease;
    padding: 8px 16px;
    background: rgba(251, 191, 36, 0.15);
    border-radius: 8px;

    &:hover {
      background: rgba(251, 191, 36, 0.25);
      transform: translateY(-1px);
    }
  }
`;

const StyledSection = styled(Section)`
  margin-bottom: 50px;
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-size: 28px;
  font-weight: 700;
  color: #ea580c;
  margin: 0 0 30px 0;
  padding-bottom: 12px;
  border-bottom: 3px solid #fed7aa;
  letter-spacing: -0.3px;
`;

const WorkItem = styled.div`
  margin-bottom: 40px;
  padding: 30px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(217, 119, 6, 0.08);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 20px rgba(217, 119, 6, 0.12);
    transform: translateY(-2px);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
`;

const ItemTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: #d97706;
  flex: 1;
  min-width: 200px;
`;

const ItemDate = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #92400e;
  opacity: 0.8;
  background: #fef3c7;
  padding: 6px 14px;
  border-radius: 20px;
  white-space: nowrap;
`;

const ItemSubtitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #78350f;
  margin-bottom: 8px;
`;

const ItemLocation = styled.div`
  font-size: 14px;
  color: #a16207;
  font-weight: 600;
  margin-bottom: 12px;
  opacity: 0.9;
`;

const ItemDescription = styled.p`
  font-size: 15px;
  line-height: 1.8;
  color: #4d3319;
  margin: 16px 0;
`;

const HighlightsList = styled.ul`
  margin: 16px 0 0 0;
  padding-left: 28px;
  list-style: none;

  li {
    position: relative;
    margin-bottom: 12px;
    font-size: 15px;
    line-height: 1.7;
    color: #4d3319;

    &::before {
      content: '✦';
      position: absolute;
      left: -28px;
      color: #f59e0b;
      font-size: 14px;
    }
  }
`;

const SkillsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const SkillCategory = styled.div`
  padding: 28px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(217, 119, 6, 0.08);

  h4 {
    font-size: 18px;
    font-weight: 700;
    color: #ea580c;
    margin: 0 0 18px 0;
    text-transform: none;
  }
`;

const StyledBadgeList = styled(BadgeList)`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const StyledBadge = styled(Badge)`
  font-size: 14px;
  padding: 10px 18px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: none;
  color: #92400e;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
  }
`;

const SimpleCard = styled.div`
  padding: 24px;
  background: white;
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(217, 119, 6, 0.06);
  margin-bottom: 20px;

  h4 {
    font-size: 18px;
    font-weight: 700;
    color: #d97706;
    margin: 0 0 10px 0;
  }

  p {
    font-size: 14px;
    margin: 6px 0 0 0;
    color: #78350f;
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
        {basics.summary && <Summary>{basics.summary}</Summary>}
        <StyledContactInfo
          email={basics.email}
          phone={basics.phone}
          url={basics.url}
          location={basics.location}
          profiles={basics.profiles}
        />
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
