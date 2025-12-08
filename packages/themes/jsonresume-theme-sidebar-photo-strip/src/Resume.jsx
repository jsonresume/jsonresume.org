import React from 'react';
import styled from 'styled-components';
import {
  Section,
  SectionTitle,
  DateRange,
  ContactInfo,
} from '@jsonresume/core';

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f9fafb;
  font-family: 'DM Sans', 'Plus Jakarta Sans', -apple-system, sans-serif;
  color: #111827;

  @media print {
    min-height: auto;
  }
`;

const Sidebar = styled.aside`
  width: 28%;
  background: #111827;
  color: #f9fafb;
  padding: 50px 30px;
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 768px) {
    width: 100%;
    padding: 30px 20px;
  }

  @media print {
    width: 28%;
    padding: 40px 25px;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 50px 60px;

  @media (max-width: 768px) {
    padding: 30px 20px;
  }

  @media print {
    padding: 40px;
  }
`;

const ProfilePhoto = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 4px;
  margin-bottom: 8px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%);
  }

  @media (max-width: 768px) {
    max-width: 200px;
    margin: 0 auto 16px;
  }
`;

const SidebarName = styled.h1`
  font-size: 26px;
  font-weight: 600;
  color: #f9fafb;
  margin: 0 0 6px 0;
  letter-spacing: -0.3px;
  line-height: 1.2;
`;

const SidebarLabel = styled.div`
  font-size: 14px;
  color: #9ca3af;
  margin-bottom: 20px;
  font-weight: 400;
  letter-spacing: 0.3px;
`;

const SidebarSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SidebarSectionTitle = styled.h2`
  font-size: 13px;
  font-weight: 600;
  color: #f9fafb;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.8px;
`;

const SidebarText = styled.div`
  font-size: 13px;
  line-height: 1.6;
  color: #d1d5db;
  margin: 6px 0;

  a {
    color: #d1d5db;
    text-decoration: none;
    word-break: break-word;

    &:hover {
      color: #f9fafb;
    }
  }
`;

const SkillTag = styled.div`
  display: inline-block;
  padding: 4px 10px;
  background: rgba(249, 250, 251, 0.1);
  border-radius: 3px;
  font-size: 12px;
  margin: 4px 4px 4px 0;
  color: #e5e7eb;
  font-weight: 400;
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-size: 22px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 28px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
  letter-spacing: -0.3px;
`;

const WorkItem = styled.div`
  margin-bottom: 36px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const WorkHeader = styled.div`
  margin-bottom: 12px;
`;

const Position = styled.h3`
  font-size: 17px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 6px 0;
`;

const Company = styled.div`
  font-size: 15px;
  color: #4b5563;
  font-weight: 500;
  margin-bottom: 4px;
`;

const DateText = styled.div`
  font-size: 13px;
  color: #6b7280;
  font-weight: 400;
  letter-spacing: 0.2px;
`;

const WorkSummary = styled.p`
  margin: 12px 0;
  color: #374151;
  line-height: 1.7;
  font-size: 14px;
`;

const Highlights = styled.ul`
  margin: 12px 0 0 0;
  padding-left: 20px;
  list-style-type: disc;

  li {
    margin: 6px 0;
    color: #4b5563;
    line-height: 1.7;
    font-size: 14px;
    padding-left: 4px;
  }
`;

const EducationItem = styled.div`
  margin-bottom: 28px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Institution = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 6px 0;
`;

const Degree = styled.div`
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 4px;
  line-height: 1.5;
`;

const EducationDate = styled.div`
  font-size: 13px;
  color: #6b7280;
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
      <Sidebar>
        {basics.image && (
          <ProfilePhoto>
            <img src={basics.image} alt={basics.name || 'Profile'} />
          </ProfilePhoto>
        )}

        <div>
          <SidebarName>{basics.name}</SidebarName>
          {basics.label && <SidebarLabel>{basics.label}</SidebarLabel>}
        </div>

        {(basics.email ||
          basics.phone ||
          basics.url ||
          basics.location?.city) && (
          <SidebarSection>
            <SidebarSectionTitle>Contact</SidebarSectionTitle>
            {basics.email && (
              <SidebarText>
                <a href={`mailto:${basics.email}`}>{basics.email}</a>
              </SidebarText>
            )}
            {basics.phone && <SidebarText>{basics.phone}</SidebarText>}
            {basics.url && (
              <SidebarText>
                <a href={basics.url} target="_blank" rel="noopener noreferrer">
                  {basics.url.replace(/^https?:\/\//, '')}
                </a>
              </SidebarText>
            )}
            {basics.location?.city && (
              <SidebarText>
                {basics.location.city}
                {basics.location.region && `, ${basics.location.region}`}
              </SidebarText>
            )}
          </SidebarSection>
        )}

        {skills?.length > 0 && (
          <SidebarSection>
            <SidebarSectionTitle>Skills</SidebarSectionTitle>
            {skills.map((skill, index) => (
              <div key={index} style={{ marginBottom: '16px' }}>
                <SidebarText style={{ fontWeight: 600, marginBottom: '8px' }}>
                  {skill.name}
                </SidebarText>
                <div>
                  {skill.keywords?.map((keyword, i) => (
                    <SkillTag key={i}>{keyword}</SkillTag>
                  ))}
                </div>
              </div>
            ))}
          </SidebarSection>
        )}

        {languages?.length > 0 && (
          <SidebarSection>
            <SidebarSectionTitle>Languages</SidebarSectionTitle>
            {languages.map((lang, index) => (
              <SidebarText key={index}>
                <strong>{lang.language}</strong>
                {lang.fluency && <span> • {lang.fluency}</span>}
              </SidebarText>
            ))}
          </SidebarSection>
        )}

        {interests?.length > 0 && (
          <SidebarSection>
            <SidebarSectionTitle>Interests</SidebarSectionTitle>
            {interests.map((interest, index) => (
              <div key={index} style={{ marginBottom: '12px' }}>
                <SidebarText style={{ fontWeight: 600 }}>
                  {interest.name}
                </SidebarText>
                {interest.keywords?.length > 0 && (
                  <SidebarText style={{ fontSize: '12px', marginTop: '4px' }}>
                    {interest.keywords.join(', ')}
                  </SidebarText>
                )}
              </div>
            ))}
          </SidebarSection>
        )}
      </Sidebar>

      <MainContent>
        {basics.summary && (
          <Section>
            <WorkSummary
              style={{
                fontSize: '15px',
                marginBottom: '40px',
                color: '#1f2937',
              }}
            >
              {basics.summary}
            </WorkSummary>
          </Section>
        )}

        {work?.length > 0 && (
          <Section>
            <StyledSectionTitle>Experience</StyledSectionTitle>
            {work.map((job, index) => (
              <WorkItem key={index}>
                <WorkHeader>
                  <Position>{job.position}</Position>
                  {job.name && <Company>{job.name}</Company>}
                  {(job.startDate || job.endDate) && (
                    <DateText>
                      <DateRange
                        startDate={job.startDate}
                        endDate={job.endDate}
                      />
                    </DateText>
                  )}
                </WorkHeader>
                {job.summary && <WorkSummary>{job.summary}</WorkSummary>}
                {job.highlights?.length > 0 && (
                  <Highlights>
                    {job.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </Highlights>
                )}
              </WorkItem>
            ))}
          </Section>
        )}

        {projects?.length > 0 && (
          <Section>
            <StyledSectionTitle>Projects</StyledSectionTitle>
            {projects.map((project, index) => (
              <WorkItem key={index}>
                <Position>{project.name}</Position>
                {project.description && (
                  <WorkSummary>{project.description}</WorkSummary>
                )}
                {project.highlights?.length > 0 && (
                  <Highlights>
                    {project.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </Highlights>
                )}
              </WorkItem>
            ))}
          </Section>
        )}

        {education?.length > 0 && (
          <Section>
            <StyledSectionTitle>Education</StyledSectionTitle>
            {education.map((edu, index) => (
              <EducationItem key={index}>
                <Institution>{edu.institution}</Institution>
                <Degree>
                  {edu.studyType} in {edu.area}
                  {edu.score && ` • ${edu.score}`}
                </Degree>
                {(edu.startDate || edu.endDate) && (
                  <EducationDate>
                    <DateRange
                      startDate={edu.startDate}
                      endDate={edu.endDate}
                    />
                  </EducationDate>
                )}
              </EducationItem>
            ))}
          </Section>
        )}

        {volunteer?.length > 0 && (
          <Section>
            <StyledSectionTitle>Volunteer</StyledSectionTitle>
            {volunteer.map((vol, index) => (
              <WorkItem key={index}>
                <WorkHeader>
                  <Position>{vol.position}</Position>
                  {vol.organization && <Company>{vol.organization}</Company>}
                  {(vol.startDate || vol.endDate) && (
                    <DateText>
                      <DateRange
                        startDate={vol.startDate}
                        endDate={vol.endDate}
                      />
                    </DateText>
                  )}
                </WorkHeader>
                {vol.summary && <WorkSummary>{vol.summary}</WorkSummary>}
                {vol.highlights?.length > 0 && (
                  <Highlights>
                    {vol.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </Highlights>
                )}
              </WorkItem>
            ))}
          </Section>
        )}

        {awards?.length > 0 && (
          <Section>
            <StyledSectionTitle>Awards</StyledSectionTitle>
            {awards.map((award, index) => (
              <EducationItem key={index}>
                <Institution>{award.title}</Institution>
                {award.awarder && <Degree>Awarded by {award.awarder}</Degree>}
                {award.date && <EducationDate>{award.date}</EducationDate>}
                {award.summary && <WorkSummary>{award.summary}</WorkSummary>}
              </EducationItem>
            ))}
          </Section>
        )}

        {publications?.length > 0 && (
          <Section>
            <StyledSectionTitle>Publications</StyledSectionTitle>
            {publications.map((pub, index) => (
              <EducationItem key={index}>
                <Institution>{pub.name}</Institution>
                {pub.publisher && <Degree>Published by {pub.publisher}</Degree>}
                {pub.releaseDate && (
                  <EducationDate>{pub.releaseDate}</EducationDate>
                )}
                {pub.summary && <WorkSummary>{pub.summary}</WorkSummary>}
              </EducationItem>
            ))}
          </Section>
        )}

        {references?.length > 0 && (
          <Section>
            <StyledSectionTitle>References</StyledSectionTitle>
            {references.map((ref, index) => (
              <EducationItem key={index}>
                <Institution>{ref.name}</Institution>
                {ref.reference && <WorkSummary>{ref.reference}</WorkSummary>}
              </EducationItem>
            ))}
          </Section>
        )}
      </MainContent>
    </Layout>
  );
}

export default Resume;
