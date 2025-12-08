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
  max-width: 850px;
  margin: 0 auto;
  padding: 50px 45px;
  background: #ffffff;
  font-family: 'Quicksand', 'Nunito', -apple-system, BlinkMacSystemFont,
    sans-serif;
  color: #2d3748;
  line-height: 1.7;
  font-size: 15.5px;

  @media print {
    padding: 30px;
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 48px;
  padding: 36px;
  background: linear-gradient(135deg, #e0f2fe 0%, #d1fae5 100%);
  border-radius: 20px;
  border: 3px solid #38bdf8;
  box-shadow: 0 4px 20px rgba(56, 189, 248, 0.15);
`;

const Name = styled.h1`
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #0c4a6e;
  letter-spacing: 0.5px;
`;

const Label = styled.div`
  font-size: 19px;
  color: #047857;
  font-weight: 600;
  margin-bottom: 20px;
  font-style: italic;
`;

const ContactWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  font-size: 14.5px;
  color: #475569;
  margin-top: 16px;
`;

const SummarySection = styled(Section)`
  margin-bottom: 40px;
  padding: 28px;
  background: #f0fdfa;
  border-left: 5px solid #14b8a6;
  border-radius: 12px;
`;

const SummaryText = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 1.8;
  color: #1e40af;
  font-weight: 500;
  text-align: center;
  font-style: italic;
`;

const MainSection = styled(Section)`
  margin-bottom: 44px;
`;

const MainSectionTitle = styled(SectionTitle)`
  font-size: 24px;
  font-weight: 700;
  color: #0c4a6e;
  margin: 0 0 24px 0;
  padding-bottom: 12px;
  border-bottom: 4px solid #38bdf8;
  display: inline-block;
  min-width: 200px;
`;

const CertificationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 12px;
`;

const CertCard = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #eff6ff 0%, #ecfdf5 100%);
  border: 2px solid #7dd3fc;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(56, 189, 248, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(56, 189, 248, 0.2);
  }
`;

const CertName = styled.h3`
  font-size: 17px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #0c4a6e;
`;

const CertIssuer = styled.div`
  font-size: 14px;
  color: #059669;
  font-weight: 600;
  margin-bottom: 6px;
`;

const CertDate = styled.div`
  font-size: 13px;
  color: #64748b;
  font-style: italic;
`;

const WorkItem = styled.div`
  margin-bottom: 36px;
  padding: 24px;
  background: #fefce8;
  border-left: 5px solid #84cc16;
  border-radius: 12px;

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
  gap: 10px;
`;

const WorkTitle = styled.h3`
  font-size: 19px;
  font-weight: 700;
  margin: 0;
  color: #0c4a6e;
`;

const WorkMeta = styled.div`
  font-size: 14px;
  color: #65a30d;
  font-weight: 600;
`;

const WorkCompany = styled.div`
  font-size: 16px;
  color: #047857;
  font-weight: 600;
  margin-bottom: 12px;
`;

const WorkDescription = styled.p`
  font-size: 15.5px;
  line-height: 1.7;
  margin: 14px 0 0 0;
  color: #374151;
`;

const WorkHighlights = styled.ul`
  margin: 14px 0 0 0;
  padding-left: 24px;
  list-style: none;

  li {
    margin-bottom: 10px;
    font-size: 15.5px;
    line-height: 1.7;
    color: #374151;
    position: relative;
    padding-left: 8px;

    &::before {
      content: '🌱';
      position: absolute;
      left: -24px;
      font-size: 16px;
    }
  }
`;

const VolunteerItem = styled.div`
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dbeafe 100%);
  border: 3px solid #10b981;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(16, 185, 129, 0.1);

  &:last-child {
    margin-bottom: 0;
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
`;

const SkillCard = styled.div`
  padding: 18px;
  background: #f0f9ff;
  border-left: 4px solid #0ea5e9;
  border-radius: 10px;
`;

const SkillName = styled.h4`
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: #0c4a6e;
`;

const SkillKeywords = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SkillBadge = styled.span`
  display: inline-block;
  padding: 6px 14px;
  background: #bfdbfe;
  color: #1e40af;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
`;

const EducationItem = styled.div`
  margin-bottom: 28px;
  padding: 22px;
  background: #fef3c7;
  border-left: 5px solid #f59e0b;
  border-radius: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const AwardsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 18px;
`;

const AwardCard = styled.div`
  padding: 18px;
  background: linear-gradient(135deg, #fef3c7 0%, #fce7f3 100%);
  border: 2px solid #fbbf24;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.1);

  strong {
    font-weight: 700;
    color: #b45309;
    font-size: 16px;
  }
`;

const PublicationsList = styled.div`
  display: grid;
  gap: 20px;
`;

const PublicationCard = styled.div`
  padding: 20px;
  background: #faf5ff;
  border-left: 4px solid #a78bfa;
  border-radius: 10px;

  strong {
    font-weight: 700;
    color: #6b21a8;
    font-size: 16px;
  }
`;

const SimpleList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

const SimpleCard = styled.div`
  padding: 16px;
  background: #f0fdf4;
  border: 2px solid #86efac;
  border-radius: 12px;
  font-size: 15px;
  line-height: 1.7;

  strong {
    font-weight: 700;
    color: #166534;
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
    certificates = [],
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
          <SummaryText>"{basics.summary}"</SummaryText>
        </SummarySection>
      )}

      {certificates && certificates.length > 0 && (
        <MainSection>
          <MainSectionTitle>Certifications & Diplomas</MainSectionTitle>
          <CertificationsGrid>
            {certificates.map((cert, index) => (
              <CertCard key={index}>
                <CertName>{cert.name}</CertName>
                {cert.issuer && (
                  <CertIssuer>Issued by: {cert.issuer}</CertIssuer>
                )}
                {cert.date && <CertDate>{cert.date}</CertDate>}
              </CertCard>
            ))}
          </CertificationsGrid>
        </MainSection>
      )}

      {volunteer.length > 0 && (
        <MainSection>
          <MainSectionTitle>Community Involvement</MainSectionTitle>
          {volunteer.map((vol, index) => (
            <VolunteerItem key={index}>
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
            </VolunteerItem>
          ))}
        </MainSection>
      )}

      {work.length > 0 && (
        <MainSection>
          <MainSectionTitle>Professional Experience</MainSectionTitle>
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

      {education.length > 0 && (
        <MainSection>
          <MainSectionTitle>Education</MainSectionTitle>
          {education.map((edu, index) => (
            <EducationItem key={index}>
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
            </EducationItem>
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
                {skill.keywords && skill.keywords.length > 0 && (
                  <SkillKeywords>
                    {skill.keywords.map((keyword, i) => (
                      <SkillBadge key={i}>{keyword}</SkillBadge>
                    ))}
                  </SkillKeywords>
                )}
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

      {awards.length > 0 && (
        <MainSection>
          <MainSectionTitle>Awards & Recognition</MainSectionTitle>
          <AwardsList>
            {awards.map((award, index) => (
              <AwardCard key={index}>
                <strong>{award.title}</strong>
                {award.awarder && (
                  <div style={{ marginTop: '8px', color: '#92400e' }}>
                    — {award.awarder}
                  </div>
                )}
                {award.date && (
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#78716c',
                      marginTop: '6px',
                      fontStyle: 'italic',
                    }}
                  >
                    {award.date}
                  </div>
                )}
              </AwardCard>
            ))}
          </AwardsList>
        </MainSection>
      )}

      {publications.length > 0 && (
        <MainSection>
          <MainSectionTitle>Publications</MainSectionTitle>
          <PublicationsList>
            {publications.map((pub, index) => (
              <PublicationCard key={index}>
                <strong>{pub.name}</strong>
                {pub.publisher && (
                  <div style={{ marginTop: '8px', color: '#5b21b6' }}>
                    — {pub.publisher}
                  </div>
                )}
                {pub.releaseDate && (
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      marginTop: '6px',
                      fontStyle: 'italic',
                    }}
                  >
                    {pub.releaseDate}
                  </div>
                )}
              </PublicationCard>
            ))}
          </PublicationsList>
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
