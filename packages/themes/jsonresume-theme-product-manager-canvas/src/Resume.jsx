import React from 'react';
import styled from 'styled-components';
import { Section, SectionTitle, DateRange, ContactInfo } from '@resume/core';

const Layout = styled.div`
  max-width: 850px;
  margin: 0 auto;
  padding: 60px 40px;
  background: white;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  color: #1f2937;

  @media print {
    padding: 40px;
  }
`;

const Header = styled.header`
  margin-bottom: 50px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e5e7eb;
`;

const Name = styled.h1`
  font-size: 40px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
`;

const Label = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 20px;
`;

const Summary = styled.p`
  font-size: 15px;
  line-height: 1.8;
  color: #4b5563;
  margin: 20px 0 0 0;
  max-width: 700px;
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 48px 0 28px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #7c3aed;

  &:first-child {
    margin-top: 0;
  }
`;

const WorkItem = styled.div`
  margin-bottom: 40px;
  padding: 28px;
  background: #fafafa;
  border-radius: 8px;
  border-left: 4px solid #7c3aed;

  &:last-child {
    margin-bottom: 0;
  }

  @media print {
    background: #fafafa;
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
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const Company = styled.div`
  font-size: 17px;
  color: #7c3aed;
  font-weight: 600;
  margin-top: 6px;
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
  color: #7c3aed;
  margin: 20px 0 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Highlights = styled.ul`
  margin: 0;
  padding-left: 24px;
  list-style-type: disc;

  li {
    margin: 10px 0;
    color: #4b5563;
    line-height: 1.75;
    padding-left: 4px;
  }
`;

const EducationItem = styled.div`
  margin-bottom: 28px;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  border-left: 3px solid #7c3aed;

  &:last-child {
    margin-bottom: 0;
  }

  @media print {
    background: #fafafa;
  }
`;

const Institution = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 18px;
`;

const SkillCard = styled.div`
  padding: 18px;
  background: #fafafa;
  border-radius: 6px;
  border-left: 3px solid #7c3aed;

  @media print {
    background: #fafafa;
  }
`;

const SkillName = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 10px 0;
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
      <Header>
        <Name>{basics.name}</Name>
        {basics.label && <Label>{basics.label}</Label>}
        <ContactInfo basics={basics} />
        {basics.summary && <Summary>{basics.summary}</Summary>}
      </Header>

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
                  <DateRange startDate={job.startDate} endDate={job.endDate} />
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
                <DateRange startDate={edu.startDate} endDate={edu.endDate} />
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
                  {vol.organization && <Company>{vol.organization}</Company>}
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
              {pub.publisher && <Degree>Published by {pub.publisher}</Degree>}
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
    </Layout>
  );
}

export default Resume;
