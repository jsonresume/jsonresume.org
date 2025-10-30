import React from 'react';
import { Section, DateRange } from '@resume/core';
import { SectionTitle } from './layout-styles';
import {
  WorkItem,
  WorkHeader,
  Position,
  Company,
  DateText,
  WorkSummary,
  Highlights,
  EducationItem,
  Institution,
  Degree,
  EducationDate,
  SkillsGrid,
  SkillCategory,
  SkillName,
  SkillTags,
} from './section-styles';

export function ProjectsSection({ projects = [] }) {
  if (!projects?.length) return null;

  return (
    <Section>
      <SectionTitle>Projects</SectionTitle>
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
  );
}

export function VolunteerSection({ volunteer = [] }) {
  if (!volunteer?.length) return null;

  return (
    <Section>
      <SectionTitle>Volunteer</SectionTitle>
      {volunteer.map((vol, index) => (
        <WorkItem key={index}>
          <WorkHeader>
            <div>
              <Position>{vol.position}</Position>
              {vol.organization && <Company>{vol.organization}</Company>}
            </div>
            {(vol.startDate || vol.endDate) && (
              <DateText>
                <DateRange startDate={vol.startDate} endDate={vol.endDate} />
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
  );
}

export function AwardsSection({ awards = [] }) {
  if (!awards?.length) return null;

  return (
    <Section>
      <SectionTitle>Awards</SectionTitle>
      {awards.map((award, index) => (
        <EducationItem key={index}>
          <Institution>{award.title}</Institution>
          {award.awarder && <Degree>Awarded by {award.awarder}</Degree>}
          {award.date && <EducationDate>{award.date}</EducationDate>}
          {award.summary && <WorkSummary>{award.summary}</WorkSummary>}
        </EducationItem>
      ))}
    </Section>
  );
}

export function PublicationsSection({ publications = [] }) {
  if (!publications?.length) return null;

  return (
    <Section>
      <SectionTitle>Publications</SectionTitle>
      {publications.map((pub, index) => (
        <EducationItem key={index}>
          <Institution>{pub.name}</Institution>
          {pub.publisher && <Degree>Published by {pub.publisher}</Degree>}
          {pub.releaseDate && <EducationDate>{pub.releaseDate}</EducationDate>}
          {pub.summary && <WorkSummary>{pub.summary}</WorkSummary>}
        </EducationItem>
      ))}
    </Section>
  );
}

export function LanguagesSection({ languages = [] }) {
  if (!languages?.length) return null;

  return (
    <Section>
      <SectionTitle>Languages</SectionTitle>
      <SkillsGrid>
        {languages.map((lang, index) => (
          <SkillCategory key={index}>
            <SkillName>{lang.language}</SkillName>
            {lang.fluency && <SkillTags>{lang.fluency}</SkillTags>}
          </SkillCategory>
        ))}
      </SkillsGrid>
    </Section>
  );
}

export function InterestsSection({ interests = [] }) {
  if (!interests?.length) return null;

  return (
    <Section>
      <SectionTitle>Interests</SectionTitle>
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
  );
}

export function ReferencesSection({ references = [] }) {
  if (!references?.length) return null;

  return (
    <Section>
      <SectionTitle>References</SectionTitle>
      {references.map((ref, index) => (
        <EducationItem key={index}>
          <Institution>{ref.name}</Institution>
          {ref.reference && <WorkSummary>{ref.reference}</WorkSummary>}
        </EducationItem>
      ))}
    </Section>
  );
}
