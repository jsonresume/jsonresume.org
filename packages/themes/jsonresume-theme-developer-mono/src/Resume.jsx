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
  padding: 40px 32px;
  background: white;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #1f2937;
  line-height: 1.7;
  font-size: 15px;

  @media print {
    padding: 24px;
  }
`;

const Header = styled.header`
  margin-bottom: 40px;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 32px;
`;

const Name = styled.h1`
  font-family: 'JetBrains Mono', monospace;
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #111827;
  letter-spacing: -0.5px;
`;

const Label = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  color: #2563eb;
  font-weight: 600;
  margin-bottom: 16px;
`;

const ContactWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 14px;
  color: #6b7280;
`;

const SummarySection = styled(Section)`
  margin-bottom: 40px;
`;

const SummaryText = styled.p`
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  color: #374151;
`;

const MainSection = styled(Section)`
  margin-bottom: 40px;
`;

const MainSectionTitle = styled(SectionTitle)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  color: #6b7280;
  margin: 0 0 20px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const WorkItem = styled.div`
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const WorkHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
`;

const WorkTitle = styled.h3`
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #111827;
`;

const WorkMeta = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
`;

const WorkCompany = styled.div`
  font-size: 15px;
  color: #2563eb;
  font-weight: 600;
  margin-bottom: 8px;
`;

const WorkDescription = styled.p`
  font-size: 15px;
  line-height: 1.7;
  margin: 12px 0;
  color: #374151;
`;

const WorkHighlights = styled.ul`
  margin: 12px 0 0 0;
  padding-left: 20px;
  list-style: none;

  li {
    margin-bottom: 8px;
    font-size: 15px;
    line-height: 1.6;
    color: #374151;
    position: relative;
    padding-left: 12px;

    &::before {
      content: '→';
      position: absolute;
      left: 0;
      color: #2563eb;
      font-weight: 600;
    }
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 24px;
`;

const SkillItem = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SkillName = styled.h4`
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: #2563eb;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SkillCodeBlock = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  background: #f9fafb;
  padding: 12px;
  border-radius: 4px;
  border-left: 3px solid #2563eb;
  line-height: 1.6;
  color: #4b5563;
`;

const SimpleList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

