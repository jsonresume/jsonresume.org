import styled, { createGlobalStyle } from 'styled-components';
import { formatDateRange } from '@resume/core';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --resume-color-primary: #0f172a;
    --resume-color-secondary: #475569;
    --resume-color-accent: #0ea5e9;
    --resume-color-accent-dark: #0284c7;
    --resume-color-border: #e2e8f0;
    --resume-color-bg: #ffffff;
    --resume-font-geometric: 'DM Sans', 'Inter', 'Helvetica Neue', Arial, sans-serif;
  }

  body {
    font-family: var(--resume-font-geometric);
    font-size: 11px;
    line-height: 1.5;
    color: var(--resume-color-primary);
    background: var(--resume-color-bg);
    padding: 0;
  }

  @media print {
    body {
      padding: 0;
    }
  }
`;

const Container = styled.div`
  max-width: 750px;
  margin: 0 auto;
  padding: 32px 40px;

  @media print {
    padding: 16px;
  }

  @media (max-width: 600px) {
    padding: 20px;
  }
`;

const Header = styled.header`
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--resume-color-accent);
`;

const Name = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: var(--resume-color-primary);
  margin-bottom: 4px;
  letter-spacing: -0.03em;
  text-transform: uppercase;
`;

const Label = styled.div`
  font-size: 13px;
  color: var(--resume-color-accent);
  font-weight: 600;
  margin-bottom: 10px;
  letter-spacing: 0.02em;
`;

const Contact = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 10px;
  color: var(--resume-color-secondary);
  font-weight: 500;

  a {
    color: var(--resume-color-accent);
    text-decoration: none;
  }
`;

const Summary = styled.p`
  margin-top: 12px;
  font-size: 11px;
  line-height: 1.6;
  color: var(--resume-color-secondary);
`;

const Section = styled.section`
  margin-bottom: 24px;

  @media print {
    page-break-inside: avoid;
  }
`;

const SectionTitle = styled.h2`
  font-size: 14px;
  font-weight: 700;
  color: var(--resume-color-primary);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--resume-color-border);
  padding-bottom: 4px;
`;

const Item = styled.div`
  margin-bottom: 16px;
  padding-left: 0;

  @media print {
    page-break-inside: avoid;
  }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 3px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ItemTitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: var(--resume-color-primary);
`;

const ItemSubtitle = styled.div`
  font-size: 11px;
  color: var(--resume-color-secondary);
  margin-bottom: 2px;
  font-weight: 600;
`;

const ItemMeta = styled.div`
  display: flex;
  gap: 12px;
  font-size: 10px;
  color: var(--resume-color-secondary);
  margin-bottom: 6px;
  font-weight: 500;
`;

const Description = styled.p`
  margin-bottom: 6px;
  color: var(--resume-color-secondary);
  line-height: 1.5;
  font-size: 10px;
`;

const Highlights = styled.ul`
  list-style: none;
  margin-top: 4px;

  li {
    position: relative;
    padding-left: 12px;
    margin-bottom: 3px;
    color: var(--resume-color-secondary);
    font-size: 10px;
    line-height: 1.5;

    &::before {
      content: '▪';
      position: absolute;
      left: 0;
      color: var(--resume-color-accent);
      font-weight: 700;
    }

    strong,
    b {
      color: var(--resume-color-primary);
      font-weight: 700;
    }
  }
`;

const SkillGroup = styled.div`
  margin-bottom: 10px;

  strong {
    display: block;
    margin-bottom: 6px;
    color: var(--resume-color-primary);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }
