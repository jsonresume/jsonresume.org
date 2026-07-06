import React from 'react';
import styled from 'styled-components';
import {
  Section,
  SectionTitle,
  Badge,
  BadgeList,
  ContactInfo,
  Link,
} from '@jsonresume/core';
import { formatDateRange, formatLocation, safeUrl } from '@jsonresume/utils';

/*
 * UTF-8 Safe — Two-column layout with SAP OpenUI5 Horizon design tokens.
 *
 * Inspired by SAP OpenUI5 Horizon: clean, modern, blue-accented UX.
 * Print-optimized and fully UTF-8 safe for international content.
 *
 * Rules:
 *   1. Inline styled-components (collected by renderResumeDocument SSR).
 *   2. Use @jsonresume/utils helpers, never reimplement dates/location/urls.
 *   3. <ContactInfo basics={basics} /> takes a SINGLE basics prop.
 *   4. NEVER name a styled-component "Date".
 *   5. Render ALL sections so the theme is complete.
 */

// --- Design Tokens ---
const colors = {
  primary: '#0070f2',
  primaryHover: '#005dc9',
  primaryLight: '#e1effa',
  bg: '#f5f6f7',
  surface: '#ffffff',
  text: '#1d2a3a',
  textSecondary: '#475e75',
  textSubtle: '#6a7e92',
  border: '#d9e1e8',
  borderLight: '#e8edf1',
  sidebarBg: '#fafbfc',
  headerBg: '#1d2a3a',
  headerText: '#ffffff',
  headerSubtle: '#a8b8c9',
  tagBg: '#eef1f5',
  tagText: '#475e75',
  tagAccentBg: '#e1effa',
  tagAccentText: '#0070f2',
  marker: '#0070f2',
  markerLine: '#d9e1e8',
  link: '#0070f2',
};

const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
};

// --- Layout ---
const Page = styled.div`
  max-width: 1050px;
  margin: ${spacing.xl} auto;
  background: ${colors.surface};
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 15px;
  line-height: 1.6;
  color: ${colors.text};
  -webkit-font-smoothing: antialiased;

  a {
    color: ${colors.link};
    text-decoration: none;
    transition: color 0.15s ease;
  }
  a:hover {
    color: ${colors.primaryHover};
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    margin: 0;
    border-radius: 0;
    box-shadow: none;
  }

  @media print {
    max-width: none;
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    font-size: 12px;
    a { color: ${colors.text}; }
  }
`;

const Header = styled.header`
  background: ${colors.headerBg};
  color: ${colors.headerText};
  padding: ${spacing.xl} ${spacing.xl} ${spacing.lg};

  @media (max-width: 768px) {
    padding: ${spacing.lg} ${spacing.md};
  }

  @media print {
    padding: ${spacing.md} ${spacing.md} ${spacing.sm};
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const Name = styled.h1`
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 ${spacing.sm};
  line-height: 1.2;

  @media (max-width: 768px) { font-size: 26px; }
  @media print { font-size: 26px; }
`;

const LabelBadge = styled.span`
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  color: ${colors.headerSubtle};
  margin-bottom: ${spacing.md};
  padding: ${spacing.xs} ${spacing.sm};
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;

  @media print {
    font-size: 12px;
    border-color: rgba(0, 0, 0, 0.1);
    color: #555;
  }
