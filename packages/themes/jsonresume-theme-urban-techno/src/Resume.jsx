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
  max-width: 1000px;
  margin: 0 auto;
  padding: 0;
  background: white;
  font-family: 'Roboto Condensed', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #111;
  line-height: 1.4;
  font-size: 13px;

  @media print {
    border: none;
  }
`;

const Header = styled.header`
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: 2px solid #111;
`;

const NameSection = styled.div`
  padding: 24px;
  border-right: 2px solid #111;
  background: #111;
  color: white;
`;

const Name = styled.h1`
  font-size: 36px;
  font-weight: 900;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 0.9;
`;

const Tagline = styled.div`
  font-size: 11px;
  margin: 8px 0 0 0;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #666;
`;

const ContactSection = styled.div`
  padding: 24px;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
`;

const ContactItem = styled.div`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  a {
    color: #111;
    text-decoration: none;
    border-bottom: 1px solid #666;

    &:hover {
      border-bottom-color: #111;
    }
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
`;

const Sidebar = styled.aside`
  border-right: 2px solid #111;
  background: #e8e8e8;
`;

const MainContent = styled.main`
  background: white;
`;

const SidebarSection = styled(Section)`
  border-bottom: 1px solid #999;

  &:last-child {
    border-bottom: none;
  }
`;

const SidebarSectionTitle = styled(SectionTitle)`
  background: #111;
  color: white;
  font-size: 11px;
  font-weight: 900;
  margin: 0;
  padding: 8px 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const SidebarContent = styled.div`
  padding: 16px;
`;

const SkillItem = styled.div`
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }

  h4 {
    font-size: 10px;
    font-weight: 900;
    margin: 0 0 6px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const StyledBadgeList = styled(BadgeList)`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const StyledBadge = styled(Badge)`
  font-size: 9px;
  padding: 4px 8px;
  background: white;
  border: 1px solid #111;
  color: #111;
  font-weight: 700;
  border-radius: 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;
`;

const MainSection = styled(Section)`
  border-bottom: 2px solid #111;

  &:last-child {
    border-bottom: none;
  }
`;

const MainSectionTitle = styled(SectionTitle)`
  background: #111;
  color: white;
  font-size: 13px;
  font-weight: 900;
  margin: 0;
  padding: 10px 20px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
`;

const WorkGrid = styled.div`
  display: grid;
  grid-template-columns: 160px 1fr;
  border-bottom: 1px solid #666;

  &:last-child {
    border-bottom: none;
  }
`;

const DateColumn = styled.div`
  padding: 16px 12px;
  border-right: 1px solid #999;
  background: white;
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  line-height: 1.6;
  word-wrap: break-word;
`;

const ContentColumn = styled.div`
  padding: 16px 24px;
`;

const WorkTitle = styled.h3`
  font-size: 15px;
  font-weight: 900;
  margin: 0 0 6px 0;
  text-transform: uppercase;
  letter-spacing: -0.2px;
  line-height: 1.2;
`;

const WorkCompany = styled.div`
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #333;
`;

const WorkDescription = styled.p`
  font-size: 13px;
  line-height: 1.5;
  margin: 8px 0;
  color: #333;
`;

const WorkHighlights = styled.ul`
  margin: 8px 0 0 0;
  padding-left: 20px;
  list-style: none;

  li {
    margin-bottom: 4px;
    font-size: 12px;
    line-height: 1.4;
    color: #333;
    position: relative;
    padding-left: 12px;

    &::before {
      content: '■';
      position: absolute;
      left: 0;
      color: #111;
      font-size: 8px;
      top: 2px;
    }
  }
`;

const SimpleList = styled.div`
  font-size: 11px;
  line-height: 1.8;

  div {
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
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
        <NameSection>
          {basics.name && <Name>{basics.name}</Name>}
          {basics.label && <Tagline>{basics.label}</Tagline>}
        </NameSection>
        <ContactSection>
          {basics.email && <ContactItem>EMAIL: {basics.email}</ContactItem>}
          {basics.phone && <ContactItem>PHONE: {basics.phone}</ContactItem>}
          {basics.location?.city && basics.location?.region && (
            <ContactItem>
              LOCATION: {basics.location.city}, {basics.location.region}
            </ContactItem>
          )}
          {basics.url && (
            <ContactItem>
              WEB: <a href={safeUrl(basics.url)}>{basics.url}</a>
            </ContactItem>
          )}
          {basics.profiles?.slice(0, 2).map((profile, index) => (
            <ContactItem key={index}>
              {profile.network.toUpperCase()}:{' '}
              <a href={safeUrl(profile.url)}>{profile.username}</a>
            </ContactItem>
          ))}
        </ContactSection>
      </Header>

      <MainGrid>
        <Sidebar>
          {skills.length > 0 && (
            <SidebarSection>
              <SidebarSectionTitle>Skills</SidebarSectionTitle>
              <SidebarContent>
                {skills.map((skill, index) => (
                  <SkillItem key={index}>
                    <h4>{skill.name}</h4>
                    <StyledBadgeList>
                      {skill.keywords?.map((keyword, i) => (
                        <StyledBadge key={i}>{keyword}</StyledBadge>
                      ))}
                    </StyledBadgeList>
                  </SkillItem>
                ))}
              </SidebarContent>
            </SidebarSection>
          )}

          {languages.length > 0 && (
            <SidebarSection>
              <SidebarSectionTitle>Languages</SidebarSectionTitle>
              <SidebarContent>
                <SimpleList>
                  {languages.map((lang, index) => (
                    <div key={index}>
                      <strong>{lang.language}</strong>
                      {lang.fluency && ` — ${lang.fluency}`}
                    </div>
                  ))}
                </SimpleList>
              </SidebarContent>
            </SidebarSection>
          )}

          {interests.length > 0 && (
            <SidebarSection>
              <SidebarSectionTitle>Interests</SidebarSectionTitle>
              <SidebarContent>
                <SimpleList>
                  {interests.map((interest, index) => (
                    <div key={index}>{interest.name}</div>
                  ))}
                </SimpleList>
              </SidebarContent>
            </SidebarSection>
          )}
        </Sidebar>

        <MainContent>
          {basics.summary && (
            <MainSection>
              <MainSectionTitle>Summary</MainSectionTitle>
              <ContentColumn>
                <WorkDescription>{basics.summary}</WorkDescription>
              </ContentColumn>
            </MainSection>
          )}

          {work.length > 0 && (
            <MainSection>
              <MainSectionTitle>Experience</MainSectionTitle>
              {work.map((job, index) => (
                <WorkGrid key={index}>
                  <DateColumn>
                    <DateRange
                      startDate={job.startDate}
                      endDate={job.endDate}
                    />
                  </DateColumn>
                  <ContentColumn>
                    <WorkTitle>{job.position || job.name}</WorkTitle>
                    {job.name && <WorkCompany>{job.name}</WorkCompany>}
                    {job.summary && (
                      <WorkDescription>{job.summary}</WorkDescription>
                    )}
                    {job.highlights && job.highlights.length > 0 && (
                      <WorkHighlights>
                        {job.highlights.map((highlight, i) => (
                          <li key={i}>{highlight}</li>
                        ))}
                      </WorkHighlights>
                    )}
                  </ContentColumn>
                </WorkGrid>
              ))}
            </MainSection>
          )}

          {education.length > 0 && (
            <MainSection>
              <MainSectionTitle>Education</MainSectionTitle>
              {education.map((edu, index) => (
                <WorkGrid key={index}>
                  <DateColumn>
                    <DateRange
                      startDate={edu.startDate}
                      endDate={edu.endDate}
                    />
                  </DateColumn>
                  <ContentColumn>
                    <WorkTitle>{edu.institution}</WorkTitle>
                    {edu.studyType && edu.area && (
                      <WorkCompany>
                        {edu.studyType} in {edu.area}
                      </WorkCompany>
                    )}
                    {edu.score && (
                      <WorkDescription>Score: {edu.score}</WorkDescription>
                    )}
                  </ContentColumn>
                </WorkGrid>
              ))}
            </MainSection>
          )}

          {projects.length > 0 && (
            <MainSection>
              <MainSectionTitle>Projects</MainSectionTitle>
              {projects.map((project, index) => (
                <WorkGrid key={index}>
                  <DateColumn>
                    <DateRange
                      startDate={project.startDate}
                      endDate={project.endDate}
                    />
                  </DateColumn>
                  <ContentColumn>
                    <WorkTitle>
                      {project.url ? (
                        <Link href={safeUrl(project.url)}>{project.name}</Link>
                      ) : (
                        project.name
                      )}
                    </WorkTitle>
                    {project.description && (
                      <WorkDescription>{project.description}</WorkDescription>
                    )}
                    {project.highlights && project.highlights.length > 0 && (
                      <WorkHighlights>
                        {project.highlights.map((highlight, i) => (
                          <li key={i}>{highlight}</li>
                        ))}
                      </WorkHighlights>
                    )}
                  </ContentColumn>
                </WorkGrid>
              ))}
            </MainSection>
          )}
        </MainContent>
      </MainGrid>
    </Layout>
  );
}

export default Resume;