`;

const BadgeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 3px;
  font-size: 9px;
  font-weight: 600;
  background: transparent;
  color: var(--resume-color-accent);
  border: 1px solid var(--resume-color-accent);
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

// Bold numbers and percentages for data-driven emphasis
function boldNumbers(text) {
  if (!text) return text;
  // Match: $1.5M, 42%, 1,200+, 99.9%, etc.
  // Unified regex to avoid nested <strong> tags
  return text.replace(
    /(\$)?(\d+(?:,\d{3})*(?:\.\d+)?)([KkMmBb])?([+\-])?(%)?/g,
    (match, dollar, number, suffix, plusminus, percent) => {
      // Only bold if it has special markers (dollar, suffix, plusminus, percent, comma, or decimal)
      const hasMarker =
        dollar ||
        suffix ||
        plusminus ||
        percent ||
        number.includes(',') ||
        number.includes('.');
      if (!hasMarker) return match;

      const parts = [dollar, number, suffix, plusminus, percent]
        .filter(Boolean)
        .join('');
      return `<strong>${parts}</strong>`;
    }
  );
}

function Resume({ resume }) {
  const {
    basics = {},
    work = [],
    education = [],
    skills = [],
    projects = [],
    volunteer = [],
    awards = [],
  } = resume;

  return (
    <>
      <GlobalStyle />
      <Container>
        {/* Hero */}
        <Header>
          {basics.name && <Name>{basics.name}</Name>}
          {basics.label && <Label>{basics.label}</Label>}
          {(basics.email ||
            basics.phone ||
            basics.url ||
            basics.location ||
            basics.profiles?.length > 0) && (
            <Contact>
              {basics.email && (
                <a href={`mailto:${basics.email}`}>{basics.email}</a>
              )}
              {basics.phone && <span>{basics.phone}</span>}
              {basics.url && (
                <a href={basics.url} target="_blank" rel="noopener noreferrer">
                  {basics.url.replace(/^https?:\/\//, '')}
                </a>
              )}
              {basics.location && (
                <span>
                  {[basics.location.city, basics.location.region]
                    .filter(Boolean)
                    .join(', ')}
                </span>
              )}
              {basics.profiles?.map((profile, i) => (
                <a
                  key={i}
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profile.network}
                </a>
              ))}
            </Contact>
          )}
          {basics.summary && (
            <Summary
              dangerouslySetInnerHTML={{ __html: boldNumbers(basics.summary) }}
            />
          )}
        </Header>

        {/* Work Experience */}
        {work.length > 0 && (
          <Section>
            <SectionTitle>Professional Experience</SectionTitle>
            {work.map((job, i) => (
              <Item key={i}>
                <ItemHeader>
                  <ItemTitle>{job.position}</ItemTitle>
                </ItemHeader>
                {job.name && <ItemSubtitle>{job.name}</ItemSubtitle>}
                {(job.startDate || job.location) && (
                  <ItemMeta>
                    {job.startDate && (
                      <span>
                        {formatDateRange({
                          startDate: job.startDate,
                          endDate: job.endDate,
                        })}
                      </span>
                    )}
                    {job.location && <span>{job.location}</span>}
                  </ItemMeta>
                )}
                {job.summary && (
                  <Description
                    dangerouslySetInnerHTML={{
                      __html: boldNumbers(job.summary),
                    }}
                  />
                )}
                {job.highlights?.length > 0 && (
                  <Highlights>
                    {job.highlights.map((highlight, j) => (
                      <li
                        key={j}
                        dangerouslySetInnerHTML={{
                          __html: boldNumbers(highlight),
                        }}
                      />
                    ))}
                  </Highlights>
                )}
              </Item>
            ))}
          </Section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <Section>
            <SectionTitle>Education</SectionTitle>
            {education.map((edu, i) => {
              const title = [edu.studyType, edu.area]
                .filter(Boolean)
                .join(' in ');
              const highlights = [];
              if (edu.score)
                highlights.push(`GPA: <strong>${edu.score}</strong>`);
              if (edu.courses?.length > 0)
                highlights.push(`Courses: ${edu.courses.join(', ')}`);

              return (
                <Item key={i}>
                  <ItemHeader>
                    <ItemTitle>{title || edu.institution}</ItemTitle>
                  </ItemHeader>
                  {title && <ItemSubtitle>{edu.institution}</ItemSubtitle>}
                  {edu.startDate && (
                    <ItemMeta>
                      <span>
                        {formatDateRange({
                          startDate: edu.startDate,
                          endDate: edu.endDate,
                        })}
                      </span>
                    </ItemMeta>
                  )}
                  {highlights.length > 0 && (
                    <Highlights>
                      {highlights.map((highlight, j) => (
                        <li
                          key={j}
                          dangerouslySetInnerHTML={{ __html: highlight }}
                        />
                      ))}
                    </Highlights>
                  )}
                </Item>
              );
            })}
          </Section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <Section>
            <SectionTitle>Technical Skills</SectionTitle>
            {skills.map((skillGroup, i) => (
              <SkillGroup key={i}>
                {skillGroup.name && <strong>{skillGroup.name}</strong>}
                {skillGroup.keywords?.length > 0 && (
                  <BadgeList>
                    {skillGroup.keywords.map((keyword, j) => (
                      <Badge key={j}>{keyword}</Badge>
                    ))}
                  </BadgeList>
                )}
              </SkillGroup>
            ))}
          </Section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <Section>
            <SectionTitle>Key Projects</SectionTitle>
            {projects.map((project, i) => (
              <Item key={i}>
                <ItemHeader>
                  <ItemTitle>{project.name}</ItemTitle>
                </ItemHeader>
                {project.startDate && (
                  <ItemMeta>
                    <span>
                      {formatDateRange({
                        startDate: project.startDate,
                        endDate: project.endDate,
                      })}
                    </span>
                  </ItemMeta>
                )}
                {project.description && (
                  <Description
                    dangerouslySetInnerHTML={{
                      __html: boldNumbers(project.description),
                    }}
                  />
                )}
                {project.url && (
                  <Description>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.url}
                    </a>
                  </Description>
                )}
                {project.keywords?.length > 0 && (
                  <BadgeList>
                    {project.keywords.map((keyword, j) => (
                      <Badge key={j}>{keyword}</Badge>
                    ))}
                  </BadgeList>
                )}
                {project.highlights?.length > 0 && (
                  <Highlights>
                    {project.highlights.map((highlight, j) => (
                      <li
                        key={j}
                        dangerouslySetInnerHTML={{
                          __html: boldNumbers(highlight),
                        }}
                      />
                    ))}
                  </Highlights>
                )}
              </Item>
            ))}
          </Section>
        )}

        {/* Volunteer */}
        {volunteer.length > 0 && (
          <Section>
            <SectionTitle>Volunteer Work</SectionTitle>
            {volunteer.map((vol, i) => (
              <Item key={i}>
                <ItemHeader>
                  <ItemTitle>{vol.position}</ItemTitle>
                </ItemHeader>
                {vol.organization && (
                  <ItemSubtitle>{vol.organization}</ItemSubtitle>
                )}
                {vol.startDate && (
                  <ItemMeta>
                    <span>
                      {formatDateRange({
                        startDate: vol.startDate,
                        endDate: vol.endDate,
                      })}
                    </span>
                  </ItemMeta>
                )}
                {vol.summary && (
                  <Description
                    dangerouslySetInnerHTML={{
                      __html: boldNumbers(vol.summary),
                    }}
                  />
                )}
                {vol.highlights?.length > 0 && (
                  <Highlights>
                    {vol.highlights.map((highlight, j) => (
                      <li
                        key={j}
                        dangerouslySetInnerHTML={{
                          __html: boldNumbers(highlight),
                        }}
                      />
                    ))}
                  </Highlights>
                )}
              </Item>
            ))}
          </Section>
        )}

        {/* Awards */}
        {awards.length > 0 && (
          <Section>
            <SectionTitle>Awards & Recognition</SectionTitle>
            {awards.map((award, i) => (
              <Item key={i}>
                <ItemHeader>
                  <ItemTitle>{award.title}</ItemTitle>
                </ItemHeader>
                {award.awarder && <ItemSubtitle>{award.awarder}</ItemSubtitle>}
                {award.date && (
                  <ItemMeta>
                    <span>{award.date}</span>
                  </ItemMeta>
                )}
                {award.summary && (
                  <Description
                    dangerouslySetInnerHTML={{
                      __html: boldNumbers(award.summary),
                    }}
                  />
                )}
              </Item>
            ))}
          </Section>
        )}
      </Container>
    </>
  );
}

export default Resume;
