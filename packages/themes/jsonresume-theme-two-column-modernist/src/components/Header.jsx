import React from 'react';
import styled from 'styled-components';
import { safeUrl } from '@resume/core';

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
    color: #1f1f1f;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: #6b7280;
    }
  }
`;

export function Header({ basics }) {
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
