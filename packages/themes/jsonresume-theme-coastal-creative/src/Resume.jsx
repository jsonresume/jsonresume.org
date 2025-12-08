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
  max-width: 850px;
  margin: 0 auto;
  padding: 56px 40px;
  background: #fdfdf9;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #334155;
  line-height: 1.9;
  font-size: 16px;

  @media print {
    padding: 32px;
    background: white;
  }
`;

const Header = styled.header`
  margin-bottom: 56px;
  text-align: center;
`;

const Name = styled.h1`
  font-size: 42px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #0f172a;
  letter-spacing: -0.5px;
`;

const Label = styled.div`
  font-size: 18px;
  color: #0284c7;
  font-weight: 500;
  margin-bottom: 20px;
`;

const ContactWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  font-size: 15px;
  color: #64748b;
`;

const SummarySection = styled(Section)`
  margin-bottom: 48px;
  padding: 32px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #0284c7;
`;

const SummaryText = styled.p`
  margin: 0;
  font-size: 17px;
  line-height: 2;
  color: #475569;
`;

const MainSection = styled(Section)`
  margin-bottom: 48px;
`;

const MainSectionTitle = styled(SectionTitle)`
  font-size: 24px;
  font-weight: 600;
  color: #0284c7;
  margin: 0 0 32px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const WorkItem = styled.div`
  margin-bottom: 40px;
  padding: 28px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:last-child {
    margin-bottom: 0;
  }
`;

const WorkHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 12px;
`;

const WorkTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #0f172a;
`;

const WorkMeta = styled.div`
  font-size: 14px;
  color: #94a3b8;
  font-weight: 500;
`;

const WorkCompany = styled.div`
  font-size: 16px;
  color: #0284c7;
  font-weight: 500;
  margin-bottom: 12px;
`;

const WorkDescription = styled.p`
  font-size: 16px;
  line-height: 1.9;
  margin: 16px 0;
  color: #475569;
`;

const WorkHighlights = styled.ul`
  margin: 16px 0 0 0;
  padding-left: 24px;
  list-style: disc;

  li {
    margin-bottom: 10px;
    font-size: 16px;
    line-height: 1.9;
    color: #475569;

    &::marker {
      color: #0284c7;
    }
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
`;

const SkillCard = styled.div`
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const SkillName = styled.h4`
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #0284c7;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StyledBadgeList = styled(BadgeList)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const StyledBadge = styled(Badge)`
  font-size: 13px;
  padding: 8px 14px;
  background: #f0f9ff;
  border: none;
  color: #0369a1;
  font-weight: 500;
  border-radius: 20px;
`;

const SimpleList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
`;

const SimpleCard = styled.div`
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  font-size: 16px;
  line-height: 1.8;

  strong {
    font-weight: 600;
    color: #0f172a;
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
              <SkillCard key={index}>
                <SkillName>{skill.name}</SkillName>
                <StyledBadgeList>
                  {skill.keywords?.map((keyword, i) => (
                    <StyledBadge key={i}>{keyword}</StyledBadge>
                  ))}
                </StyledBadgeList>
              </SkillCard>
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
              <SimpleCard key={index}>
                <strong>{award.title}</strong>
                {award.awarder && ` — ${award.awarder}`}
                {award.date && (
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#94a3b8',
                      marginTop: '8px',
                    }}
                  >
                    {award.date}
                  </div>
                )}
              </SimpleCard>
            ))}
          </SimpleList>
        </MainSection>
      )}

      {publications.length > 0 && (
        <MainSection>
          <MainSectionTitle>Publications</MainSectionTitle>
          <SimpleList>
            {publications.map((pub, index) => (
              <SimpleCard key={index}>
                <strong>{pub.name}</strong>
                {pub.publisher && ` — ${pub.publisher}`}
                {pub.releaseDate && (
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#94a3b8',
                      marginTop: '8px',
                    }}
                  >
                    {pub.releaseDate}
                  </div>
                )}
              </SimpleCard>
            ))}
          </SimpleList>
        </MainSection>
      )}

      {languages.length > 0 && (
        <MainSection>
          <MainSectionTitle>Languages</MainSectionTitle>
          <SimpleList>
            {languages.map((lang, index) => (
              <SimpleCard key={index}>
                <strong>{lang.language}</strong>
                {lang.fluency && ` — ${lang.fluency}`}
              </SimpleCard>
            ))}
          </SimpleList>
        </MainSection>
      )}

      {interests.length > 0 && (
        <MainSection>
          <MainSectionTitle>Interests</MainSectionTitle>
          <SimpleList>
            {interests.map((interest, index) => (
              <SimpleCard key={index}>{interest.name}</SimpleCard>
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
