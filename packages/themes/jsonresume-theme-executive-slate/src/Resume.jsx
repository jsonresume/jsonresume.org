import React from 'react';
import styled from 'styled-components';
import { Section, SectionTitle, DateRange, ContactInfo } from '@resume/core';

const Layout = styled.div`
  background: #0f172a;
  min-height: 100vh;
  padding: 60px 40px;
  font-family: 'Merriweather', 'Georgia', serif;

  @media print {
    background: white;
    padding: 40px;
  }
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  padding: 70px;
  border-radius: 20px;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media print {
    background: white;
    box-shadow: none;
    border: none;
    padding: 40px;
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 60px;
  padding-bottom: 50px;
  border-bottom: 2px solid rgba(148, 163, 184, 0.3);
`;

const Name = styled.h1`
  font-size: 56px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 16px 0;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  @media print {
    color: #000;
    text-shadow: none;
  }
`;

const Label = styled.div`
  font-size: 20px;
  color: #94a3b8;
  font-weight: 500;
  margin-bottom: 28px;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-family: 'Inter', sans-serif;
`;

const Summary = styled.p`
  font-size: 17px;
  line-height: 1.9;
  color: #cbd5e1;
  margin: 36px auto 0;
  max-width: 700px;

  @media print {
    color: #333;
  }
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-size: 28px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 56px 0 32px 0;
  padding-bottom: 16px;
  border-bottom: 3px solid #3b82f6;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-family: 'Inter', sans-serif;

  @media print {
    color: #000;
  }
`;

const WorkItem = styled.div`
  margin-bottom: 40px;
  padding: 32px;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s;

  &:hover {
    background: rgba(30, 41, 59, 0.7);
    border-color: #3b82f6;
    transform: translateX(8px);
  }

  @media print {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
  }
`;

const Position = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 8px 0;

  @media print {
    color: #000;
  }
`;

const Company = styled.div`
  font-size: 18px;
  color: #60a5fa;
  font-weight: 600;
  margin-bottom: 12px;
  font-family: 'Inter', sans-serif;
`;

const DateText = styled.div`
  font-size: 15px;
  color: #94a3b8;
  margin-bottom: 16px;
  font-family: 'Inter', sans-serif;
`;

const WorkSummary = styled.p`
  color: #cbd5e1;
  line-height: 1.8;
  font-size: 16px;
  margin: 16px 0;

  @media print {
    color: #333;
  }
`;

const Highlights = styled.ul`
  margin: 20px 0 0 0;
  padding-left: 28px;
  list-style: none;

  li {
    margin: 12px 0;
    color: #cbd5e1;
    line-height: 1.8;
    position: relative;

    &:before {
      content: '▸';
      position: absolute;
      left: -28px;
      color: #3b82f6;
      font-size: 20px;
    }
  }

  @media print {
    li {
      color: #333;
    }
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
`;

const SkillCard = styled.div`
  padding: 24px;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.2);

  @media print {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
  }
`;

const SkillName = styled.h4`
  font-size: 18px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 14px 0;
  font-family: 'Inter', sans-serif;

  @media print {
    color: #000;
  }
`;

const SkillList = styled.div`
  font-size: 15px;
  color: #94a3b8;
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
          <ContactInfo basics={basics} />
          {basics.summary && <Summary>{basics.summary}</Summary>}
        </Header>

        {work?.length > 0 && (
          <Section>
            <StyledSectionTitle>Professional Experience</StyledSectionTitle>
            {work.map((job, i) => (
              <WorkItem key={i}>
                <Position>{job.position}</Position>
                {job.name && <Company>{job.name}</Company>}
                <DateText>
                  <DateRange startDate={job.startDate} endDate={job.endDate} />
                </DateText>
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
            <StyledSectionTitle>Core Competencies</StyledSectionTitle>
            <SkillsGrid>
              {skills.map((skill, i) => (
                <SkillCard key={i}>
                  <SkillName>{skill.name}</SkillName>
                  {skill.keywords?.length > 0 && (
                    <SkillList>{skill.keywords.join(' • ')}</SkillList>
                  )}
                </SkillCard>
              ))}
            </SkillsGrid>
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
                <DateText>
                  <DateRange startDate={e.startDate} endDate={e.endDate} />
                </DateText>
              </WorkItem>
            ))}
          </Section>
        )}
        {projects?.length > 0 && (
          <Section>
            <StyledSectionTitle>Notable Projects</StyledSectionTitle>
            {projects.map((p, i) => (
              <WorkItem key={i}>
                <Position>{p.name}</Position>
                <WorkSummary>{p.description}</WorkSummary>
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
        {volunteer?.length > 0 && (
          <Section>
            <StyledSectionTitle>Volunteer</StyledSectionTitle>
            {volunteer.map((v, i) => (
              <WorkItem key={i}>
                <Position>{v.position}</Position>
                <Company>{v.organization}</Company>
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
                <SkillCard key={i}>
                  <SkillName>{l.language}</SkillName>
                  <SkillList>{l.fluency}</SkillList>
                </SkillCard>
              ))}
            </SkillsGrid>
          </Section>
        )}
        {interests?.length > 0 && (
          <Section>
            <StyledSectionTitle>Interests</StyledSectionTitle>
            <SkillsGrid>
              {interests.map((int, i) => (
                <SkillCard key={i}>
                  <SkillName>{int.name}</SkillName>
                  {int.keywords?.length > 0 && (
                    <SkillList>{int.keywords.join(' • ')}</SkillList>
                  )}
                </SkillCard>
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
      </Container>
    </Layout>
  );
}

export default Resume;
