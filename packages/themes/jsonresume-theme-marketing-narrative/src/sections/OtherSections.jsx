import React from 'react';
import { Section, DateRange } from '@jsonresume/core';
import {
  StyledSectionTitle,
  StoryItem,
  StoryHeader,
  Position,
  CompanyAndDate,
  Company,
  DateText,
  Narrative,
  Achievements,
  AchievementItem,
  EducationItem,
  Institution,
  Degree,
  EducationDate,
  SkillsGrid,
  SkillCategory,
  SkillName,
  SkillTags,
  QuoteBlock,
} from '../Resume.jsx';

export function VolunteerSection({ volunteer }) {
  if (!volunteer?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>Community Impact</StyledSectionTitle>
      {volunteer.map((vol, index) => (
        <StoryItem key={index}>
          <StoryHeader>
            <Position>{vol.position}</Position>
            <CompanyAndDate>
              {vol.organization && <Company>{vol.organization}</Company>}
              {(vol.startDate || vol.endDate) && (
                <DateText>
                  <DateRange startDate={vol.startDate} endDate={vol.endDate} />
                </DateText>
              )}
            </CompanyAndDate>
          </StoryHeader>
          {vol.summary && <Narrative>{vol.summary}</Narrative>}
          {vol.highlights?.length > 0 && (
            <Achievements>
              {vol.highlights.map((highlight, i) => (
                <AchievementItem key={i}>{highlight}</AchievementItem>
              ))}
            </Achievements>
          )}
        </StoryItem>
      ))}
    </Section>
  );
}

export function AwardsSection({ awards }) {
  if (!awards?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>Recognition</StyledSectionTitle>
      {awards.map((award, index) => (
        <EducationItem key={index}>
          <Institution>{award.title}</Institution>
          {award.awarder && <Degree>Awarded by {award.awarder}</Degree>}
          {award.date && <EducationDate>{award.date}</EducationDate>}
          {award.summary && <Narrative>{award.summary}</Narrative>}
        </EducationItem>
      ))}
    </Section>
  );
}

export function PublicationsSection({ publications }) {
  if (!publications?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>Published Work</StyledSectionTitle>
      {publications.map((pub, index) => (
        <EducationItem key={index}>
          <Institution>{pub.name}</Institution>
          {pub.publisher && <Degree>Published by {pub.publisher}</Degree>}
          {pub.releaseDate && <EducationDate>{pub.releaseDate}</EducationDate>}
          {pub.summary && <Narrative>{pub.summary}</Narrative>}
        </EducationItem>
      ))}
    </Section>
  );
}

export function LanguagesSection({ languages }) {
  if (!languages?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>Languages</StyledSectionTitle>
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

export function InterestsSection({ interests }) {
  if (!interests?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>Interests & Passions</StyledSectionTitle>
      <SkillsGrid>
        {interests.map((interest, index) => (
          <SkillCategory key={index}>
            <SkillName>{interest.name}</SkillName>
            {interest.keywords?.length > 0 && (
              <SkillTags>{interest.keywords.join(' • ')}</SkillTags>
            )}
          </SkillCategory>
        ))}
      </SkillsGrid>
    </Section>
  );
}

export function ReferencesSection({ references }) {
  if (!references?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>Testimonials</StyledSectionTitle>
      {references.map((ref, index) => (
        <div key={index} style={{ marginBottom: '30px' }}>
          <Institution>{ref.name}</Institution>
          {ref.reference && <QuoteBlock>"{ref.reference}"</QuoteBlock>}
        </div>
      ))}
    </Section>
  );
}
