import React from 'react';
import styled from 'styled-components';
import { safeUrl } from '../utils/security.js';

/**
 * ContactInfo Component
 * Displays contact information from resume basics
 *
 * @component
 * @example
 * <ContactInfo basics={resume.basics} />
 */

const ContactContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${(props) =>
    props.theme?.spacing?.small || 'var(--resume-space-small, 12px)'};
  flex-wrap: wrap;
  font-size: ${(props) =>
    props.theme?.typography?.small || 'var(--resume-size-small, 10pt)'};
  color: ${(props) =>
    props.theme?.colors?.text || 'var(--resume-color-text, #333)'};

  a {
    color: ${(props) =>
      props.theme?.colors?.link || 'var(--resume-color-link, #0066cc)'};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ContactItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const Separator = styled.span`
  color: ${(props) =>
    props.theme?.colors?.muted || 'var(--resume-color-muted, #999)'};
`;

export function ContactInfo({ basics = {}, separator = '•', className }) {
  const { email, phone, url, location, profiles = [] } = basics;

  const items = [];

  if (email) {
    items.push(
      <ContactItem key="email">
        <a href={safeUrl(`mailto:${email}`)} aria-label="Email">
          {email}
        </a>
      </ContactItem>
    );
  }

  if (phone) {
    items.push(
      <ContactItem key="phone">
        <a href={safeUrl(`tel:${phone}`)} aria-label="Phone">
          {phone}
        </a>
      </ContactItem>
    );
  }

  if (location) {
    const locationStr = [location.city, location.region, location.countryCode]
      .filter(Boolean)
      .join(', ');
    if (locationStr) {
      items.push(
        <ContactItem key="location" aria-label="Location">
          {locationStr}
        </ContactItem>
      );
    }
  }

  if (url) {
    const displayUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    items.push(
      <ContactItem key="url">
        <a
          href={safeUrl(url)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Website"
        >
          {displayUrl}
        </a>
      </ContactItem>
    );
  }

  // Add social profiles
  profiles.forEach((profile, index) => {
    if (profile.url) {
      items.push(
        <ContactItem key={`profile-${index}`}>
          <a
            href={safeUrl(profile.url)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={profile.network}
          >
            {profile.network || profile.username}
          </a>
        </ContactItem>
      );
    }
  });

  if (items.length === 0) return null;

  return (
    <ContactContainer className={`resume-contact ${className || ''}`.trim()}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <Separator aria-hidden="true">{separator}</Separator>}
          {item}
        </React.Fragment>
      ))}
    </ContactContainer>
  );
}

export default ContactInfo;
