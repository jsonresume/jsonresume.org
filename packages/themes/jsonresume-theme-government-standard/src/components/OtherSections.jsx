import React from 'react';
import { Section, DateRange } from '@resume/core';
import {
  StyledSectionTitle,
  WorkItem,
  WorkHeader,
  Position,
  Company,
  DateText,
  WorkSummary,
  Highlights,
  SimpleList,
  ListItemTitle,
  ListItemText,
  SkillsList,
  SkillName,
  SkillTags,
} from '../Resume.jsx';

export function ProjectsSection({ projects }) {
  if (!projects?.length) return null;

  return (
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
                <li key={i}>{highlight}</li>
              ))}
            </Highlights>
          )}
        </WorkItem>
      ))}
    </Section>
  );
}

export function VolunteerSection({ volunteer }) {
  if (!volunteer?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>Volunteer Experience</StyledSectionTitle>
      {volunteer.map((vol, index) => (
        <WorkItem key={index}>
          <WorkHeader>
            <Position>{vol.position}</Position>
            {vol.organization && <Company>{vol.organization}</Company>}
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

export function AwardsSection({ awards }) {
  if (!awards?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>Awards and Honors</StyledSectionTitle>
      {awards.map((award, index) => (
        <SimpleList key={index}>
          <ListItemTitle>{award.title}</ListItemTitle>
          {award.awarder && (
            <ListItemText>Awarded by: {award.awarder}</ListItemText>
          )}
          {award.date && <ListItemText>Date: {award.date}</ListItemText>}
          {award.summary && <ListItemText>{award.summary}</ListItemText>}
        </SimpleList>
      ))}
    </Section>
  );
}

export function PublicationsSection({ publications }) {
  if (!publications?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>Publications</StyledSectionTitle>
      {publications.map((pub, index) => (
        <SimpleList key={index}>
          <ListItemTitle>{pub.name}</ListItemTitle>
          {pub.publisher && (
            <ListItemText>Publisher: {pub.publisher}</ListItemText>
          )}
          {pub.releaseDate && (
            <ListItemText>Published: {pub.releaseDate}</ListItemText>
          )}
          {pub.summary && <ListItemText>{pub.summary}</ListItemText>}
        </SimpleList>
      ))}
    </Section>
  );
}

export function LanguagesSection({ languages }) {
  if (!languages?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>Languages</StyledSectionTitle>
      {languages.map((lang, index) => (
        <SkillsList key={index}>
          <SkillName>{lang.language}:</SkillName>{' '}
          {lang.fluency && <SkillTags>{lang.fluency}</SkillTags>}
        </SkillsList>
      ))}
    </Section>
  );
}

export function InterestsSection({ interests }) {
  if (!interests?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>Professional Interests</StyledSectionTitle>
      {interests.map((interest, index) => (
        <SkillsList key={index}>
          <SkillName>{interest.name}</SkillName>
          {interest.keywords?.length > 0 && (
            <>
              : <SkillTags>{interest.keywords.join(', ')}</SkillTags>
            </>
          )}
        </SkillsList>
      ))}
    </Section>
  );
}

export function ReferencesSection({ references }) {
  if (!references?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>References</StyledSectionTitle>
      {references.map((ref, index) => (
        <SimpleList key={index}>
          <ListItemTitle>{ref.name}</ListItemTitle>
          {ref.reference && <ListItemText>{ref.reference}</ListItemText>}
        </SimpleList>
      ))}
    </Section>
  );
}