const SimpleItem = styled.div`
  font-size: 15px;
  line-height: 1.6;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;

  strong {
    font-weight: 600;
    color: #111827;
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
        {basics.label && <Label>{basics.label}</Label>}
        <ContactWrapper>
          {basics.email && (
            <ContactInfo type="email">{basics.email}</ContactInfo>
          )}
          {basics.phone && (
            <ContactInfo type="phone">{basics.phone}</ContactInfo>
          )}
          {basics.location?.city && basics.location?.region && (
            <ContactInfo type="location">
              {basics.location.city}, {basics.location.region}
            </ContactInfo>
          )}
          {basics.url && (
            <ContactInfo type="url">
              <a href={safeUrl(basics.url)}>{basics.url}</a>
            </ContactInfo>
          )}
          {basics.profiles?.map((profile, index) => (
            <ContactInfo key={index} type="social">
              <a href={safeUrl(profile.url)}>{profile.network}</a>
            </ContactInfo>
          ))}
        </ContactWrapper>
      </Header>

      {basics.summary && (
        <SummarySection>
          <SummaryText>{basics.summary}</SummaryText>
        </SummarySection>
      )}

      {work.length > 0 && (
        <MainSection>
          <MainSectionTitle>Experience</MainSectionTitle>
          {work.map((job, index) => (
            <WorkItem key={index}>
              <WorkHeader>
                <WorkTitle>{job.position || job.name}</WorkTitle>
                <WorkMeta>
                  <DateRange startDate={job.startDate} endDate={job.endDate} />
                </WorkMeta>
              </WorkHeader>
              {job.name && <WorkCompany>{job.name}</WorkCompany>}
              {job.summary && <WorkDescription>{job.summary}</WorkDescription>}
              {job.highlights && job.highlights.length > 0 && (
                <WorkHighlights>
                  {job.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </WorkHighlights>
              )}
            </WorkItem>
          ))}
        </MainSection>
      )}

      {skills.length > 0 && (
        <MainSection>
          <MainSectionTitle>Skills</MainSectionTitle>
          <SkillsGrid>
            {skills.map((skill, index) => (
              <SkillItem key={index}>
                <SkillName>{skill.name}</SkillName>
                <SkillCodeBlock>{skill.keywords?.join(', ')}</SkillCodeBlock>
              </SkillItem>
            ))}
          </SkillsGrid>
        </MainSection>
      )}

      {projects.length > 0 && (
        <MainSection>
          <MainSectionTitle>Projects</MainSectionTitle>
          {projects.map((project, index) => (
            <WorkItem key={index}>
              <WorkHeader>
                <WorkTitle>
                  {project.url ? (
                    <Link href={safeUrl(project.url)}>{project.name}</Link>
                  ) : (
                    project.name
                  )}
                </WorkTitle>
                {(project.startDate || project.endDate) && (
                  <WorkMeta>
                    <DateRange
                      startDate={project.startDate}
                      endDate={project.endDate}
                    />
                  </WorkMeta>
                )}
              </WorkHeader>
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
            </WorkItem>
          ))}
        </MainSection>
      )}

      {education.length > 0 && (
        <MainSection>
          <MainSectionTitle>Education</MainSectionTitle>
          {education.map((edu, index) => (
            <WorkItem key={index}>
              <WorkHeader>
                <WorkTitle>{edu.institution}</WorkTitle>
                <WorkMeta>
                  <DateRange startDate={edu.startDate} endDate={edu.endDate} />
                </WorkMeta>
              </WorkHeader>
              {edu.studyType && edu.area && (
                <WorkCompany>
                  {edu.studyType} in {edu.area}
                </WorkCompany>
              )}
              {edu.score && <WorkDescription>GPA: {edu.score}</WorkDescription>}
            </WorkItem>
          ))}
        </MainSection>
      )}

      {volunteer.length > 0 && (
        <MainSection>
          <MainSectionTitle>Volunteer</MainSectionTitle>
          {volunteer.map((vol, index) => (
            <WorkItem key={index}>
              <WorkHeader>
                <WorkTitle>{vol.position}</WorkTitle>
                <WorkMeta>
                  <DateRange startDate={vol.startDate} endDate={vol.endDate} />
                </WorkMeta>
              </WorkHeader>
              <WorkCompany>{vol.organization}</WorkCompany>
              {vol.summary && <WorkDescription>{vol.summary}</WorkDescription>}
              {vol.highlights && vol.highlights.length > 0 && (
                <WorkHighlights>
                  {vol.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </WorkHighlights>
              )}
            </WorkItem>
          ))}
        </MainSection>
      )}

      {awards.length > 0 && (
        <MainSection>
          <MainSectionTitle>Awards</MainSectionTitle>
          <SimpleList>
            {awards.map((award, index) => (
              <SimpleItem key={index}>
                <strong>{award.title}</strong>
                {award.awarder && ` — ${award.awarder}`}
                {award.date && (
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      marginTop: '4px',
                    }}
                  >
                    {award.date}
                  </div>
                )}
              </SimpleItem>
            ))}
          </SimpleList>
        </MainSection>
      )}

      {publications.length > 0 && (
        <MainSection>
          <MainSectionTitle>Publications</MainSectionTitle>
          <SimpleList>
            {publications.map((pub, index) => (
              <SimpleItem key={index}>
                <strong>{pub.name}</strong>
                {pub.publisher && ` — ${pub.publisher}`}
                {pub.releaseDate && (
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      marginTop: '4px',
                    }}
                  >
                    {pub.releaseDate}
                  </div>
                )}
              </SimpleItem>
            ))}
          </SimpleList>
        </MainSection>
      )}

      {languages.length > 0 && (
        <MainSection>
          <MainSectionTitle>Languages</MainSectionTitle>
          <SimpleList>
            {languages.map((lang, index) => (
              <SimpleItem key={index}>
                <strong>{lang.language}</strong>
                {lang.fluency && ` — ${lang.fluency}`}
              </SimpleItem>
            ))}
          </SimpleList>
        </MainSection>
      )}

      {interests.length > 0 && (
        <MainSection>
          <MainSectionTitle>Interests</MainSectionTitle>
          <SimpleList>
            {interests.map((interest, index) => (
              <SimpleItem key={index}>{interest.name}</SimpleItem>
            ))}
          </SimpleList>
        </MainSection>
      )}

      {references.length > 0 && (
        <MainSection>
          <MainSectionTitle>References</MainSectionTitle>
          {references.map((ref, index) => (
            <WorkItem key={index}>
              <WorkTitle>{ref.name}</WorkTitle>
              {ref.reference && (
                <WorkDescription>{ref.reference}</WorkDescription>
              )}
            </WorkItem>
          ))}
        </MainSection>
      )}
    </Layout>
  );
}

export default Resume;
