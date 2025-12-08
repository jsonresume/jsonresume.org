import React from 'react';
import styled from 'styled-components';
import {
  Section,
  SectionTitle,
  ListItem,
  DateRange,
  Badge,
  BadgeList,
  ContactInfo,
  Link,
  safeUrl,
} from '@jsonresume/core';

const GRID_SIZE = 8;

const Layout = styled.div`
  max-width: 880px;
  margin: 0 auto;
  padding: ${GRID_SIZE * 10}px ${GRID_SIZE * 6}px;
  background: #ffffff;
  font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #1a1a1a;
  line-height: ${GRID_SIZE * 3}px;
  font-size: 14px;

  @media print {
    padding: ${GRID_SIZE * 6}px ${GRID_SIZE * 4}px;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: ${GRID_SIZE * 3}px;
  margin-bottom: ${GRID_SIZE * 6}px;
`;

const Header = styled.header`
  grid-column: 1 / -1;
  padding-bottom: ${GRID_SIZE * 4}px;
  border-bottom: 3px solid #1a1a1a;
  margin-bottom: ${GRID_SIZE * 8}px;
`;

const Name = styled.h1`
  font-size: 44px;
  font-weight: 700;
  margin: 0 0 ${GRID_SIZE * 2}px 0;
  letter-spacing: -0.5px;
  line-height: ${GRID_SIZE * 7}px;
  text-transform: uppercase;
`;

const Tagline = styled.div`
  font-size: 16px;
  color: #4a4a4a;
  margin: ${GRID_SIZE}px 0 ${GRID_SIZE * 3}px 0;
  font-weight: 500;
  letter-spacing: 0.3px;
`;

const StyledContactInfo = styled(ContactInfo)`
  display: flex;
  flex-wrap: wrap;
  gap: ${GRID_SIZE * 3}px;
  margin-top: ${GRID_SIZE * 2}px;

  a {
    color: #1a1a1a;
    text-decoration: none;
    font-size: 13px;
    position: relative;
    padding-bottom: 2px;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 1px;
      background: #1a1a1a;
      transition: width 0.2s ease;
    }

    &:hover::after {
      width: 100%;
    }
  }
`;

const Summary = styled.p`
  grid-column: 1 / -1;
  font-size: 15px;
  line-height: ${GRID_SIZE * 3}px;
  color: #2a2a2a;
  margin: 0 0 ${GRID_SIZE * 8}px 0;
  padding: ${GRID_SIZE * 3}px;
  border-left: 4px solid #e5e5e5;
  background: #fafafa;
`;

const StyledSection = styled(Section)`
  grid-column: 1 / -1;
  margin-bottom: ${GRID_SIZE * 8}px;
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-size: 20px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #1a1a1a;
  margin: 0 0 ${GRID_SIZE * 4}px 0;
  padding-bottom: ${GRID_SIZE}px;
  border-bottom: 2px solid #1a1a1a;
`;

const GridItem = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: ${GRID_SIZE * 4}px;
  margin-bottom: ${GRID_SIZE * 5}px;
  padding-bottom: ${GRID_SIZE * 5}px;
  border-bottom: 1px solid #e5e5e5;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${GRID_SIZE * 2}px;
  }
`;

const MetaColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${GRID_SIZE}px;
  padding-right: ${GRID_SIZE * 2}px;
  border-right: 2px solid #e5e5e5;

  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 2px solid #e5e5e5;
    padding-right: 0;
    padding-bottom: ${GRID_SIZE * 2}px;
  }
`;

const ContentColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${GRID_SIZE * 2}px;
`;

const MetaDate = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
  font-variant-numeric: tabular-nums;
`;

const MetaLocation = styled.div`
  font-size: 12px;
  color: #6a6a6a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ItemTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #1a1a1a;
  letter-spacing: -0.2px;
`;

const ItemSubtitle = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #4a4a4a;
  margin-top: ${GRID_SIZE / 2}px;
`;

const ItemDescription = styled.p`
  font-size: 14px;
  line-height: ${GRID_SIZE * 3}px;
  color: #2a2a2a;
  margin: ${GRID_SIZE * 2}px 0 0 0;
