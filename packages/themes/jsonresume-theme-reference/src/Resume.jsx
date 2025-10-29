import styled from 'styled-components';
import {
  Section,
  SectionTitle,
  ListItem,
  DateRange,
  BadgeList,
  safeUrl,
  getLinkRel,
} from '@resume/core';

/**
 * Resume Component
 * THE PERFECT SHOWCASE of @resume/core and resume design best practices
 *
 * This demonstrates:
 * - All 5 @resume/core primitives with JSX
 * - All 11 JSON Resume schema sections
 * - ATS-friendly patterns
 * - Design token usage
 * - Beautiful component composition
 */

const Layout = styled.div`
  max-width: var(--resume-max-width, 660px);
  margin: 0 auto;
  padding: 40px 20px;
  font-family: var(
    --resume-font-sans,
    'Helvetica Neue',
    Helvetica,
    Arial,
    sans-serif
  );
  font-size: var(--resume-size-body, 11pt);
  line-height: 1.6;
  color: var(--resume-color-primary, #000);
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: var(--resume-space-section, 2rem);
`;

const Name = styled.h1`
  font-size: var(--resume-size-name, 28pt);
  font-weight: 700;
  margin: 0 0 8px 0;
  color: var(--resume-color-primary, #000);
`;

const Label = styled.p`
  font-size: var(--resume-size-heading, 16pt);
  color: var(--resume-color-secondary, #333);
  margin: 0 0 16px 0;
`;

