import React from 'react';
import styled from 'styled-components';
import {
  Section,
  SectionTitle,
  DateRange,
  ContactInfo,
} from '@jsonresume/core';

const Layout = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 50px 40px;
  background: #ffffff;
  font-family: 'Merriweather', Georgia, serif;
  font-size: 12pt;
  color: #111827;
  line-height: 1.6;

  @media print {
    padding: 30px;
  }
`;

const Header = styled.header`
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #6b7280;
  text-align: center;
`;

const Name = styled.h1`
  font-size: 28pt;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
`;

const Label = styled.div`
  font-size: 14pt;
  color: #1f2937;
  margin-bottom: 16px;
  font-weight: 400;
  font-style: italic;
`;

const StyledContactInfo = styled(ContactInfo)`
  font-size: 11pt;
  color: #1f2937;
  justify-content: center;

  a {
    font-size: 11pt;
    color: #1f2937;
    text-decoration: underline;
  }
`;

const Summary = styled.p`
  font-size: 12pt;
  line-height: 1.6;
  color: #1f2937;
  margin: 20px 0 0 0;
  text-align: left;
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-size: 16pt;
  font-weight: 700;
  color: #111827;
  margin: 32px 0 16px 0;
  padding-bottom: 6px;
  border-bottom: 2px solid #111827;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const PublicationItem = styled.div`
  margin-bottom: 20px;
  padding-left: 24px;
  text-indent: -24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const PublicationTitle = styled.span`
  font-weight: 700;
  color: #111827;
`;

const PublicationMeta = styled.span`
  color: #1f2937;
  font-style: italic;
`;

const PublicationDate = styled.span`
  color: #6b7280;
`;

const AwardItem = styled.div`
  margin-bottom: 16px;
  padding-left: 20px;
  border-left: 3px solid #9ca3af;

  &:last-child {
    margin-bottom: 0;
  }
`;

const AwardTitle = styled.h3`
  font-size: 13pt;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
`;

const AwardAwarder = styled.div`
  font-size: 11pt;
  color: #1f2937;
  font-style: italic;
  margin-bottom: 4px;
`;

const AwardDate = styled.div`
  font-size: 11pt;
  color: #6b7280;
  margin-bottom: 8px;
`;

const AwardSummary = styled.p`
  margin: 0;
  font-size: 11pt;
  color: #1f2937;
  line-height: 1.5;
`;

const WorkItem = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const WorkHeader = styled.div`
  margin-bottom: 8px;
`;

const Position = styled.h3`
  font-size: 13pt;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
`;

const Company = styled.div`
  font-size: 12pt;
  color: #1f2937;
  font-style: italic;
  margin-bottom: 4px;
`;

const DateText = styled.div`
  font-size: 11pt;
  color: #6b7280;
  margin-bottom: 8px;
`;

const WorkSummary = styled.p`
  margin: 8px 0;
  color: #1f2937;
  line-height: 1.5;
  font-size: 11pt;
`;

const Highlights = styled.ul`
  margin: 8px 0 0 0;
  padding-left: 20px;
  list-style-type: disc;

  li {
    margin: 4px 0;
    color: #1f2937;
    line-height: 1.5;
    font-size: 11pt;
  }
`;

const EducationItem = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Institution = styled.h3`
  font-size: 13pt;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
`;

const Degree = styled.div`
  font-size: 12pt;
  color: #1f2937;
  margin-bottom: 4px;
`;

const EducationDate = styled.div`
  font-size: 11pt;
  color: #6b7280;
`;

const SkillsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SkillItem = styled.div`
  display: flex;
  gap: 8px;
`;

const SkillName = styled.span`
  font-weight: 700;
  color: #111827;
  font-size: 12pt;
  min-width: 120px;
`;

const SkillKeywords = styled.span`
  color: #1f2937;
  font-size: 11pt;
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
        <StyledContactInfo basics={basics} />
        {basics.summary && <Summary>{basics.summary}</Summary>}
      </Header>

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

      {publications?.length > 0 && (
        <Section>
          <StyledSectionTitle>Publications</StyledSectionTitle>
          {publications.map((pub, index) => (
            <PublicationItem key={index}>
              <PublicationTitle>{pub.name}. </PublicationTitle>
              {pub.publisher && (
                <PublicationMeta>{pub.publisher}. </PublicationMeta>
              )}
              {pub.releaseDate && (
                <PublicationDate>({pub.releaseDate})</PublicationDate>
              )}
              {pub.summary && <WorkSummary>{pub.summary}</WorkSummary>}
            </PublicationItem>
          ))}
        </Section>
      )}

      {awards?.length > 0 && (
        <Section>
          <StyledSectionTitle>Awards & Honors</StyledSectionTitle>
          {awards.map((award, index) => (
            <AwardItem key={index}>
              <AwardTitle>{award.title}</AwardTitle>
              {award.awarder && <AwardAwarder>{award.awarder}</AwardAwarder>}
              {award.date && <AwardDate>{award.date}</AwardDate>}
              {award.summary && <AwardSummary>{award.summary}</AwardSummary>}
            </AwardItem>
          ))}
        </Section>
      )}

      {work?.length > 0 && (
        <Section>
          <StyledSectionTitle>Professional Experience</StyledSectionTitle>
          {work.map((job, index) => (
            <WorkItem key={index}>
              <WorkHeader>
                <Position>{job.position}</Position>
                {job.name && <Company>{job.name}</Company>}
                <DateText>
                  <DateRange startDate={job.startDate} endDate={job.endDate} />
                </DateText>
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
          <StyledSectionTitle>Research Projects</StyledSectionTitle>
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

      {skills?.length > 0 && (
        <Section>
          <StyledSectionTitle>Skills</StyledSectionTitle>
          <SkillsList>
            {skills.map((skill, index) => (
              <SkillItem key={index}>
                <SkillName>{skill.name}:</SkillName>
                {skill.keywords?.length > 0 && (
                  <SkillKeywords>{skill.keywords.join(', ')}</SkillKeywords>
                )}
              </SkillItem>
            ))}
          </SkillsList>
        </Section>
      )}

      {volunteer?.length > 0 && (
        <Section>
          <StyledSectionTitle>Service & Leadership</StyledSectionTitle>
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

      {languages?.length > 0 && (
        <Section>
          <StyledSectionTitle>Languages</StyledSectionTitle>
          <SkillsList>
            {languages.map((lang, index) => (
              <SkillItem key={index}>
                <SkillName>{lang.language}:</SkillName>
                {lang.fluency && <SkillKeywords>{lang.fluency}</SkillKeywords>}
              </SkillItem>
            ))}
          </SkillsList>
        </Section>
      )}

      {interests?.length > 0 && (
        <Section>
          <StyledSectionTitle>Research Interests</StyledSectionTitle>
          <SkillsList>
            {interests.map((interest, index) => (
              <SkillItem key={index}>
                <SkillName>{interest.name}</SkillName>
                {interest.keywords?.length > 0 && (
                  <SkillKeywords>{interest.keywords.join(', ')}</SkillKeywords>
                )}
              </SkillItem>
            ))}
          </SkillsList>
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
