import React from 'react';
import styled from 'styled-components';

const SidebarSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SidebarTitle = styled.h2`
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0;
  color: #1f1f1f;
`;

const LanguageList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const LanguageItem = styled.li`
  font-size: 0.85rem;
  color: #374151;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LanguageName = styled.span`
  font-weight: 500;
  color: #1f1f1f;
`;

const LanguageFluency = styled.span`
  font-size: 0.8rem;
  color: #6b7280;
`;

export function Languages({ languages }) {
  if (!languages || languages.length === 0) return null;

  return (
    <SidebarSection>
      <SidebarTitle>Languages</SidebarTitle>
      <LanguageList>
        {languages.map((lang, i) => (
          <LanguageItem key={i}>
            <LanguageName>{lang.language}</LanguageName>
            {lang.fluency && <LanguageFluency>{lang.fluency}</LanguageFluency>}
          </LanguageItem>
        ))}
      </LanguageList>
    </SidebarSection>
  );
}