const Contact = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  font-size: var(--resume-size-body, 11pt);

  a {
    color: var(--resume-color-accent, #0066cc);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Summary = styled.p`
  text-align: center;
  margin: 16px 0;
  color: var(--resume-color-secondary, #333);
`;

const SkillGroup = styled.div`
  margin-bottom: 12px;

  strong {
    margin-right: 8px;
  }
`;

function Resume({ resume }) {
  const {
    basics = {},
    work = [],
    education = [],
    skills = [],
    volunteer = [],
    awards = [],
    publications = [],
    languages = [],
    interests = [],
    references = [],
    projects = [],
  } = resume;

  return (
    <Layout>
      {/* Hero Section - Name, Title, Contact */}
      {basics && (
        <Header>
          <Name>{basics.name}</Name>
          {basics.label && <Label>{basics.label}</Label>}

          <Contact>
            {basics.email && (
              <a href={safeUrl(`mailto:${basics.email}`)}>{basics.email}</a>
            )}
            {basics.phone && <span>{basics.phone}</span>}
            {basics.url && (
              <a
                href={safeUrl(basics.url)}
                target="_blank"
                rel={getLinkRel(basics.url, true)}
              >
                {basics.url}
              </a>
            )}
            {basics.location && (
              <span>
                {[
                  basics.location.city,
                  basics.location.region,
                  basics.location.countryCode,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            )}
            {basics.profiles?.map((profile) => {
              const profileUrl = safeUrl(profile.url);
              return (
                profileUrl && (
                  <a
                    key={profile.network}
                    href={profileUrl}
                    target="_blank"
                    rel={getLinkRel(profileUrl, true)}
                  >
                    {profile.network}
                  </a>
                )
              );
            })}
          </Contact>

          {basics.summary && <Summary>{basics.summary}</Summary>}
        </Header>
      )}

      {/* Work Experience Section */}
      {work.length > 0 && (
        <Section id="work">
          <SectionTitle>Work Experience</SectionTitle>
          {work.map((job, index) => (
            <ListItem
              key={index}
              title={job.position}
              subtitle={job.name}
              dateRange={
                job.startDate ? (
                  <DateRange startDate={job.startDate} endDate={job.endDate} />
                ) : null
              }
              location={job.location}
              description={job.summary}
              highlights={job.highlights}
            />
          ))}
        </Section>
      )}

      {/* Education Section */}
      {education.length > 0 && (
        <Section id="education">
          <SectionTitle>Education</SectionTitle>
          {education.map((edu, index) => {
            const title = [edu.studyType, edu.area]
              .filter(Boolean)
              .join(' in ');
            const highlights = [
              edu.score ? `GPA: ${edu.score}` : '',
              ...(edu.courses || []),
            ].filter(Boolean);

            return (
              <ListItem
                key={index}
                title={title || edu.institution}
                subtitle={title ? edu.institution : ''}
                dateRange={
                  edu.startDate ? (
                    <DateRange
                      startDate={edu.startDate}
                      endDate={edu.endDate}
                    />
                  ) : null
                }
                highlights={highlights.length > 0 ? highlights : undefined}
              />
            );
          })}
        </Section>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <Section id="skills">
          <SectionTitle>Skills</SectionTitle>
          {skills.map((skillGroup, index) => (
            <SkillGroup key={index}>
              {skillGroup.name && <strong>{skillGroup.name}:</strong>}
              <BadgeList items={skillGroup.keywords} variant="default" />
            </SkillGroup>
          ))}
        </Section>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <Section id="projects">
          <SectionTitle>Projects</SectionTitle>
          {projects.map((project, index) => (
            <ListItem
              key={index}
              title={project.name}
              dateRange={
                project.startDate ? (
                  <DateRange
                    startDate={project.startDate}
                    endDate={project.endDate}
                  />
                ) : null
              }
              description={
                <>
                  {project.description}
                  {project.url && safeUrl(project.url) && (
                    <>
                      <br />
                      <a
                        href={safeUrl(project.url)}
                        target="_blank"
                        rel={getLinkRel(project.url, true)}
                      >
                        {project.url}
                      </a>
                    </>
                  )}
                  {project.keywords && project.keywords.length > 0 && (
                    <>
                      <br />
                      <BadgeList items={project.keywords} variant="accent" />
                    </>
                  )}
                </>
              }
              highlights={project.highlights}
            />
          ))}
        </Section>
      )}

      {/* Volunteer Section */}
      {volunteer.length > 0 && (
        <Section id="volunteer">
          <SectionTitle>Volunteer Experience</SectionTitle>
          {volunteer.map((vol, index) => (
            <ListItem
              key={index}
              title={vol.position}
              subtitle={vol.organization}
              dateRange={
                vol.startDate ? (
                  <DateRange startDate={vol.startDate} endDate={vol.endDate} />
                ) : null
              }
              description={vol.summary}
              highlights={vol.highlights}
            />
          ))}
        </Section>
      )}

      {/* Awards Section */}
      {awards.length > 0 && (
        <Section id="awards">
          <SectionTitle>Awards & Honors</SectionTitle>
          {awards.map((award, index) => (
            <ListItem
              key={index}
              title={award.title}
              subtitle={award.awarder}
              dateRange={award.date}
              description={award.summary}
            />
          ))}
        </Section>
      )}

      {/* Publications Section */}
      {publications.length > 0 && (
        <Section id="publications">
          <SectionTitle>Publications</SectionTitle>
          {publications.map((pub, index) => (
            <ListItem
              key={index}
              title={pub.name}
              subtitle={pub.publisher}
              dateRange={pub.releaseDate}
              description={
                <>
                  {pub.summary}
                  {pub.url && safeUrl(pub.url) && (
                    <>
                      <br />
                      <a
                        href={safeUrl(pub.url)}
                        target="_blank"
                        rel={getLinkRel(pub.url, true)}
                      >
                        {pub.url}
                      </a>
                    </>
                  )}
                </>
              }
            />
          ))}
        </Section>
      )}

      {/* Languages Section */}
      {languages.length > 0 && (
        <Section id="languages">
          <SectionTitle>Languages</SectionTitle>
          {languages.map((lang, index) => (
            <div key={index}>
              {lang.language}
              {lang.fluency && ` (${lang.fluency})`}
            </div>
          ))}
        </Section>
      )}

      {/* Interests Section */}
      {interests.length > 0 && (
        <Section id="interests">
          <SectionTitle>Interests</SectionTitle>
          <BadgeList
            items={interests.flatMap((i) => i.keywords || [])}
            variant="default"
          />
        </Section>
      )}

      {/* References Section */}
      {references.length > 0 && (
        <Section id="references">
          <SectionTitle>References</SectionTitle>
          {references.map((ref, index) => (
            <ListItem
              key={index}
              title={ref.name}
              description={ref.reference}
            />
          ))}
        </Section>
      )}
    </Layout>
  );
}

export default Resume;
