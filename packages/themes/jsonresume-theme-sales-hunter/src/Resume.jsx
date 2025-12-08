import React from 'react';
import styled from 'styled-components';
import {
  Section,
  SectionTitle,
  DateRange,
  ContactInfo,
} from '@jsonresume/core';

const Layout = styled.div`
  max-width: 850px;
  margin: 0 auto;
  padding: 50px 40px;
  background: white;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  color: #1f2937;

  @media print {
    padding: 40px;
  }
`;

const Header = styled.header`
  margin-bottom: 40px;
  padding-bottom: 25px;
  border-bottom: 3px solid #16a34a;
`;

const Name = styled.h1`
  font-size: 48px;
  font-weight: 800;
  color: #111827;
  margin: 0 0 6px 0;
  letter-spacing: -0.8px;
  text-transform: uppercase;
`;

const Label = styled.div`
  font-size: 18px;
  color: #16a34a;
  margin-bottom: 18px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StyledContactInfo = styled(ContactInfo)`
  font-size: 14px;

  a {
    font-size: 14px;
    color: #16a34a;
    font-weight: 600;
  }
`;

const Summary = styled.p`
  font-size: 15px;
  line-height: 1.7;
  color: #4b5563;
  margin: 18px 0 0 0;
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-size: 22px;
  font-weight: 800;
  color: #111827;
  margin: 35px 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 3px solid #16a34a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const WorkItem = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 6px;
  border-left: 4px solid #16a34a;

  &:last-child {
    margin-bottom: 0;
  }
`;

const WorkHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
  gap: 16px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
`;

const Position = styled.h3`
  font-size: 19px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const Company = styled.div`
  font-size: 17px;
  color: #16a34a;
  font-weight: 700;
  margin-top: 4px;
`;

const DateText = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-weight: 600;
  white-space: nowrap;
`;

const WorkSummary = styled.p`
  margin: 12px 0;
  color: #4b5563;
  line-height: 1.7;
  font-size: 14px;
`;

const Highlights = styled.ul`
  margin: 12px 0 0 0;
  padding-left: 0;
  list-style-type: none;

  li {
    margin: 10px 0;
    color: #1f2937;
    line-height: 1.7;
    padding-left: 28px;
    position: relative;
    font-size: 14px;
    font-weight: 600;

    &::before {
      content: '▶';
      position: absolute;
      left: 0;
      color: #16a34a;
      font-size: 12px;
      font-weight: 700;
    }

    strong {
      color: #16a34a;
      font-weight: 800;
      font-size: 15px;
    }
  }
`;

const EducationItem = styled.div`
  margin-bottom: 22px;
  padding: 18px;
  background: #f9fafb;
  border-radius: 6px;
  border-left: 4px solid #16a34a;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Institution = styled.h3`
  font-size: 17px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 6px 0;
`;

const Degree = styled.div`
  font-size: 15px;
  color: #4b5563;
  margin-bottom: 4px;
  font-weight: 600;
`;

const EducationDate = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-weight: 600;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

const SkillCategory = styled.div`
  padding: 16px;
  background: #16a34a;
  border-radius: 6px;
  color: white;
`;

const SkillName = styled.h4`
  font-size: 15px;
  font-weight: 800;
  color: white;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SkillTags = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.6;
  font-weight: 600;
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

  const enhanceHighlight = (text) => {
    return text.replace(
      /(\d+%|\$[\d,]+[KkMm]?|\d+[Xx])/g,
      '<strong>$1</strong>'
    );
  };

  return (
    <Layout>
      <Header>
        <Name>{basics.name}</Name>
        {basics.label && <Label>{basics.label}</Label>}
        <StyledContactInfo basics={basics} />
        {basics.summary && <Summary>{basics.summary}</Summary>}
      </Header>

      {work?.length > 0 && (
        <Section>
          <StyledSectionTitle>Experience</StyledSectionTitle>
          {work.map((job, index) => (
            <WorkItem key={index}>
              <WorkHeader>
                <div>
                  <Position>{job.position}</Position>
                  {job.name && <Company>{job.name}</Company>}
                </div>
                <DateText>
                  <DateRange startDate={job.startDate} endDate={job.endDate} />
                </DateText>
              </WorkHeader>
              {job.summary && <WorkSummary>{job.summary}</WorkSummary>}
              {job.highlights?.length > 0 && (
                <Highlights>
                  {job.highlights.map((highlight, i) => (
                    <li
                      key={i}
                      dangerouslySetInnerHTML={{
                        __html: enhanceHighlight(highlight),
                      }}
                    />
                  ))}
                </Highlights>
              )}
            </WorkItem>
          ))}
        </Section>
      )}

      {skills?.length > 0 && (
        <Section>
          <StyledSectionTitle>Skills</StyledSectionTitle>
          <SkillsGrid>
            {skills.map((skill, index) => (
              <SkillCategory key={index}>
                <SkillName>{skill.name}</SkillName>
                {skill.keywords?.length > 0 && (
                  <SkillTags>{skill.keywords.join(', ')}</SkillTags>
                )}
              </SkillCategory>
            ))}
          </SkillsGrid>
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
                    <li
                      key={i}
                      dangerouslySetInnerHTML={{
                        __html: enhanceHighlight(highlight),
                      }}
                    />
                  ))}
                </Highlights>
              )}
            </WorkItem>
          ))}
        </Section>
      )}

      {volunteer?.length > 0 && (
        <Section>
          <StyledSectionTitle>Volunteer</StyledSectionTitle>
          {volunteer.map((vol, index) => (
            <WorkItem key={index}>
              <WorkHeader>
                <div>
                  <Position>{vol.position}</Position>
                  {vol.organization && <Company>{vol.organization}</Company>}
                </div>
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
                    <li
                      key={i}
                      dangerouslySetInnerHTML={{
                        __html: enhanceHighlight(highlight),
                      }}
                    />
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

      {languages?.length > 0 && (
        <Section>
          <StyledSectionTitle>Languages</StyledSectionTitle>
          <SkillsGrid>
            {languages.map((lang, index) => (
              <SkillCategory key={index}>
                <SkillName>{lang.language}</SkillName>
                {lang.fluency && <SkillTags>{lang.fluency}</SkillTags>}
              </SkillCategory>
            ))}
          </SkillsGrid>
        </Section>
      )}

      {interests?.length > 0 && (
        <Section>
          <StyledSectionTitle>Interests</StyledSectionTitle>
          <SkillsGrid>
            {interests.map((interest, index) => (
              <SkillCategory key={index}>
                <SkillName>{interest.name}</SkillName>
                {interest.keywords?.length > 0 && (
                  <SkillTags>{interest.keywords.join(', ')}</SkillTags>
                )}
              </SkillCategory>
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
