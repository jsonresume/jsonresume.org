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
} from '@resume/core';

const Layout = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 48px 32px;
  background: white;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #1f2937;
  line-height: 1.6;
  font-size: 14px;

  @media print {
    padding: 24px;
  }
`;

const Header = styled.header`
  margin-bottom: 48px;
  text-align: center;
`;

const Name = styled.h1`
  font-size: 42px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #111827;
  letter-spacing: -0.5px;
`;

const Label = styled.div`
  font-size: 18px;
  color: #7c3aed;
  font-weight: 600;
  margin-bottom: 16px;
`;

const ContactWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 13px;
  color: #6b7280;
`;

const SummarySection = styled(Section)`
  margin-bottom: 40px;
  padding: 24px;
  background: #faf5ff;
  border-left: 4px solid #7c3aed;
  border-radius: 4px;
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
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 24px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const WorkCard = styled.div`
  margin-bottom: 32px;
  padding: 24px;
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid #e5e7eb;

  &:last-child {
    margin-bottom: 0;
  }
`;

const WorkHeader = styled.div`
  margin-bottom: 16px;
`;

const WorkTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: #111827;
`;

const WorkCompany = styled.div`
  font-size: 14px;
  color: #7c3aed;
  font-weight: 600;
  margin-bottom: 4px;
`;

const WorkMeta = styled.div`
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
`;

const WorkDescription = styled.p`
  font-size: 14px;
  line-height: 1.6;
  margin: 12px 0;
  color: #374151;
`;

const ImpactSection = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: white;
  border-radius: 4px;
  border-left: 3px solid #7c3aed;
`;

const ImpactLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #7c3aed;
  margin-bottom: 8px;
`;

const WorkHighlights = styled.ul`
  margin: 0;
  padding-left: 20px;
  list-style: disc;

  li {
    margin-bottom: 6px;
    font-size: 14px;
    line-height: 1.5;
    color: #374151;

    strong {
      color: #7c3aed;
      font-weight: 600;
    }
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
`;

const SkillCard = styled.div`
  padding: 20px;
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
`;

const SkillName = styled.h4`
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #111827;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const StyledBadgeList = styled(BadgeList)`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const StyledBadge = styled(Badge)`
  font-size: 12px;
  padding: 6px 12px;
  background: white;
  border: 1px solid #d1d5db;
  color: #4b5563;
  font-weight: 500;
  border-radius: 4px;
`;

const EducationCard = styled(WorkCard)``;

const ProjectCard = styled(WorkCard)``;

const SimpleList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

const SimpleCard = styled.div`
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
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
            <WorkCard key={index}>
              <WorkHeader>
                <WorkTitle>{job.position || job.name}</WorkTitle>
                {job.name && <WorkCompany>{job.name}</WorkCompany>}
                <WorkMeta>
                  <DateRange startDate={job.startDate} endDate={job.endDate} />
                  {job.location && ` • ${job.location}`}
                </WorkMeta>
              </WorkHeader>
              {job.summary && <WorkDescription>{job.summary}</WorkDescription>}
              {job.highlights && job.highlights.length > 0 && (
                <ImpactSection>
                  <ImpactLabel>Key Impact</ImpactLabel>
                  <WorkHighlights>
                    {job.highlights.map((highlight, i) => (
                      <li
                        key={i}
                        dangerouslySetInnerHTML={{ __html: highlight }}
                      />
                    ))}
                  </WorkHighlights>
                </ImpactSection>
              )}
            </WorkCard>
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
            <ProjectCard key={index}>
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
                <ImpactSection>
                  <ImpactLabel>Outcomes</ImpactLabel>
                  <WorkHighlights>
                    {project.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </WorkHighlights>
                </ImpactSection>
              )}
            </ProjectCard>
          ))}
        </MainSection>
      )}

      {education.length > 0 && (
        <MainSection>
          <MainSectionTitle>Education</MainSectionTitle>
          {education.map((edu, index) => (
            <EducationCard key={index}>
              <WorkHeader>
                <WorkTitle>{edu.institution}</WorkTitle>
                {edu.studyType && edu.area && (
                  <WorkCompany>
                    {edu.studyType} in {edu.area}
                  </WorkCompany>
                )}
                <WorkMeta>
                  <DateRange startDate={edu.startDate} endDate={edu.endDate} />
                  {edu.score && ` • ${edu.score}`}
                </WorkMeta>
              </WorkHeader>
            </EducationCard>
          ))}
        </MainSection>
      )}

      {volunteer.length > 0 && (
        <MainSection>
          <MainSectionTitle>Volunteer</MainSectionTitle>
          {volunteer.map((vol, index) => (
            <WorkCard key={index}>
              <WorkHeader>
                <WorkTitle>{vol.position}</WorkTitle>
                <WorkCompany>{vol.organization}</WorkCompany>
                <WorkMeta>
                  <DateRange startDate={vol.startDate} endDate={vol.endDate} />
                </WorkMeta>
              </WorkHeader>
              {vol.summary && <WorkDescription>{vol.summary}</WorkDescription>}
              {vol.highlights && vol.highlights.length > 0 && (
                <WorkHighlights>
                  {vol.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </WorkHighlights>
              )}
            </WorkCard>
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
                      fontSize: '12px',
                      color: '#6b7280',
                      marginTop: '4px',
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
                      fontSize: '12px',
                      color: '#6b7280',
                      marginTop: '4px',
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
            <WorkCard key={index}>
              <WorkTitle>{ref.name}</WorkTitle>
              {ref.reference && (
                <WorkDescription>{ref.reference}</WorkDescription>
              )}
            </WorkCard>
          ))}
        </MainSection>
      )}
    </Layout>
  );
}

export default Resume;
