/*
 * UTF-8 Safe — Main Section Render Helpers
 *
 * Renders work, education, projects, volunteer, awards, publications,
 * and references in the main (right) column.
 * Every external URL uses safeUrl().
 * Certificates, languages, and interests are rendered in the sidebar only.
 */
import React from 'react';
import { Link } from '@jsonresume/core';
import { formatDateRange, safeUrl } from '@jsonresume/utils';
import {
  StyledSection,
  StyledSectionTitle,
  EntryBlock,
  CardBlock,
  EntryHead,
  EntryOrg,
  MetaDate,
  EntryPos,
  EntryLoc,
  Desc,
  Highlights,
  HighlightItem,
  NotiItem,
  NotiTitle,
  NotiMeta,
  RefName,
  RefText,
} from '../styled-main.js';
import { StyledBadgeList, AccentBadge } from '../styled-sidebar.js';

function renderHighlights(items) {
  if (!items || items.length === 0) return null;
  return (
    <Highlights>
      {items.map((h, i) => (
        <HighlightItem key={`hl-${i}`}>{h}</HighlightItem>
      ))}
    </Highlights>
  );
}

export function renderWork(work) {
  if (!work || work.length === 0) return null;
  return (
    <StyledSection key="work">
      <StyledSectionTitle>Experience</StyledSectionTitle>
      {work.map((w) => (
        <EntryBlock key={`${w.company}-${w.position}-${w.startDate}`}>
          <EntryHead>
            <EntryOrg>
              {w.url ? (
                <a href={safeUrl(w.url)}>{w.company || w.name}</a>
              ) : (
                w.company || w.name
              )}
            </EntryOrg>
            <MetaDate>
              {formatDateRange({ startDate: w.startDate, endDate: w.endDate })}
            </MetaDate>
          </EntryHead>
          {w.position && <EntryPos>{w.position}</EntryPos>}
          {w.location && <EntryLoc>{w.location}</EntryLoc>}
          {w.summary && <Desc>{w.summary}</Desc>}
          {renderHighlights(w.highlights)}
        </EntryBlock>
      ))}
    </StyledSection>
  );
}

export function renderEducation(education) {
  if (!education || education.length === 0) return null;
  return (
    <StyledSection key="education">
      <StyledSectionTitle>Education</StyledSectionTitle>
      {education.map((e) => (
        <EntryBlock key={`${e.institution}-${e.area}`}>
          <EntryHead>
            <EntryOrg>
              {e.url ? (
                <a href={safeUrl(e.url)}>{e.institution}</a>
              ) : (
                e.institution
              )}
            </EntryOrg>
            <MetaDate>
              {formatDateRange({ startDate: e.startDate, endDate: e.endDate })}
            </MetaDate>
          </EntryHead>
          {(e.area || e.studyType) && (
            <EntryPos>
              {[e.studyType, e.area].filter(Boolean).join(' in ')}
            </EntryPos>
          )}
          {renderHighlights(e.courses)}
        </EntryBlock>
      ))}
    </StyledSection>
  );
}

export function renderProjects(projects) {
  if (!projects || projects.length === 0) return null;
  return (
    <StyledSection key="projects">
      <StyledSectionTitle>Projects</StyledSectionTitle>
      {projects.map((p) => (
        <CardBlock key={p.name}>
          <EntryHead>
            <EntryOrg>
              {p.url ? <Link href={safeUrl(p.url)}>{p.name}</Link> : p.name}
            </EntryOrg>
            <MetaDate>
              {formatDateRange({ startDate: p.startDate, endDate: p.endDate })}
            </MetaDate>
          </EntryHead>
          {p.summary && <Desc>{p.summary}</Desc>}
          {p.keywords && p.keywords.length > 0 && (
            <StyledBadgeList style={{ marginTop: '8px' }}>
              {p.keywords.map((kw) => (
                <AccentBadge key={kw}>{kw}</AccentBadge>
              ))}
            </StyledBadgeList>
          )}
        </CardBlock>
      ))}
    </StyledSection>
  );
}

export function renderVolunteer(volunteer) {
  if (!volunteer || volunteer.length === 0) return null;
  return (
    <StyledSection key="volunteer">
      <StyledSectionTitle>Volunteer</StyledSectionTitle>
      {volunteer.map((v) => (
        <EntryBlock key={`${v.organization}-${v.position}`}>
          <EntryHead>
            <EntryOrg>
              {v.url ? (
                <a href={safeUrl(v.url)}>{v.organization}</a>
              ) : (
                v.organization
              )}
            </EntryOrg>
            <MetaDate>
              {formatDateRange({ startDate: v.startDate, endDate: v.endDate })}
            </MetaDate>
          </EntryHead>
          {v.position && <EntryPos>{v.position}</EntryPos>}
          {v.summary && <Desc>{v.summary}</Desc>}
          {renderHighlights(v.highlights)}
        </EntryBlock>
      ))}
    </StyledSection>
  );
}

export function renderAwards(awards) {
  if (!awards || awards.length === 0) return null;
  return (
    <StyledSection key="awards">
      <StyledSectionTitle>Awards</StyledSectionTitle>
      {awards.map((a) => (
        <NotiItem key={a.title}>
          <NotiTitle>{a.title}</NotiTitle>
          {(a.awarder || a.date) && (
            <NotiMeta>
              {[a.awarder, a.date].filter(Boolean).join(' \u2022 ')}
            </NotiMeta>
          )}
          {a.summary && <Desc>{a.summary}</Desc>}
        </NotiItem>
      ))}
    </StyledSection>
  );
}

export function renderPublications(publications) {
  if (!publications || publications.length === 0) return null;
  return (
    <StyledSection key="publications">
      <StyledSectionTitle>Publications</StyledSectionTitle>
      {publications.map((p) => (
        <NotiItem key={p.name}>
          <NotiTitle>
            {p.url ? <Link href={safeUrl(p.url)}>{p.name}</Link> : p.name}
          </NotiTitle>
          {(p.publisher || p.releaseDate) && (
            <NotiMeta>
              {[p.publisher, p.releaseDate].filter(Boolean).join(' \u2022 ')}
            </NotiMeta>
          )}
          {p.summary && <Desc>{p.summary}</Desc>}
        </NotiItem>
      ))}
    </StyledSection>
  );
}

export function renderReferences(references) {
  if (!references || references.length === 0) return null;
  return (
    <StyledSection key="references">
      <StyledSectionTitle>References</StyledSectionTitle>
      {references.map((r) => (
        <CardBlock key={r.name}>
          {r.name && <RefName>{r.name}</RefName>}
          {r.reference && <RefText>{r.reference}</RefText>}
        </CardBlock>
      ))}
    </StyledSection>
  );
}