`;

const HighlightsList = styled.ul`
  margin: ${GRID_SIZE * 2}px 0 0 0;
  padding-left: ${GRID_SIZE * 3}px;
  list-style: none;

  li {
    position: relative;
    margin-bottom: ${GRID_SIZE}px;
    font-size: 14px;
    line-height: ${GRID_SIZE * 3}px;

    &::before {
      content: '■';
      position: absolute;
      left: -${GRID_SIZE * 3}px;
      color: #1a1a1a;
      font-size: 10px;
    }
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: ${GRID_SIZE * 4}px;
`;

const SkillCategory = styled.div`
  padding: ${GRID_SIZE * 2}px;
  border: 2px solid #e5e5e5;
  background: #fafafa;

  h4 {
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0 0 ${GRID_SIZE * 2}px 0;
    color: #1a1a1a;
  }
`;

const StyledBadgeList = styled(BadgeList)`
  display: flex;
  flex-wrap: wrap;
  gap: ${GRID_SIZE}px;
`;

const StyledBadge = styled(Badge)`
  font-size: 12px;
  padding: ${GRID_SIZE / 2}px ${GRID_SIZE * 1.5}px;
  background: #ffffff;
  border: 1px solid #d0d0d0;
  color: #2a2a2a;
  font-weight: 500;
  letter-spacing: 0.3px;
`;

const SimpleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${GRID_SIZE * 3}px;
`;

const SimpleItem = styled.div`
  padding: ${GRID_SIZE * 2}px;
  border-left: 3px solid #e5e5e5;
  background: #fafafa;

  h4 {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 ${GRID_SIZE}px 0;
  }

  p {
    font-size: 14px;
    margin: 0;
    color: #4a4a4a;
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
            <GridItem key={index}>
              <MetaColumn>
                <MetaDate>
                  <DateRange startDate={job.startDate} endDate={job.endDate} />
                </MetaDate>
                {job.location && <MetaLocation>{job.location}</MetaLocation>}
              </MetaColumn>
              <ContentColumn>
                <ItemTitle>{job.position || job.name}</ItemTitle>
                {job.name && <ItemSubtitle>{job.name}</ItemSubtitle>}
                {job.summary && (
                  <ItemDescription>{job.summary}</ItemDescription>
                )}
                {job.highlights && job.highlights.length > 0 && (
                  <HighlightsList>
                    {job.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </HighlightsList>
                )}
              </ContentColumn>
            </GridItem>
          ))}
        </StyledSection>
      )}

      {education.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Education</StyledSectionTitle>
          {education.map((edu, index) => (
            <GridItem key={index}>
              <MetaColumn>
                <MetaDate>
                  <DateRange startDate={edu.startDate} endDate={edu.endDate} />
                </MetaDate>
                {edu.area && <MetaLocation>{edu.area}</MetaLocation>}
              </MetaColumn>
              <ContentColumn>
                <ItemTitle>{edu.institution}</ItemTitle>
                {edu.studyType && edu.area && (
                  <ItemSubtitle>
                    {edu.studyType} in {edu.area}
                  </ItemSubtitle>
                )}
                {edu.score && (
                  <ItemDescription>GPA: {edu.score}</ItemDescription>
                )}
                {edu.courses && edu.courses.length > 0 && (
                  <HighlightsList>
                    {edu.courses.map((course, i) => (
                      <li key={i}>{course}</li>
                    ))}
                  </HighlightsList>
                )}
              </ContentColumn>
            </GridItem>
          ))}
        </StyledSection>
      )}

      {skills.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Skills</StyledSectionTitle>
          <SkillsGrid>
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
          </SkillsGrid>
        </StyledSection>
      )}

      {projects.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Projects</StyledSectionTitle>
          {projects.map((project, index) => (
            <GridItem key={index}>
              <MetaColumn>
                <MetaDate>
                  <DateRange
                    startDate={project.startDate}
                    endDate={project.endDate}
                  />
                </MetaDate>
                {project.type && <MetaLocation>{project.type}</MetaLocation>}
              </MetaColumn>
              <ContentColumn>
                <ItemTitle>
                  {project.url ? (
                    <Link href={safeUrl(project.url)}>{project.name}</Link>
                  ) : (
                    project.name
                  )}
                </ItemTitle>
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
              </ContentColumn>
            </GridItem>
          ))}
        </StyledSection>
      )}

      {awards.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Awards</StyledSectionTitle>
          <SimpleList>
            {awards.map((award, index) => (
              <SimpleItem key={index}>
                <h4>{award.title}</h4>
                <p>
                  {award.awarder} {award.date && `• ${award.date}`}
                </p>
                {award.summary && <p>{award.summary}</p>}
              </SimpleItem>
            ))}
          </SimpleList>
        </StyledSection>
      )}

      {publications.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Publications</StyledSectionTitle>
          <SimpleList>
            {publications.map((pub, index) => (
              <SimpleItem key={index}>
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
              </SimpleItem>
            ))}
          </SimpleList>
        </StyledSection>
      )}

      {volunteer.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>Volunteer</StyledSectionTitle>
          {volunteer.map((vol, index) => (
            <GridItem key={index}>
              <MetaColumn>
                <MetaDate>
                  <DateRange startDate={vol.startDate} endDate={vol.endDate} />
                </MetaDate>
              </MetaColumn>
              <ContentColumn>
                <ItemTitle>{vol.position}</ItemTitle>
                {vol.organization && (
                  <ItemSubtitle>{vol.organization}</ItemSubtitle>
                )}
                {vol.summary && (
                  <ItemDescription>{vol.summary}</ItemDescription>
                )}
                {vol.highlights && vol.highlights.length > 0 && (
                  <HighlightsList>
                    {vol.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </HighlightsList>
                )}
              </ContentColumn>
            </GridItem>
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
          <SimpleList>
            {interests.map((interest, index) => (
              <SimpleItem key={index}>
                <h4>{interest.name}</h4>
                {interest.keywords && interest.keywords.length > 0 && (
                  <p>{interest.keywords.join(', ')}</p>
                )}
              </SimpleItem>
            ))}
          </SimpleList>
        </StyledSection>
      )}

      {references.length > 0 && (
        <StyledSection>
          <StyledSectionTitle>References</StyledSectionTitle>
          <SimpleList>
            {references.map((ref, index) => (
              <SimpleItem key={index}>
                <h4>{ref.name}</h4>
                {ref.reference && <p>{ref.reference}</p>}
              </SimpleItem>
            ))}
          </SimpleList>
        </StyledSection>
      )}
    </Layout>
  );
}

export default Resume;
