/*
 * UTF-8 Safe — Sidebar Section Render Helpers
 *
 * Renders contact, profiles, skills, languages, interests, and certificates
 * in the left sidebar. Every external URL uses safeUrl().
 */
import React from 'react';
import { safeUrl, formatLocation } from '@jsonresume/utils';
import {
  SideSection,
  SideSectionTitle,
  ContactItem,
  ContactIcon,
  ProfileItem,
  ProfileNetwork,
  SkillBlock,
  SkillHeader,
  SkillName,
  SkillLevel,
  StyledBadgeList,
  StyledBadge,
  AccentBadge,
  LangRow,
  LangName,
  LangFluency,
  InterestName,
  CertBlock,
  CertName,
  CertIssuer,
  CertDate,
} from '../styled-sidebar.js';
import { spacing } from '../tokens.js';

export function renderSidebarBasics(basics) {
  const { email, phone, url, location } = basics;
  const locStr = formatLocation(location);
  return (
    <SideSection key="contact">
      <SideSectionTitle>Contact</SideSectionTitle>
      {email && (
        <ContactItem key="email">
          <ContactIcon>@</ContactIcon>
          <a href={`mailto:${email}`}>{email}</a>
        </ContactItem>
      )}
      {phone && (
        <ContactItem key="phone">
          <ContactIcon>&#9990;</ContactIcon>
          <span>{phone}</span>
        </ContactItem>
      )}
      {url && (
        <ContactItem key="web">
          <ContactIcon>&#127760;</ContactIcon>
          <a href={safeUrl(url)}>{url}</a>
        </ContactItem>
      )}
      {locStr && (
        <ContactItem key="location">
          <ContactIcon>&#9906;</ContactIcon>
          <span>{locStr}</span>
        </ContactItem>
      )}
    </SideSection>
  );
}

export function renderSidebarProfiles(profiles) {
  if (!profiles || profiles.length === 0) return null;
  return (
    <SideSection key="profiles">
      <SideSectionTitle>Profiles</SideSectionTitle>
      {profiles.map((p) => (
        <ProfileItem key={p.network || p.username}>
          <ProfileNetwork>{p.network}</ProfileNetwork>
          {p.url ? (
            <a href={safeUrl(p.url)}>{p.username}</a>
          ) : (
            <span>{p.username}</span>
          )}
        </ProfileItem>
      ))}
    </SideSection>
  );
}

export function renderSidebarSkills(skills) {
  if (!skills || skills.length === 0) return null;
  return (
    <SideSection key="skills">
      <SideSectionTitle>Skills</SideSectionTitle>
      {skills.map((s) => (
        <SkillBlock key={s.name}>
          <SkillHeader>
            <SkillName>{s.name}</SkillName>
            {s.level && <SkillLevel>{s.level}</SkillLevel>}
          </SkillHeader>
          {s.keywords && s.keywords.length > 0 && (
            <StyledBadgeList>
              {s.keywords.map((kw) => (
                <StyledBadge key={kw}>{kw}</StyledBadge>
              ))}
            </StyledBadgeList>
          )}
        </SkillBlock>
      ))}
    </SideSection>
  );
}

export function renderSidebarLanguages(languages) {
  if (!languages || languages.length === 0) return null;
  return (
    <SideSection key="languages">
      <SideSectionTitle>Languages</SideSectionTitle>
      {languages.map((l) => (
        <LangRow key={l.language}>
          <LangName>{l.language}</LangName>
          {l.fluency && <LangFluency>{l.fluency}</LangFluency>}
        </LangRow>
      ))}
    </SideSection>
  );
}

export function renderSidebarInterests(interests) {
  if (!interests || interests.length === 0) return null;
  return (
    <SideSection key="interests">
      <SideSectionTitle>Interests</SideSectionTitle>
      {interests.map((inter) => (
        <div key={inter.name} style={{ marginBottom: spacing.sm }}>
          <InterestName>{inter.name}</InterestName>
          {inter.keywords && inter.keywords.length > 0 && (
            <StyledBadgeList>
              {inter.keywords.map((kw) => (
                <StyledBadge key={kw}>{kw}</StyledBadge>
              ))}
            </StyledBadgeList>
          )}
        </div>
      ))}
    </SideSection>
  );
}

export function renderSidebarCertificates(certificates) {
  if (!certificates || certificates.length === 0) return null;
  return (
    <SideSection key="certificates">
      <SideSectionTitle>Certificates</SideSectionTitle>
      {certificates.map((c) => (
        <CertBlock key={c.name}>
          <CertName>{c.name}</CertName>
          {c.issuer && <CertIssuer>{c.issuer}</CertIssuer>}
          {c.date && <CertDate>{c.date}</CertDate>}
        </CertBlock>
      ))}
    </SideSection>
  );
}
