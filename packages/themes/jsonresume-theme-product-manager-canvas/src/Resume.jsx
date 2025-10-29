import React from 'react';
import styled from 'styled-components';
import { Section, SectionTitle, DateRange, ContactInfo } from '@resume/core';

const Layout = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdfa 0%, #ecfeff 50%, #f0f9ff 100%);
  padding: 60px 30px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;

  @media print {
    background: white;
    padding: 40px;
  }
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(8, 145, 178, 0.12),
    0 8px 24px rgba(8, 145, 178, 0.08);
  overflow: hidden;
`;

const Header = styled.header`
  background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%);
  padding: 60px 50px;
  color: white;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, #14b8a6 0%, #06b6d4 50%, #0284c7 100%);
  }

  @media print {
    padding: 40px;
  }
`;

const Name = styled.h1`
  font-family: 'Outfit', sans-serif;
  font-size: 52px;
  font-weight: 700;
  color: white;
  margin: 0 0 12px 0;
  letter-spacing: -1px;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
`;

const Label = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 24px;
  letter-spacing: 0.5px;
  font-family: 'Outfit', sans-serif;
`;

const HeaderContactInfo = styled(ContactInfo)`
  a {
    color: rgba(255, 255, 255, 0.95);

    &:hover {
      color: white;
    }
  }
`;

const Summary = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.95);
  margin: 28px 0 0 0;
  max-width: 750px;
`;

const Content = styled.div`
  padding: 50px;

  @media print {
    padding: 40px;
  }
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-family: 'Outfit', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin: 48px 0 28px 0;
  padding-bottom: 14px;
  border-bottom: 3px solid #0891b2;
  position: relative;

  &:first-child {
    margin-top: 0;
  }

  &:after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 80px;
    height: 3px;
    background: #06b6d4;
  }
