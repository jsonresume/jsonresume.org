import React from 'react';
import { safeUrl } from '@resume/core';
import {
  Section,
  Title,
  Entry,
  EntryHeader,
  EntryTitle,
  EntryMeta,
  EntryOrganization,
  EntryDate,
  EntryDescription,
  HighlightsList,
  HighlightItem,
  Summary,
  SkillList,
  SkillItem,
} from './sharedStyles';

export function WorkSection({ work }) {
  if (!work || work.length === 0) return null;

  return (
    <Section>
      <Title>Experience</Title>
      {work.map((job, i) => (
        <Entry key={i}>
          <EntryHeader>
            {job.position && <EntryTitle>{job.position}</EntryTitle>}
            <EntryMeta>
              {job.name && <EntryOrganization>{job.name}</EntryOrganization>}
              {(job.startDate || job.endDate) && (
                <EntryDate>
                  {job.startDate} – {job.endDate || 'Present'}
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

export function EducationSection({ education }) {
  if (!education || education.length === 0) return null;

  return (
    <Section>
      <Title>Education</Title>
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
                  {edu.startDate} – {edu.endDate || 'Present'}
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

export function ProjectsSection({ projects }) {
  if (!projects || projects.length === 0) return null;

  return (
    <Section>
      <Title>Projects</Title>
      {projects.map((project, i) => (
        <Entry key={i}>
          <EntryHeader>
            {project.name && <EntryTitle>{project.name}</EntryTitle>}
            {(project.startDate || project.endDate) && (
              <EntryMeta>
                <EntryDate>
                  {project.startDate} – {project.endDate || 'Present'}
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

export function SummarySection({ summary }) {
  if (!summary) return null;

  return (
    <Section>
      <Summary>{summary}</Summary>
    </Section>
  );
}

export function InterestsSection({ interests }) {
  if (!interests || interests.length === 0) return null;

  return (
    <Section>
      <Title>Interests</Title>
      <SkillList>
        {interests.map((interest, i) => (
          <SkillItem key={i}>{interest.name}</SkillItem>
        ))}
      </SkillList>
    </Section>
  );
}
