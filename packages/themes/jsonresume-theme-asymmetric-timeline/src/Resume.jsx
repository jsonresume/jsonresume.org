import React from 'react';
import styled from 'styled-components';
import {
  Section,
  SectionTitle,
  ContactInfo,
  DateRange,
} from '@jsonresume/core';

// Layout
const Layout = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 40px;
  background: white;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  color: #1e293b;

  @media print {
    padding: 40px;
  }
`;

// Header components
const HeaderContainer = styled.header`
  text-align: center;
  margin-bottom: 60px;
  padding-bottom: 40px;
  border-bottom: 1px solid #e2e8f0;
`;

const Name = styled.h1`
  font-family: 'Lora', Georgia, serif;
  font-size: 48px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
`;

const Label = styled.div`
  font-size: 18px;
  font-weight: 300;
  color: #64748b;
  margin-bottom: 24px;
  letter-spacing: 0.5px;
`;

const StyledContactInfo = styled(ContactInfo)`
  font-size: 14px;
  font-weight: 300;
  justify-content: center;

  a {
    font-size: 14px;
  }
`;

const Summary = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: #475569;
  margin: 24px auto 0;
  max-width: 700px;
  font-weight: 300;
`;

// Section styled components
const TimelineSection = styled(Section)`
  position: relative;
  padding-left: 0;
  padding-top: 40px;

  /* Central timeline line */
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 80px;
    bottom: 0;
    width: 4px;
    background: #334155;
    transform: translateX(-50%);
    z-index: 0;
  }

  @media print {
    &::before {
      background: #94a3b8;
    }
  }
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-family: 'Lora', Georgia, serif;
  font-size: 28px;
  font-weight: 600;
  color: #0f172a;
  margin: 50px 0 40px 0;
  text-align: center;
`;

const GridSection = styled(Section)`
  margin-top: 50px;
`;

const SimpleSection = styled(Section)`
  margin-top: 40px;
`;

// Timeline item components
const TimelineItem = styled.div`
  position: relative;
  margin-bottom: 60px;
  display: flex;
  justify-content: ${(props) => (props.$isLeft ? 'flex-start' : 'flex-end')};

  /* Timeline dot */
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 20px;
    width: 20px;
    height: 20px;
    background: white;
    border: 5px solid #334155;
    border-radius: 50%;
    transform: translateX(-50%);
    z-index: 3;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  /* Connector line from dot to content */
  &::after {
    content: '';
    position: absolute;
    top: 30px;
    width: calc(50% - 50px);
    height: 3px;
    background: #94a3b8;
    z-index: 1;
    ${(props) =>
      props.$isLeft
        ? `
      left: 40px;
    `
        : `
      right: 40px;
    `}
  }

  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-left: 40px;

    &::before {
      left: 0;
      transform: none;
    }

    &::after {
      left: 16px;
      width: 24px;
    }
  }
`;

const TimelineContent = styled.div`
  width: calc(50% - 60px);
  padding: 28px 32px;
  background: white;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  border-left: 5px solid #334155;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 2;
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
    padding: 20px 24px;
  }
`;

const Position = styled.h3`
  font-family: 'Lora', Georgia, serif;
  font-size: 22px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 8px 0;
  line-height: 1.3;
`;

const Company = styled.div`
  font-size: 16px;
  color: #334155;
  font-weight: 500;
  margin-bottom: 8px;
`;

const DateText = styled.div`
  font-size: 13px;
  font-weight: 300;
  color: #64748b;
  margin-bottom: 16px;
  letter-spacing: 0.3px;
`;

const ItemSummary = styled.p`
  margin: 12px 0;
  color: #475569;
  line-height: 1.7;
  font-size: 15px;
  font-weight: 300;
`;

const Highlights = styled.ul`
  margin: 12px 0 0 0;
  padding-left: 20px;
  list-style-type: disc;

  li {
    margin: 8px 0;
    color: #475569;
    line-height: 1.7;
    padding-left: 4px;
    font-weight: 300;
  }
`;

// Simple item components
const SimpleItem = styled.div`
  margin-bottom: 28px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 6px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SimpleTitle = styled.h3`
  font-family: 'Lora', Georgia, serif;
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.div`
  font-size: 15px;
  color: #475569;
  margin-bottom: 6px;
`;

// Skills grid components
const SkillsGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const SkillCategory = styled.div`
  padding: 20px;
  background: white;
  border-radius: 6px;
  border: 2px solid #cbd5e1;
  border-left: 4px solid #334155;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const SkillName = styled.h4`
  font-size: 16px;
  font-weight: 500;
  color: #0f172a;
  margin: 0 0 10px 0;