`;

const WorkItem = styled.div`
  margin-bottom: 36px;
  padding: 32px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  border-left: 5px solid #0891b2;
  box-shadow: 0 4px 12px rgba(8, 145, 178, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 8px 24px rgba(8, 145, 178, 0.15);
    border-left-color: #06b6d4;
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media print {
    background: #f9fafb;
    box-shadow: none;
    transform: none !important;
  }
`;

const WorkHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
  flex-wrap: wrap;
  gap: 12px;
`;

const Position = styled.h3`
  font-family: 'Outfit', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

const Company = styled.div`
  font-size: 17px;
  color: #0891b2;
  font-weight: 600;
  margin-top: 6px;
  font-family: 'Outfit', sans-serif;
`;

const WorkDate = styled.div`
  font-size: 15px;
  color: #64748b;
  font-weight: 500;
  white-space: nowrap;
`;

const WorkSummary = styled.p`
  margin: 16px 0;
  color: #334155;
  line-height: 1.75;
  font-size: 15px;
`;

const ImpactLabel = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #0891b2;
  margin: 20px 0 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Outfit', sans-serif;
`;

const Highlights = styled.ul`
  margin: 0;
  padding-left: 0;
  list-style: none;

  li {
    margin: 10px 0;
    color: #334155;
    line-height: 1.75;
    position: relative;
    padding-left: 28px;

    &:before {
      content: '▸';
      position: absolute;
      left: 0;
      color: #0891b2;
      font-weight: bold;
      font-size: 18px;
    }
  }
`;

const EducationItem = styled.div`
  margin-bottom: 24px;
  padding: 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  border-left: 4px solid #0891b2;

  &:last-child {
    margin-bottom: 0;
  }

  @media print {
    background: #f9fafb;
  }
`;

const Institution = styled.h3`
  font-family: 'Outfit', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
`;

const Degree = styled.div`
  font-size: 16px;
  color: #334155;
  margin-bottom: 6px;
  font-weight: 500;
`;

const EducationDate = styled.div`
  font-size: 14px;
  color: #64748b;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
`;

const SkillCard = styled.div`
  padding: 24px;
  background: linear-gradient(135deg, #f0fdfa 0%, #ecfeff 100%);
  border-radius: 12px;
  border: 2px solid #a5f3fc;
  transition: all 0.3s ease;

  &:hover {
    border-color: #0891b2;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(8, 145, 178, 0.15);
  }

  @media print {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    transform: none !important;
  }
`;

const SkillName = styled.h4`
  font-family: 'Outfit', sans-serif;
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 12px 0;
`;

const SkillTags = styled.div`
  font-size: 14px;
  color: #334155;
  line-height: 1.7;
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
      <Container>
        <Header>
          <Name>{basics.name}</Name>
          {basics.label && <Label>{basics.label}</Label>}
          <HeaderContactInfo basics={basics} />
          {basics.summary && <Summary>{basics.summary}</Summary>}
        </Header>

        <Content>
          {work?.length > 0 && (
            <Section>
              <StyledSectionTitle>Professional Experience</StyledSectionTitle>
              {work.map((job, index) => (
                <WorkItem key={index}>
                  <WorkHeader>
                    <div>
                      <Position>{job.position}</Position>
                      {job.name && <Company>{job.name}</Company>}
                    </div>
                    <WorkDate>
                      <DateRange
                        startDate={job.startDate}
                        endDate={job.endDate}
                      />
                    </WorkDate>
                  </WorkHeader>
                  {job.summary && <WorkSummary>{job.summary}</WorkSummary>}
                  {job.highlights?.length > 0 && (
                    <>
                      <ImpactLabel>Key Impact & Achievements</ImpactLabel>
                      <Highlights>
                        {job.highlights.map((highlight, i) => (
                          <li key={i}>{highlight}</li>
                        ))}
                      </Highlights>
                    </>
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
                  <EducationDate>
                    <DateRange
                      startDate={edu.startDate}
                      endDate={edu.endDate}
                    />
                  </EducationDate>
                </EducationItem>
              ))}
            </Section>
          )}

          {skills?.length > 0 && (
            <Section>
              <StyledSectionTitle>Skills & Expertise</StyledSectionTitle>
              <SkillsGrid>
                {skills.map((skill, index) => (
                  <SkillCard key={index}>
                    <SkillName>{skill.name}</SkillName>
                    {skill.keywords?.length > 0 && (
                      <SkillTags>{skill.keywords.join(' • ')}</SkillTags>
                    )}
                  </SkillCard>
                ))}
              </SkillsGrid>
            </Section>
          )}

          {projects?.length > 0 && (
            <Section>
              <StyledSectionTitle>Key Projects</StyledSectionTitle>
              {projects.map((project, index) => (
                <WorkItem key={index}>
                  <Position>{project.name}</Position>
                  {project.description && (
                    <WorkSummary>{project.description}</WorkSummary>
                  )}
                  {project.highlights?.length > 0 && (
                    <>
                      <ImpactLabel>Project Outcomes</ImpactLabel>
                      <Highlights>
                        {project.highlights.map((highlight, i) => (
                          <li key={i}>{highlight}</li>
                        ))}
                      </Highlights>
                    </>
                  )}
                </WorkItem>
              ))}
            </Section>
          )}

          {volunteer?.length > 0 && (
            <Section>
              <StyledSectionTitle>Volunteer Experience</StyledSectionTitle>
              {volunteer.map((vol, index) => (
                <WorkItem key={index}>
                  <WorkHeader>
                    <div>
                      <Position>{vol.position}</Position>
                      {vol.organization && (
                        <Company>{vol.organization}</Company>
                      )}
                    </div>
                    {(vol.startDate || vol.endDate) && (
                      <WorkDate>
                        <DateRange
                          startDate={vol.startDate}
                          endDate={vol.endDate}
                        />
                      </WorkDate>
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
              <StyledSectionTitle>Awards & Recognition</StyledSectionTitle>
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
                  {pub.publisher && (
                    <Degree>Published by {pub.publisher}</Degree>
                  )}
                  {pub.releaseDate && (
                    <EducationDate>{pub.releaseDate}</EducationDate>
                  )}
                  {pub.summary && <WorkSummary>{pub.summary}</WorkSummary>}
                </EducationItem>
              ))}
            </Section>
          )}

          {languages?.length > 0 && (
            <Section>
              <StyledSectionTitle>Languages</StyledSectionTitle>
              <SkillsGrid>
                {languages.map((lang, index) => (
                  <SkillCard key={index}>
                    <SkillName>{lang.language}</SkillName>
                    {lang.fluency && <SkillTags>{lang.fluency}</SkillTags>}
                  </SkillCard>
                ))}
              </SkillsGrid>
            </Section>
          )}

          {interests?.length > 0 && (
            <Section>
              <StyledSectionTitle>Interests</StyledSectionTitle>
              <SkillsGrid>
                {interests.map((interest, index) => (
                  <SkillCard key={index}>
                    <SkillName>{interest.name}</SkillName>
                    {interest.keywords?.length > 0 && (
                      <SkillTags>{interest.keywords.join(' • ')}</SkillTags>
                    )}
                  </SkillCard>
                ))}
              </SkillsGrid>
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
        </Content>
      </Container>
    </Layout>
  );
}

export default Resume;