`;

const SummaryText = styled.p`
  font-size: 14px;
  line-height: 1.7;
  color: ${colors.headerSubtle};
  margin: 0;

  @media print { color: #555; }
`;

const StyledContactInfo = styled(ContactInfo)`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.md};
  margin-top: ${spacing.md};
  font-size: 13px;

  a { color: ${colors.headerSubtle}; }
  a:hover { color: #fff; }
  .contact-item { color: ${colors.headerSubtle}; }

  @media print {
    a { color: ${colors.text}; }
    .contact-item { color: ${colors.textSecondary}; }
  }
`;

// --- Two-Column Layout ---
const Layout = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  min-height: 500px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  background: ${colors.sidebarBg};
  padding: ${spacing.lg} ${spacing.md} ${spacing.lg} ${spacing.lg};
  border-right: 1px solid ${colors.borderLight};

  @media (max-width: 768px) {
    padding: ${spacing.md};
    border-right: none;
    border-bottom: 1px solid ${colors.borderLight};
  }

  @media print {
    padding: ${spacing.md} ${spacing.sm} ${spacing.md} ${spacing.md};
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const Main = styled.main`
  padding: ${spacing.lg} ${spacing.xl} ${spacing.lg} ${spacing.lg};

  @media (max-width: 768px) { padding: ${spacing.md}; }
  @media print { padding: ${spacing.md}; }
`;

// --- Sidebar Section ---
const SideSection = styled.section`
  margin-bottom: ${spacing.lg};
  &:last-child { margin-bottom: 0; }
`;

const SideSectionTitle = styled.h3`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${colors.textSubtle};
  margin: 0 0 ${spacing.md};
  padding-bottom: ${spacing.sm};
  border-bottom: 2px solid ${colors.border};
`;

const ContactItem = styled.div`
  font-size: 13px;
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.sm};
  &:last-child { margin-bottom: 0; }
`;

const ContactIcon = styled.span`
  font-size: 12px;
  color: ${colors.textSubtle};
  width: 16px;
  text-align: center;
  flex-shrink: 0;
`;

const ProfileItem = styled.div`
  font-size: 13px;
  margin-bottom: ${spacing.sm};
  &:last-child { margin-bottom: 0; }
`;

const ProfileNetwork = styled.span`
  display: block;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${colors.textSubtle};
  margin-bottom: 1px;
`;

const SkillBlock = styled.div`
  margin-bottom: ${spacing.sm};
  &:last-child { margin-bottom: 0; }
`;

const SkillHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: ${spacing.xs};
`;

const SkillName = styled.span`
  font-weight: 600;
  font-size: 13px;
  color: ${colors.text};
`;

const SkillLevel = styled.span`
  font-size: 11px;
  color: ${colors.textSubtle};
  font-weight: 500;
`;

const StyledBadge = styled(Badge)`
  font-size: 11px;
  padding: 2px 8px;
  background: ${colors.tagBg};
  color: ${colors.tagText};
  border: none;
  border-radius: 4px;
  line-height: 1.5;
`;

const StyledBadgeList = styled(BadgeList)`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const AccentBadge = styled(StyledBadge)`
  background: ${colors.tagAccentBg};
  color: ${colors.tagAccentText};
`;

const LangRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: ${spacing.sm};
  &:last-child { margin-bottom: 0; }
`;

const LangName = styled.span`
  font-weight: 600;
  font-size: 13px;
  color: ${colors.text};
`;

const LangFluency = styled.span`
  font-size: 12px;
  color: ${colors.textSecondary};
  font-style: italic;
`;

const InterestName = styled.div`
  font-weight: 600;
  font-size: 13px;
  color: ${colors.text};
  margin-bottom: ${spacing.xs};
`;

const CertBlock = styled.div`
  font-size: 13px;
  margin-bottom: ${spacing.sm};
  &:last-child { margin-bottom: 0; }
`;

const CertName = styled.div`
  font-weight: 600;
  color: ${colors.text};
  margin-bottom: 1px;
`;

const CertIssuer = styled.div`
  font-size: 12px;
  color: ${colors.textSecondary};
`;

const CertDate = styled.div`
  font-size: 11px;
  color: ${colors.textSubtle};
`;

// --- Main Section ---
const StyledSection = styled(Section)`
  margin-bottom: ${spacing.lg};
  &:last-child { margin-bottom: 0; }
`;

const StyledSectionTitle = styled(SectionTitle)`
  font-size: 16px;
  font-weight: 700;
  color: ${colors.text};
  margin: 0 0 ${spacing.md};
  padding-bottom: ${spacing.sm};
  border-bottom: 3px solid ${colors.primary};

  @media print {
    font-size: 14px;
    margin-bottom: ${spacing.sm};
    border-bottom-color: ${colors.text};
  }
`;

const EntryBlock = styled.div`
  margin-bottom: ${spacing.md};
  &:last-child { margin-bottom: 0; }
  @media print { break-inside: avoid; }
`;

const EntryHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: ${spacing.md};
  margin-bottom: 2px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2px;
  }
`;

const EntryOrg = styled.div`
  font-weight: 700;
  font-size: 15px;
  color: ${colors.text};
  a { color: ${colors.text}; }
  a:hover { color: ${colors.primary}; }
`;

const MetaDate = styled.div`
  font-size: 12px;
  color: ${colors.textSubtle};
  white-space: nowrap;
  font-weight: 500;

  @media (max-width: 768px) { white-space: normal; }
`;

const EntryPos = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${colors.primary};
  margin-bottom: ${spacing.xs};

  @media print { color: ${colors.text}; }
`;

const EntryLoc = styled.div`
  font-size: 13px;
  color: ${colors.textSubtle};
  margin-bottom: ${spacing.xs};
`;

const Desc = styled.p`
  font-size: 14px;
  color: ${colors.textSecondary};
  line-height: 1.7;
  margin: 0 0 ${spacing.sm};
  &:last-child { margin: 0; }
`;

const Highlights = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${spacing.sm} 0 0;
`;

const HighlightItem = styled.li`
  font-size: 13px;
  color: ${colors.textSecondary};
  line-height: 1.6;
  padding-left: ${spacing.md};
  position: relative;
  margin-bottom: 3px;
  &::before {
    content: "";
    position: absolute;
    left: 2px;
    top: 9px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${colors.marker};
    opacity: 0.5;
  }
`;

const CardBlock = styled.div`
  margin-bottom: ${spacing.sm};
  padding: ${spacing.md};
  background: ${colors.surface};
  border: 1px solid ${colors.borderLight};
  border-radius: 8px;
  transition: box-shadow 0.15s ease;
  &:hover { box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06); }
  &:last-child { margin-bottom: 0; }
  @media print {
    break-inside: avoid;
    border: 1px solid #ddd;
    box-shadow: none !important;
  }
`;

const NotiItem = styled.div`
  margin-bottom: ${spacing.md};
  &:last-child { margin-bottom: 0; }
`;

const NotiTitle = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: ${colors.text};
`;

const NotiMeta = styled.div`
  font-size: 12px;
  color: ${colors.textSubtle};
  margin-bottom: ${spacing.xs};
`;

const RefName = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: ${colors.text};
  margin-bottom: ${spacing.xs};
`;

const RefText = styled.div`
  font-size: 13px;
  color: ${colors.textSecondary};
  line-height: 1.6;
  font-style: italic;
