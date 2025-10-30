import styled from 'styled-components';

export const WorkItem = styled.div`
  padding: 24px 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

export const WorkHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px;
  margin-bottom: 12px;
  align-items: baseline;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

export const Position = styled.h3`
  font-size: 18px;
  font-weight: 400;
  color: #111827;
  margin: 0;
  letter-spacing: 0.5px;
`;

export const Company = styled.div`
  font-size: 15px;
  color: #6b7280;
  font-weight: 300;
  margin-top: 4px;
`;

export const DateText = styled.div`
  font-size: 13px;
  color: #9ca3af;
  font-weight: 300;
  white-space: nowrap;
  letter-spacing: 0.5px;
`;

export const WorkSummary = styled.p`
  margin: 12px 0;
  color: #4b5563;
  line-height: 1.8;
  font-size: 14px;
  font-weight: 300;
`;

export const Highlights = styled.ul`
  margin: 12px 0 0 0;
  padding-left: 20px;
  list-style-type: none;

  li {
    margin: 8px 0;
    color: #4b5563;
    line-height: 1.8;
    font-size: 14px;
    font-weight: 300;
    position: relative;

    &::before {
      content: '—';
      position: absolute;
      left: -20px;
      color: #6b7280;
    }
  }
`;

export const EducationItem = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

export const Institution = styled.h3`
  font-size: 16px;
  font-weight: 400;
  color: #111827;
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
`;

export const Degree = styled.div`
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 6px;
  font-weight: 300;
`;

export const EducationDate = styled.div`
  font-size: 13px;
  color: #9ca3af;
  font-weight: 300;
`;

export const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1px;
  background: #e5e7eb;
  border: 1px solid #e5e7eb;
`;

export const SkillCategory = styled.div`
  padding: 20px;
  background: #fafaf9;
`;

export const SkillName = styled.h4`
  font-size: 13px;
  font-weight: 400;
  color: #6b7280;
  margin: 0 0 8px 0;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

export const SkillTags = styled.div`
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  font-weight: 300;
`;
