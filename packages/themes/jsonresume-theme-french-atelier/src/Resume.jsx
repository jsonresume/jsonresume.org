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
  max-width: 750px;
  margin: 0 auto;
  padding: 56px 44px;
  background: #fafafa;
  font-family: 'Work Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #3a3a3a;
  line-height: 1.75;
  font-size: 14.5px;

  @media print {
    background: white;
    padding: 36px 28px;
  }
`;

const Header = styled.header`
  margin-bottom: 56px;
  padding-bottom: 40px;
  border-bottom: 2px solid #3b0a45;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 120px;
    height: 2px;
    background: #3b0a45;
  }
`;

const Name = styled.h1`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 900;
  margin: 0 0 8px 0;
  color: #1a1a1a;
  letter-spacing: -1.5px;
  line-height: 1.1;
`;

const Tagline = styled.div`
  font-size: 18px;
  color: #3b0a45;
  margin: 0 0 24px 0;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: 13px;
`;

const Summary = styled.p`
  font-size: 15px;
  line-height: 1.8;
  color: #4a4a4a;
  margin: 24px 0 0 0;
  max-width: 650px;
`;

const StyledContactInfo = styled(ContactInfo)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px 24px;
  margin-top: 24px;
  font-size: 13px;

  a {
    color: #3b0a45;
    text-decoration: none;
    font-weight: 500;
    position: relative;
    padding-bottom: 2px;
    transition: color 0.2s;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 1px;
      background: #3b0a45;
      transition: width 0.3s ease;
    }

    &:hover {
      color: #2d0836;

      &::after {
        width: 100%;
      }
    }
  }
`;

const StyledSection = styled(Section)`
  margin-bottom: 48px;
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 32px 0;
  letter-spacing: -0.5px;
  padding-bottom: 12px;
  border-bottom: 1px solid #d4d4d4;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 80px;
    height: 1px;
    background: #3b0a45;
  }
`;

const WorkItem = styled.div`
  margin-bottom: 36px;
  padding-left: 20px;
  border-left: 1px solid #e0e0e0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -4px;
    top: 6px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #3b0a45;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const ItemHeader = styled.div`
  margin-bottom: 12px;
`;

const ItemTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 6px;
`;

const ItemTitle = styled.h3`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: #1a1a1a;
  flex: 1;
`;

const ItemDate = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #737373;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ItemSubtitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #3b0a45;
  margin-bottom: 4px;
`;

const ItemLocation = styled.div`
  font-size: 13px;
  color: #737373;
  margin-bottom: 12px;
  font-style: italic;
`;

const ItemDescription = styled.p`
  font-size: 14.5px;
  line-height: 1.75;
  color: #4a4a4a;
  margin: 12px 0;
`;

const HighlightsList = styled.ul`
  margin: 12px 0 0 0;
  padding-left: 20px;
  list-style: none;

  li {
    position: relative;
    margin-bottom: 8px;
    font-size: 14.5px;
    line-height: 1.7;
    color: #4a4a4a;
    padding-left: 12px;

    &::before {
      content: '—';
      position: absolute;
      left: 0;
      color: #3b0a45;
      font-weight: 600;
    }
  }
`;

const SkillsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 28px;
`;

const SkillCategory = styled.div`
  h4 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 18px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 14px 0;
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
  background: #f5f0f6;
  border: 1px solid #3b0a45;
  color: #3b0a45;
  font-weight: 500;
  border-radius: 0;
  transition: all 0.2s;

  &:hover {
    background: #3b0a45;
    color: white;
  }
`;

const SimpleCard = styled.div`
  margin-bottom: 24px;
  padding-left: 20px;
  border-left: 1px solid #e0e0e0;

  h4 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 18px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 13px;
    margin: 4px 0 0 0;
    color: #737373;
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
                <ItemTitleRow>
                  <ItemTitle>{job.position || job.name}</ItemTitle>
                  <ItemDate>
                    <DateRange
                      startDate={job.startDate}
                      endDate={job.endDate}
                    />
                  </ItemDate>
                </ItemTitleRow>
                {job.name && <ItemSubtitle>{job.name}</ItemSubtitle>}
                {job.location && <ItemLocation>{job.location}</ItemLocation>}
              </ItemHeader>
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
                <ItemTitleRow>
                  <ItemTitle>{edu.institution}</ItemTitle>
                  <ItemDate>
                    <DateRange
                      startDate={edu.startDate}
                      endDate={edu.endDate}
                    />
                  </ItemDate>
                </ItemTitleRow>
                {edu.studyType && edu.area && (
                  <ItemSubtitle>
                    {edu.studyType} in {edu.area}
                  </ItemSubtitle>
                )}
                {edu.score && <ItemLocation>Score: {edu.score}</ItemLocation>}
              </ItemHeader>
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
                <ItemTitleRow>
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
                </ItemTitleRow>
                {project.type && <ItemLocation>{project.type}</ItemLocation>}
              </ItemHeader>
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
                <ItemTitleRow>
                  <ItemTitle>{vol.position}</ItemTitle>
                  <ItemDate>
                    <DateRange
                      startDate={vol.startDate}
                      endDate={vol.endDate}
                    />
                  </ItemDate>
                </ItemTitleRow>
                {vol.organization && (
                  <ItemSubtitle>{vol.organization}</ItemSubtitle>
                )}
              </ItemHeader>
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