`;

const SkillTags = styled.div`
  font-size: 14px;
  font-weight: 300;
  color: #64748b;
  line-height: 1.6;
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
      <HeaderContainer>
        <Name>{basics.name}</Name>
        {basics.label && <Label>{basics.label}</Label>}
        <StyledContactInfo basics={basics} />
        {basics.summary && <Summary>{basics.summary}</Summary>}
      </HeaderContainer>

      {work?.length > 0 && (
        <TimelineSection>
          <StyledSectionTitle>Experience</StyledSectionTitle>
          {work.map((job, index) => (
            <TimelineItem key={index} $isLeft={index % 2 === 0}>
              <TimelineContent>
                <Position>{job.position}</Position>
                {job.name && <Company>{job.name}</Company>}
                <DateText>
                  <DateRange startDate={job.startDate} endDate={job.endDate} />
                </DateText>
                {job.summary && <ItemSummary>{job.summary}</ItemSummary>}
                {job.highlights?.length > 0 && (
                  <Highlights>
                    {job.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </Highlights>
                )}
              </TimelineContent>
            </TimelineItem>
          ))}
        </TimelineSection>
      )}

      {education?.length > 0 && (
        <TimelineSection>
          <StyledSectionTitle>Education</StyledSectionTitle>
          {education.map((edu, index) => (
            <TimelineItem key={index} $isLeft={index % 2 === 0}>
              <TimelineContent>
                <Position>{edu.institution}</Position>
                <Company>
                  {edu.studyType} in {edu.area}
                  {edu.score && ` • ${edu.score}`}
                </Company>
                <DateText>
                  <DateRange startDate={edu.startDate} endDate={edu.endDate} />
                </DateText>
                {edu.summary && <ItemSummary>{edu.summary}</ItemSummary>}
                {edu.highlights?.length > 0 && (
                  <Highlights>
                    {edu.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </Highlights>
                )}
              </TimelineContent>
            </TimelineItem>
          ))}
        </TimelineSection>
      )}

      {projects?.length > 0 && (
        <SimpleSection>
          <StyledSectionTitle>Projects</StyledSectionTitle>
          {projects.map((project, index) => (
            <SimpleItem key={index}>
              <SimpleTitle>{project.name}</SimpleTitle>
              {project.summary && <ItemSummary>{project.summary}</ItemSummary>}
              {project.description && (
                <ItemSummary>{project.description}</ItemSummary>
              )}
              {project.highlights?.length > 0 && (
                <Highlights>
                  {project.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </Highlights>
              )}
            </SimpleItem>
          ))}
        </SimpleSection>
      )}

      {skills?.length > 0 && (
        <GridSection>
          <StyledSectionTitle>Skills</StyledSectionTitle>
          <SkillsGridContainer>
            {skills.map((skill, index) => (
              <SkillCategory key={index}>
                <SkillName>{skill.name}</SkillName>
                {skill.keywords?.length > 0 && (
                  <SkillTags>{skill.keywords.join(', ')}</SkillTags>
                )}
              </SkillCategory>
            ))}
          </SkillsGridContainer>
        </GridSection>
      )}

      {volunteer?.length > 0 && (
        <SimpleSection>
          <StyledSectionTitle>Volunteer</StyledSectionTitle>
          {volunteer.map((vol, index) => (
            <SimpleItem key={index}>
              <SimpleTitle>{vol.position}</SimpleTitle>
              {vol.organization && <Subtitle>{vol.organization}</Subtitle>}
              {(vol.startDate || vol.endDate) && (
                <DateText>
                  <DateRange startDate={vol.startDate} endDate={vol.endDate} />
                </DateText>
              )}
              {vol.summary && <ItemSummary>{vol.summary}</ItemSummary>}
              {vol.highlights?.length > 0 && (
                <Highlights>
                  {vol.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </Highlights>
              )}
            </SimpleItem>
          ))}
        </SimpleSection>
      )}

      {awards?.length > 0 && (
        <SimpleSection>
          <StyledSectionTitle>Awards</StyledSectionTitle>
          {awards.map((award, index) => (
            <SimpleItem key={index}>
              <SimpleTitle>{award.title}</SimpleTitle>
              {award.awarder && <Subtitle>Awarded by {award.awarder}</Subtitle>}
              {award.date && <DateText>{award.date}</DateText>}
              {award.summary && <ItemSummary>{award.summary}</ItemSummary>}
            </SimpleItem>
          ))}
        </SimpleSection>
      )}

      {publications?.length > 0 && (
        <SimpleSection>
          <StyledSectionTitle>Publications</StyledSectionTitle>
          {publications.map((pub, index) => (
            <SimpleItem key={index}>
              <SimpleTitle>{pub.name}</SimpleTitle>
              {pub.publisher && (
                <Subtitle>Published by {pub.publisher}</Subtitle>
              )}
              {pub.releaseDate && <DateText>{pub.releaseDate}</DateText>}
              {pub.summary && <ItemSummary>{pub.summary}</ItemSummary>}
            </SimpleItem>
          ))}
        </SimpleSection>
      )}

      {languages?.length > 0 && (
        <GridSection>
          <StyledSectionTitle>Languages</StyledSectionTitle>
          <SkillsGridContainer>
            {languages.map((language, index) => (
              <SkillCategory key={index}>
                <SkillName>{language.language}</SkillName>
                {language.fluency && <SkillTags>{language.fluency}</SkillTags>}
              </SkillCategory>
            ))}
          </SkillsGridContainer>
        </GridSection>
      )}

      {interests?.length > 0 && (
        <GridSection>
          <StyledSectionTitle>Interests</StyledSectionTitle>
          <SkillsGridContainer>
            {interests.map((interest, index) => (
              <SkillCategory key={index}>
                <SkillName>{interest.name}</SkillName>
                {interest.keywords?.length > 0 && (
                  <SkillTags>{interest.keywords.join(', ')}</SkillTags>
                )}
              </SkillCategory>
            ))}
          </SkillsGridContainer>
        </GridSection>
      )}

      {references?.length > 0 && (
        <SimpleSection>
          <StyledSectionTitle>References</StyledSectionTitle>
          {references.map((ref, index) => (
            <SimpleItem key={index}>
              <SimpleTitle>{ref.name}</SimpleTitle>
              {ref.reference && <ItemSummary>{ref.reference}</ItemSummary>}
            </SimpleItem>
          ))}
        </SimpleSection>
      )}
    </Layout>
  );
}

export default Resume;
