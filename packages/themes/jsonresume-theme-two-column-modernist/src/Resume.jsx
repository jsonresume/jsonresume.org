import React from 'react';
import styled from 'styled-components';
import { safeUrl, DateRange } from '@resume/core';

// Layout
const Container = styled.div`
  display: grid;
  grid-template-columns: 35% 65%;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
  font-family: 'Space Grotesk', 'Archivo', -apple-system, BlinkMacSystemFont,
    'Segoe UI', sans-serif;
  line-height: 1.6;
  color: #1f1f1f;
  background: #ffffff;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2rem 1rem;
  }

  @media print {
    padding: 1rem;
    gap: 2rem;
  }
`;

const LeftColumn = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: #f9fafb;
  padding: 2rem 1.5rem;
  border-right: 2px solid #e5e7eb;

  @media (max-width: 768px) {
    background: transparent;
    padding: 0;
    border-right: none;
  }
`;

const RightColumn = styled.main`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const Divider = styled.hr`
  border: none;
  border-top: 2px solid #cbd5e1;
  margin: 0;
`;

// Header components
const HeaderContainer = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Name = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0;
  color: #1f1f1f;
`;

const Title = styled.p`
  font-size: 0.95rem;
  font-weight: 500;
  color: #4b5563;
  margin: 0;
  letter-spacing: 0.01em;
`;

const Contact = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #4b5563;

  a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;

    &:hover {
      color: #1d4ed8;
      text-decoration: underline;
    }
  }
`;

// Sidebar components
const SidebarSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SidebarTitle = styled.h2`
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0;
  color: #1f1f1f;
`;

const SkillCategory = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SkillName = styled.h3`
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0;
  color: #1f1f1f;
`;

const SkillList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SkillItem = styled.li`
  font-size: 0.8rem;
  color: #4b5563;
  background: #f3f4f6;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
`;

const LanguageList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const LanguageItem = styled.li`
  font-size: 0.85rem;
  color: #374151;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LanguageName = styled.span`
  font-weight: 500;
  color: #1f1f1f;
`;

const LanguageFluency = styled.span`
  font-size: 0.8rem;
  color: #6b7280;
`;

// Content section components
const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0;
  color: #1f1f1f;
  border-bottom: 1px solid #d1d5db;
  padding-bottom: 0.5rem;
`;

const Entry = styled.article`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const EntryHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const EntryTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: #1f1f1f;
`;

const EntryMeta = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
`;

const EntryOrganization = styled.span`
  font-weight: 500;
  color: #4b5563;
`;

const EntryDate = styled.span`
  color: #9ca3af;
  font-size: 0.8rem;
`;

const EntryDescription = styled.p`
  font-size: 0.9rem;
  line-height: 1.7;
  color: #374151;
  margin: 0;
  white-space: pre-wrap;
`;

const HighlightsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const HighlightItem = styled.li`
  font-size: 0.85rem;
  color: #4b5563;
  padding-left: 1rem;
  position: relative;

  &::before {
    content: '—';
    position: absolute;
    left: 0;
    color: #d1d5db;
  }
`;

const Summary = styled.p`
  font-size: 0.9rem;
  line-height: 1.7;
  color: #374151;
  margin: 0;
  white-space: pre-wrap;