`;

// --- Helpers ---
function renderSidebarBasics(basics) {
  const { email, phone, url, location } = basics;
  const locStr = formatLocation(location);
  return (
    <SideSection>
      <SideSectionTitle>Contact</SideSectionTitle>
      {email && (
        <ContactItem>
          <ContactIcon>@</ContactIcon>
          <a href={`mailto:${email}`}>{email}</a>
        </ContactItem>
      )}
      {phone && (
        <ContactItem>
          <ContactIcon>&#9990;</ContactIcon>
          <span>{phone}</span>
        </ContactItem>
      )}
      {url && (
        <ContactItem>
          <ContactIcon>&#127760;</ContactIcon>
          <a href={url}>{url}</a>
        </ContactItem>
      )}
      {locStr && (
        <ContactItem>
          <ContactIcon>&#9906;</ContactIcon>
          <span>{locStr}</span>
        </ContactItem>
      )}
    </SideSection>
  );
}

function renderSidebarProfiles(profiles) {
  if (!profiles || profiles.length === 0) return null;
  return (
    <SideSection>
      <SideSectionTitle>Profiles</SideSectionTitle>
      {profiles.map((p, i) => (
        <ProfileItem key={i}>
          <ProfileNetwork>{p.network}</ProfileNetwork>
          {p.url ? <a href={p.url}>{p.username}</a> : <span>{p.username}</span>}
        </ProfileItem>
      ))}
    </SideSection>
  );
}

function renderSidebarSkills(skills) {
  if (!skills || skills.length === 0) return null;
  return (
    <SideSection>
      <SideSectionTitle>Skills</SideSectionTitle>
      {skills.map((s, i) => (
        <SkillBlock key={i}>
          <SkillHeader>
            <SkillName>{s.name}</SkillName>
            {s.level && <SkillLevel>{s.level}</SkillLevel>}
          </SkillHeader>
          {s.keywords && s.keywords.length > 0 && (
            <StyledBadgeList>
              {s.keywords.map((kw, j) => (
                <StyledBadge key={j}>{kw}</StyledBadge>
              ))}
            </StyledBadgeList>
          )}
        </SkillBlock>
      ))}
    </SideSection>
  );
}

function renderSidebarLanguages(languages) {
  if (!languages || languages.length === 0) return null;
  return (
    <SideSection>
      <SideSectionTitle>Languages</SideSectionTitle>
      {languages.map((l, i) => (
        <LangRow key={i}>
          <LangName>{l.language}</LangName>
          {l.fluency && <LangFluency>{l.fluency}</LangFluency>}
        </LangRow>
      ))}
    </SideSection>
  );
}

function renderSidebarInterests(interests) {
  if (!interests || interests.length === 0) return null;
  return (
    <SideSection>
      <SideSectionTitle>Interests</SideSectionTitle>
      {interests.map((inter, i) => (
        <div key={i} style={{ marginBottom: spacing.sm }}>
          <InterestName>{inter.name}</InterestName>
          {inter.keywords && inter.keywords.length > 0 && (
            <StyledBadgeList>
              {inter.keywords.map((kw, j) => (
                <StyledBadge key={j}>{kw}</StyledBadge>
              ))}
            </StyledBadgeList>
          )}
        </div>
      ))}
    </SideSection>
  );
}

function renderSidebarCertificates(certificates) {
  if (!certificates || certificates.length === 0) return null;
  return (
    <SideSection>
      <SideSectionTitle>Certificates</SideSectionTitle>
      {certificates.map((c, i) => (
        <CertBlock key={i}>
          <CertName>{c.name}</CertName>
          {c.issuer && <CertIssuer>{c.issuer}</CertIssuer>}
          {c.date && <CertDate>{c.date}</CertDate>}
        </CertBlock>
      ))}
    </SideSection>
  );
}

function renderHighlights(items) {
  if (!items || items.length === 0) return null;
  return (
    <Highlights>
      {items.map((h, i) => (
        <HighlightItem key={i}>{h}</HighlightItem>
      ))}
    </Highlights>
  );
}

function renderWork(work) {
  if (!work || work.length === 0) return null;
  return (
    <StyledSection>
      <StyledSectionTitle>Experience</StyledSectionTitle>
      {work.map((w, i) => (
        <EntryBlock key={i}>
          <EntryHead>
            <EntryOrg>{w.url ? <a href={w.url}>{w.company || w.name}</a> : (w.company || w.name)}</EntryOrg>
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

function renderEducation(education) {
  if (!education || education.length === 0) return null;
  return (
    <StyledSection>
      <StyledSectionTitle>Education</StyledSectionTitle>
      {education.map((e, i) => (
        <EntryBlock key={i}>
          <EntryHead>
            <EntryOrg>{e.url ? <a href={e.url}>{e.institution}</a> : e.institution}</EntryOrg>
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

function renderProjects(projects) {
  if (!projects || projects.length === 0) return null;
  return (
    <StyledSection>
      <StyledSectionTitle>Projects</StyledSectionTitle>
      {projects.map((p, i) => (
        <CardBlock key={i}>
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
            <StyledBadgeList style={{ marginTop: spacing.sm }}>
              {p.keywords.map((kw, j) => (
                <AccentBadge key={j}>{kw}</AccentBadge>
              ))}
            </StyledBadgeList>
          )}
        </CardBlock>
      ))}
    </StyledSection>
  );
}

function renderVolunteer(volunteer) {
  if (!volunteer || volunteer.length === 0) return null;
  return (
    <StyledSection>
      <StyledSectionTitle>Volunteer</StyledSectionTitle>
      {volunteer.map((v, i) => (
        <EntryBlock key={i}>
          <EntryHead>
            <EntryOrg>{v.url ? <a href={v.url}>{v.organization}</a> : v.organization}</EntryOrg>
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

function renderAwards(awards) {
  if (!awards || awards.length === 0) return null;
  return (
    <StyledSection>
      <StyledSectionTitle>Awards</StyledSectionTitle>
      {awards.map((a, i) => (
        <NotiItem key={i}>
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

function renderCertificates(certificates) {
  if (!certificates || certificates.length === 0) return null;
  return (
    <StyledSection>
      <StyledSectionTitle>Certificates</StyledSectionTitle>
      {certificates.map((c, i) => (
        <NotiItem key={i}>
          <NotiTitle>
            {c.url ? <Link href={safeUrl(c.url)}>{c.name}</Link> : c.name}
          </NotiTitle>
          {(c.issuer || c.date) && (
            <NotiMeta>
              {[c.issuer, c.date].filter(Boolean).join(' \u2022 ')}
            </NotiMeta>
          )}
        </NotiItem>
      ))}
    </StyledSection>
  );
}

function renderPublications(publications) {
  if (!publications || publications.length === 0) return null;
  return (
    <StyledSection>
      <StyledSectionTitle>Publications</StyledSectionTitle>
      {publications.map((p, i) => (
        <NotiItem key={i}>
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

function renderLanguages(languages) {
  if (!languages || languages.length === 0) return null;
  return (
    <StyledSection>
      <StyledSectionTitle>Languages</StyledSectionTitle>
      <StyledBadgeList>
        {languages.map((l, i) => (
          <StyledBadge key={i}>
            {l.language}{l.fluency ? ` \u2014 ${l.fluency}` : ''}
          </StyledBadge>
        ))}
      </StyledBadgeList>
    </StyledSection>
  );
}

function renderInterests(interests) {
  if (!interests || interests.length === 0) return null;
  return (
    <StyledSection>
      <StyledSectionTitle>Interests</StyledSectionTitle>
      {interests.map((inter, i) => (
        <NotiItem key={i}>
          <NotiTitle>{inter.name}</NotiTitle>
          {inter.keywords && inter.keywords.length > 0 && (
            <NotiMeta>{inter.keywords.join(', ')}</NotiMeta>
          )}
        </NotiItem>
      ))}
    </StyledSection>
  );
}

function renderReferences(references) {
  if (!references || references.length === 0) return null;
  return (
    <StyledSection>
      <StyledSectionTitle>References</StyledSectionTitle>
      {references.map((r, i) => (
        <CardBlock key={i}>
          {r.name && <RefName>{r.name}</RefName>}
          {r.reference && <RefText>{r.reference}</RefText>}
        </CardBlock>
      ))}
    </StyledSection>
  );
}

export default function Resume({ resume }) {
  const {
    basics = {},
    work = [],
    education = [],
    skills = [],
    projects = [],
    volunteer = [],
    awards = [],
    certificates = [],
    publications = [],
    languages = [],
    interests = [],
    references = [],
  } = resume;

  return (
    <Page>
      <Header>
        {basics.name && <Name>{basics.name}</Name>}
        {basics.label && <LabelBadge>{basics.label}</LabelBadge>}
        {basics.summary && <SummaryText>{basics.summary}</SummaryText>}
        <StyledContactInfo basics={basics} />
      </Header>

      <Layout>
        <Sidebar>
          {renderSidebarBasics(basics)}
          {renderSidebarProfiles(basics.profiles)}
          {renderSidebarSkills(skills)}
          {renderSidebarLanguages(languages)}
          {renderSidebarInterests(interests)}
          {renderSidebarCertificates(certificates)}
        </Sidebar>

        <Main>
          {renderWork(work)}
          {renderEducation(education)}
          {renderProjects(projects)}
          {renderVolunteer(volunteer)}
          {renderAwards(awards)}
          {renderCertificates(certificates)}
          {renderPublications(publications)}
          {renderLanguages(languages)}
          {renderInterests(interests)}
          {renderReferences(references)}
        </Main>
      </Layout>
    </Page>
  );
}
