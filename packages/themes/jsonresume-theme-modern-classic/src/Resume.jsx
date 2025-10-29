import React from 'react';
import styled from 'styled-components';
import { Section, SectionTitle, DateRange, ContactInfo } from '@resume/core';

const Layout = styled.div`
  max-width: 850px;
  margin: 0 auto;
  padding: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;

  @media print {
    background: white;
  }
`;

const Content = styled.div`
  background: white;
  margin: 40px;
  padding: 60px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  @media print {
    margin: 0;
    padding: 40px;
    box-shadow: none;
    border-radius: 0;
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 50px;
  padding-bottom: 40px;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
`;

const Name = styled.h1`
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 12px 0;
  letter-spacing: -1px;
`;

const Label = styled.div`
  font-size: 18px;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 24px;
  letter-spacing: 0.5px;
`;

const Summary = styled.p`
  font-size: 15px;
  line-height: 1.8;
  color: #475569;
  margin: 32px auto 0;
  max-width: 650px;
  text-align: center;
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 48px 0 28px 0;
  padding-bottom: 12px;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
`;

const WorkItem = styled.div`
  margin-bottom: 36px;
  padding: 28px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  border-left: 4px solid #667eea;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const WorkHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 12px;
`;

const Position = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const Company = styled.div`
  font-size: 16px;
  color: #667eea;
  font-weight: 600;
  margin-top: 4px;
`;

const WorkDate = styled.div`
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
  white-space: nowrap;
`;

const WorkSummary = styled.p`
  margin: 16px 0;
  color: #475569;
  line-height: 1.7;
  font-size: 15px;
`;

const Highlights = styled.ul`
  margin: 16px 0 0 0;
  padding-left: 24px;
  list-style: none;

  li {
    margin: 10px 0;
    color: #475569;
    line-height: 1.7;
    position: relative;
    padding-left: 12px;

    &:before {
      content: '→';
      position: absolute;
      left: -12px;
      color: #667eea;
      font-weight: bold;
    }
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

const SkillCategory = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 10px;
  border-left: 3px solid #667eea;
`;

const SkillName = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SkillTag = styled.span`
  padding: 6px 12px;
  background: white;
  color: #475569;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
      <Content>
        <Header>
          <Name>{basics.name}</Name>
          {basics.label && <Label>{basics.label}</Label>}
          <ContactInfo basics={basics} />
          {basics.summary && <Summary>{basics.summary}</Summary>}
        </Header>

        {work?.length > 0 && (
          <Section>
            <StyledSectionTitle>Experience</StyledSectionTitle>
            {work.map((job, i) => (
              <WorkItem key={i}>
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
                  <Highlights>
                    {job.highlights.map((h, j) => (
                      <li key={j}>{h}</li>
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
              {skills.map((skill, i) => (
                <SkillCategory key={i}>
                  <SkillName>{skill.name}</SkillName>
                  {skill.keywords?.length > 0 && (
                    <SkillTags>
                      {skill.keywords.map((k, j) => (
                        <SkillTag key={j}>{k}</SkillTag>
                      ))}
                    </SkillTags>
                  )}
                </SkillCategory>
              ))}
            </SkillsGrid>
          </Section>
        )}

        {projects?.length > 0 && (
          <Section>
            <StyledSectionTitle>Projects</StyledSectionTitle>
            {projects.map((p, i) => (
              <WorkItem key={i}>
                <Position>{p.name}</Position>
                {p.description && <WorkSummary>{p.description}</WorkSummary>}
                {p.highlights?.length > 0 && (
                  <Highlights>
                    {p.highlights.map((h, j) => (
                      <li key={j}>{h}</li>
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
            {education.map((e, i) => (
              <WorkItem key={i}>
                <Position>{e.institution}</Position>
                <Company>
                  {e.studyType} in {e.area}
                </Company>
                <WorkDate>
                  <DateRange startDate={e.startDate} endDate={e.endDate} />
                </WorkDate>
              </WorkItem>
            ))}
          </Section>
        )}

        {volunteer?.length > 0 && (
          <Section>
            <StyledSectionTitle>Volunteer</StyledSectionTitle>
            {volunteer.map((v, i) => (
              <WorkItem key={i}>
                <Position>{v.position}</Position>
                <Company>{v.organization}</Company>
                <WorkSummary>{v.summary}</WorkSummary>
              </WorkItem>
            ))}
          </Section>
        )}
        {awards?.length > 0 && (
          <Section>
            <StyledSectionTitle>Awards</StyledSectionTitle>
            {awards.map((a, i) => (
              <WorkItem key={i}>
                <Position>{a.title}</Position>
                <Company>{a.awarder}</Company>
              </WorkItem>
            ))}
          </Section>
        )}
        {publications?.length > 0 && (
          <Section>
            <StyledSectionTitle>Publications</StyledSectionTitle>
            {publications.map((p, i) => (
              <WorkItem key={i}>
                <Position>{p.name}</Position>
                <Company>{p.publisher}</Company>
              </WorkItem>
            ))}
          </Section>
        )}
        {languages?.length > 0 && (
          <Section>
            <StyledSectionTitle>Languages</StyledSectionTitle>
            <SkillsGrid>
              {languages.map((l, i) => (
                <SkillCategory key={i}>
                  <SkillName>{l.language}</SkillName>
                  <SkillTags>
                    <SkillTag>{l.fluency}</SkillTag>
                  </SkillTags>
                </SkillCategory>
              ))}
            </SkillsGrid>
          </Section>
        )}
        {interests?.length > 0 && (
          <Section>
            <StyledSectionTitle>Interests</StyledSectionTitle>
            <SkillsGrid>
              {interests.map((int, i) => (
                <SkillCategory key={i}>
                  <SkillName>{int.name}</SkillName>
                  {int.keywords?.length > 0 && (
                    <SkillTags>
                      {int.keywords.map((k, j) => (
                        <SkillTag key={j}>{k}</SkillTag>
                      ))}
                    </SkillTags>
                  )}
                </SkillCategory>
              ))}
            </SkillsGrid>
          </Section>
        )}
        {references?.length > 0 && (
          <Section>
            <StyledSectionTitle>References</StyledSectionTitle>
            {references.map((r, i) => (
              <WorkItem key={i}>
                <Position>{r.name}</Position>
                <WorkSummary>{r.reference}</WorkSummary>
              </WorkItem>
            ))}
          </Section>
        )}
      </Content>
    </Layout>
  );
}

export default Resume;
