import React from 'react';
import styled from 'styled-components';
import {
  Section,
  SectionTitle,
  DateRange,
  ContactInfo,
  Link,
  safeUrl,
} from '@jsonresume/core';

const Layout = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 48px 40px;
  background: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #1f2937;
  line-height: 1.6;
  font-size: 15px;

  @media print {
    padding: 24px;
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 32px;
  border-bottom: 1px solid #e5e7eb;
`;

const Name = styled.h1`
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #111827;
  letter-spacing: -0.3px;
`;

const Label = styled.div`
  font-size: 16px;
  color: #6b7280;
  font-weight: 400;
  margin-bottom: 16px;
`;

const ContactWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 14px;
  color: #6b7280;
`;

const SummarySection = styled(Section)`
  margin-bottom: 36px;
`;

const SummaryText = styled.p`
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  color: #374151;
  text-align: left;
`;

const MainSection = styled(Section)`
  margin-bottom: 36px;
  padding-bottom: 32px;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const MainSectionTitle = styled(SectionTitle)`
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 20px 0;
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 8px;
`;

const MetricCard = styled.div`
  padding: 16px;
  background: #f9fafb;
  border-left: 2px solid #1f2937;
`;

const MetricLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 6px;
  font-weight: 500;
`;

const MetricValue = styled.div`
  font-size: 22px;
  font-weight: 600;
  color: #111827;
`;

const WorkItem = styled.div`
  margin-bottom: 28px;

  &:last-child {
    margin-bottom: 0;
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
  font-size: 17px;
  font-weight: 600;
  margin: 0;
  color: #111827;
`;

const WorkMeta = styled.div`
  font-size: 13px;
  color: #9ca3af;
  font-weight: 400;
`;

const WorkCompany = styled.div`
  font-size: 15px;
  color: #4b5563;
  font-weight: 500;
  margin-bottom: 10px;
`;

const WorkDescription = styled.p`
  font-size: 15px;
  line-height: 1.6;
  margin: 12px 0 0 0;
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
    padding-left: 4px;

    &::before {
      content: '•';
      position: absolute;
      left: -16px;
      color: #1f2937;
      font-weight: 600;
    }
  }
`;

const SkillsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

const SkillItem = styled.div`
  padding: 12px;
  background: #f9fafb;
`;

const SkillName = styled.h4`
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #111827;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SkillKeywords = styled.div`
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
`;

const SimpleList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
`;

const SimpleCard = styled.div`
  padding: 12px;
  background: #f9fafb;
  font-size: 14px;
  line-height: 1.6;

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

  // Calculate key metrics from work experience
  const calculateMetrics = () => {
    const metrics = [];

    // Total years of experience
    if (work.length > 0) {
      const totalYears = work.reduce((acc, job) => {
        if (job.startDate) {
          const start = new Date(job.startDate);
          const end = job.endDate ? new Date(job.endDate) : new Date();
          const years = (end - start) / (1000 * 60 * 60 * 24 * 365);
          return acc + years;
        }
        return acc;
      }, 0);
      metrics.push({
        label: 'Years Experience',
        value: Math.round(totalYears),
      });
    }

    // Companies worked at
    if (work.length > 0) {
      metrics.push({ label: 'Companies', value: work.length });
    }

    // Projects completed
    if (projects.length > 0) {
      metrics.push({ label: 'Projects', value: projects.length });
    }

    // Skills
    if (skills.length > 0) {
      const totalSkills = skills.reduce(
        (acc, skill) => acc + (skill.keywords?.length || 0),
        0
      );
      metrics.push({ label: 'Core Skills', value: totalSkills });
    }

    return metrics;
  };

  const keyMetrics = calculateMetrics();

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

      {keyMetrics.length > 0 && (
        <MainSection>
          <MainSectionTitle>Key Metrics</MainSectionTitle>
          <MetricsGrid>
            {keyMetrics.map((metric, index) => (
              <MetricCard key={index}>
                <MetricLabel>{metric.label}</MetricLabel>
                <MetricValue>{metric.value}</MetricValue>
              </MetricCard>
            ))}
          </MetricsGrid>
        </MainSection>
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
          <SkillsList>
            {skills.map((skill, index) => (
              <SkillItem key={index}>
                <SkillName>{skill.name}</SkillName>
                {skill.keywords && skill.keywords.length > 0 && (
                  <SkillKeywords>{skill.keywords.join(', ')}</SkillKeywords>
                )}
              </SkillItem>
            ))}
          </SkillsList>
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
                      fontSize: '13px',
                      color: '#9ca3af',
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
                      fontSize: '13px',
                      color: '#9ca3af',
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
