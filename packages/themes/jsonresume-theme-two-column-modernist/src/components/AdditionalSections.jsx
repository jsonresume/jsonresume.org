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
} from './sharedStyles.jsx';

export function VolunteerSection({ volunteer }) {
  if (!volunteer || volunteer.length === 0) return null;

  return (
    <Section>
      <Title>Volunteer</Title>
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
                  {vol.startDate} – {vol.endDate || 'Present'}
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

export function AwardsSection({ awards }) {
  if (!awards || awards.length === 0) return null;

  return (
    <Section>
      <Title>Awards</Title>
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

export function PublicationsSection({ publications }) {
  if (!publications || publications.length === 0) return null;

  return (
    <Section>
      <Title>Publications</Title>
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

export function ReferencesSection({ references }) {
  if (!references || references.length === 0) return null;

  return (
    <Section>
      <Title>References</Title>
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
