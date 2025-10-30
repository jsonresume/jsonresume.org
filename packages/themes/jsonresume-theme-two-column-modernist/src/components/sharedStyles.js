import styled from 'styled-components';

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Title = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0;
  color: #1f1f1f;
  border-bottom: 1px solid #d1d5db;
  padding-bottom: 0.5rem;
`;

export const Entry = styled.article`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const EntryHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const EntryTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: #1f1f1f;
`;

export const EntryMeta = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
`;

export const EntryOrganization = styled.span`
  font-weight: 500;
  color: #4b5563;
`;

export const EntryDate = styled.span`
  color: #9ca3af;
  font-size: 0.8rem;
`;

export const EntryDescription = styled.p`
  font-size: 0.9rem;
  line-height: 1.7;
  color: #374151;
  margin: 0;
  white-space: pre-wrap;
`;

export const HighlightsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const HighlightItem = styled.li`
  font-size: 0.85rem;
  color: #4b5563;
  padding-left: 1rem;
  position: relative;

  &::before {
    content: '—';
    position: absolute;
    left: 0;
    color: #d1d5db;
  }
`;

export const Summary = styled.p`
  font-size: 0.9rem;
  line-height: 1.7;
  color: #374151;
  margin: 0;
  white-space: pre-wrap;
`;

export const SkillList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const SkillItem = styled.li`
  font-size: 0.8rem;
  color: #4b5563;
  background: #f3f4f6;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
`;