`;

// Sub-components
function Header({ basics }) {
  if (!basics) return null;

  return (
    <>
      <HeaderContainer>
        <Name>{basics.name}</Name>
        {basics.label && <Title>{basics.label}</Title>}
      </HeaderContainer>

      {(basics.email || basics.phone || basics.url || basics.location) && (
        <Contact>
          {basics.email && (
            <div>
              <a href={`mailto:${basics.email}`}>{basics.email}</a>
            </div>
          )}
          {basics.phone && <div>{basics.phone}</div>}
          {basics.url && (
            <div>
              <a
                href={safeUrl(basics.url)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {basics.url.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {basics.location && (
            <div>
              {[
                basics.location.city,
                basics.location.region,
                basics.location.countryCode,
              ]
                .filter(Boolean)
                .join(', ')}
            </div>
          )}
        </Contact>
      )}

      {basics.profiles && basics.profiles.length > 0 && (
        <Contact>
          {basics.profiles.map((profile, i) => (
            <div key={i}>
              <a
                href={safeUrl(profile.url)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {profile.network}
                {profile.username && `: @${profile.username}`}
              </a>
            </div>
          ))}
        </Contact>
      )}
    </>
  );
}

function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;

  return (
    <SidebarSection>
      <SidebarTitle>Skills</SidebarTitle>
      {skills.map((skill, i) => (
        <SkillCategory key={i}>
          {skill.name && <SkillName>{skill.name}</SkillName>}
          {skill.keywords && skill.keywords.length > 0 && (
            <SkillList>
              {skill.keywords.map((keyword, j) => (
                <SkillItem key={j}>{keyword}</SkillItem>
              ))}
            </SkillList>
          )}
        </SkillCategory>
      ))}
    </SidebarSection>
  );
}

function Languages({ languages }) {
  if (!languages || languages.length === 0) return null;

  return (
    <SidebarSection>
      <SidebarTitle>Languages</SidebarTitle>
      <LanguageList>
        {languages.map((lang, i) => (
          <LanguageItem key={i}>
            <LanguageName>{lang.language}</LanguageName>
            {lang.fluency && <LanguageFluency>{lang.fluency}</LanguageFluency>}
          </LanguageItem>
        ))}
      </LanguageList>
    </SidebarSection>
  );
}

function SummarySection({ summary }) {
  if (!summary) return null;

  return (
    <Section>
      <Summary>{summary}</Summary>
    </Section>
  );
}

function WorkSection({ work }) {
  if (!work || work.length === 0) return null;

  return (
    <Section>
      <SectionTitle>Experience</SectionTitle>
      {work.map((job, i) => (
        <Entry key={i}>
          <EntryHeader>
            {job.position && <EntryTitle>{job.position}</EntryTitle>}
            <EntryMeta>
              {job.name && <EntryOrganization>{job.name}</EntryOrganization>}
              {(job.startDate || job.endDate) && (
                <EntryDate>
                  <DateRange startDate={job.startDate} endDate={job.endDate} />
                </EntryDate>
              )}
            </EntryMeta>
          </EntryHeader>
          {job.summary && <EntryDescription>{job.summary}</EntryDescription>}
          {job.highlights && job.highlights.length > 0 && (
            <HighlightsList>
              {job.highlights.map((highlight, j) => (
                <HighlightItem key={j}>{highlight}</HighlightItem>
              ))}
            </HighlightsList>
          )}
        </Entry>
      ))}
    </Section>
  );
}

function EducationSection({ education }) {
  if (!education || education.length === 0) return null;

  return (
    <Section>
      <SectionTitle>Education</SectionTitle>
      {education.map((edu, i) => (
        <Entry key={i}>
          <EntryHeader>
            {edu.studyType && edu.area && (
              <EntryTitle>
                {edu.studyType} in {edu.area}
              </EntryTitle>
            )}
            <EntryMeta>
              {edu.institution && (
                <EntryOrganization>{edu.institution}</EntryOrganization>
              )}
              {(edu.startDate || edu.endDate) && (
                <EntryDate>
                  <DateRange startDate={edu.startDate} endDate={edu.endDate} />
                </EntryDate>
              )}
            </EntryMeta>
          </EntryHeader>
          {edu.score && <EntryDescription>GPA: {edu.score}</EntryDescription>}
          {edu.courses && edu.courses.length > 0 && (
            <HighlightsList>
              {edu.courses.map((course, j) => (
                <HighlightItem key={j}>{course}</HighlightItem>
              ))}
            </HighlightsList>
          )}
        </Entry>
      ))}
    </Section>
  );
}

function ProjectsSection({ projects }) {
  if (!projects || projects.length === 0) return null;

  return (
    <Section>
      <SectionTitle>Projects</SectionTitle>
      {projects.map((project, i) => (
        <Entry key={i}>
          <EntryHeader>
            {project.name && <EntryTitle>{project.name}</EntryTitle>}
            {(project.startDate || project.endDate) && (
              <EntryMeta>
                <EntryDate>
                  <DateRange
                    startDate={project.startDate}
                    endDate={project.endDate}
                  />
                </EntryDate>
              </EntryMeta>
            )}
          </EntryHeader>
          {project.description && (
            <EntryDescription>{project.description}</EntryDescription>
          )}
          {project.highlights && project.highlights.length > 0 && (
            <HighlightsList>
              {project.highlights.map((highlight, j) => (
                <HighlightItem key={j}>{highlight}</HighlightItem>
              ))}
            </HighlightsList>
          )}
          {project.url && (
            <div>
              <a
                href={safeUrl(project.url)}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Project
              </a>
            </div>
          )}
        </Entry>
      ))}
    </Section>
  );
}

function InterestsSection({ interests }) {
  if (!interests || interests.length === 0) return null;

  return (
    <Section>
      <SectionTitle>Interests</SectionTitle>
      <SkillList>
        {interests.map((interest, i) => (
          <SkillItem key={i}>{interest.name}</SkillItem>
        ))}
      </SkillList>
    </Section>
  );
}

function VolunteerSection({ volunteer }) {
  if (!volunteer || volunteer.length === 0) return null;

  return (
    <Section>
      <SectionTitle>Volunteer</SectionTitle>
      {volunteer.map((vol, i) => (
        <Entry key={i}>
          <EntryHeader>
            {vol.position && <EntryTitle>{vol.position}</EntryTitle>}
            <EntryMeta>
              {vol.organization && (
                <EntryOrganization>{vol.organization}</EntryOrganization>
              )}
              {(vol.startDate || vol.endDate) && (
                <EntryDate>
                  <DateRange startDate={vol.startDate} endDate={vol.endDate} />
                </EntryDate>
              )}
            </EntryMeta>
          </EntryHeader>
          {vol.summary && <EntryDescription>{vol.summary}</EntryDescription>}
          {vol.highlights && vol.highlights.length > 0 && (
            <HighlightsList>
              {vol.highlights.map((highlight, j) => (
                <HighlightItem key={j}>{highlight}</HighlightItem>
              ))}
            </HighlightsList>
          )}
        </Entry>
      ))}
    </Section>
  );
}

function AwardsSection({ awards }) {
  if (!awards || awards.length === 0) return null;

  return (
    <Section>
      <SectionTitle>Awards</SectionTitle>
      {awards.map((award, i) => (
        <Entry key={i}>
          <EntryHeader>
            {award.title && <EntryTitle>{award.title}</EntryTitle>}
            <EntryMeta>
              {award.awarder && (
                <EntryOrganization>{award.awarder}</EntryOrganization>
              )}
              {award.date && <EntryDate>{award.date}</EntryDate>}
            </EntryMeta>
          </EntryHeader>
          {award.summary && (
            <EntryDescription>{award.summary}</EntryDescription>
          )}
        </Entry>
      ))}
    </Section>
  );
}

function PublicationsSection({ publications }) {
  if (!publications || publications.length === 0) return null;

  return (
    <Section>
      <SectionTitle>Publications</SectionTitle>
      {publications.map((pub, i) => (
        <Entry key={i}>
          <EntryHeader>
            {pub.name && <EntryTitle>{pub.name}</EntryTitle>}
            <EntryMeta>
              {pub.publisher && (
                <EntryOrganization>{pub.publisher}</EntryOrganization>
              )}
              {pub.releaseDate && <EntryDate>{pub.releaseDate}</EntryDate>}
            </EntryMeta>
          </EntryHeader>
          {pub.summary && <EntryDescription>{pub.summary}</EntryDescription>}
          {pub.url && (
            <div>
              <a
                href={safeUrl(pub.url)}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Publication
              </a>
            </div>
          )}
        </Entry>
      ))}
    </Section>
  );
}

function ReferencesSection({ references }) {
  if (!references || references.length === 0) return null;

  return (
    <Section>
      <SectionTitle>References</SectionTitle>
      {references.map((ref, i) => (
        <Entry key={i}>
          {ref.name && <EntryTitle>{ref.name}</EntryTitle>}
          {ref.reference && (
            <EntryDescription>{ref.reference}</EntryDescription>
          )}
        </Entry>
      ))}
    </Section>
  );
}

// Main Resume component
function Resume({ resume }) {
  const {
    basics,
    work,
    education,
    skills,
    languages,
    projects,
    volunteer,
    awards,
    publications,
    interests,
    references,
  } = resume;

  return (
    <Container>
      <LeftColumn>
        <Header basics={basics} />
        {(basics?.email ||
          basics?.phone ||
          basics?.url ||
          basics?.location) && <Divider />}
        {basics?.profiles && basics.profiles.length > 0 && <Divider />}
        {skills && skills.length > 0 && (
          <>
            <Divider />
            <Skills skills={skills} />
          </>
        )}
        {languages && languages.length > 0 && (
          <>
            <Divider />
            <Languages languages={languages} />
          </>
        )}
      </LeftColumn>

      <RightColumn>
        <SummarySection summary={basics?.summary} />
        <WorkSection work={work} />
        <EducationSection education={education} />
        <ProjectsSection projects={projects} />
        <VolunteerSection volunteer={volunteer} />
        <AwardsSection awards={awards} />
        <PublicationsSection publications={publications} />
        <InterestsSection interests={interests} />
        <ReferencesSection references={references} />
      </RightColumn>
    </Container>
  );
}

export default Resume;
