import styled from 'styled-components';
import { SectionTitle, ContactInfo } from '@resume/core';

export const Layout = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 50px;
  background: white;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  color: #1f2937;
  line-height: 1.9;

  @media print {
    padding: 40px;
  }
`;

export const Header = styled.header`
  margin-bottom: 60px;
  text-align: center;
`;

export const Name = styled.h1`
  font-size: 48px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
`;

export const Label = styled.div`
  font-size: 18px;
  color: #e11d48;
  margin-bottom: 24px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const StyledContactInfo = styled(ContactInfo)`
  font-size: 15px;
  justify-content: center;
  margin-bottom: 30px;

  a {
    font-size: 15px;
    color: #e11d48;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.7;
    }
  }
`;

export const Summary = styled.div`
  font-size: 17px;
  line-height: 2;
  color: #374151;
  margin: 30px auto 0;
  max-width: 800px;
  font-weight: 400;
  text-align: left;
`;

export const StyledSectionTitle = styled(SectionTitle)`
  font-size: 24px;
  font-weight: 700;
  color: #e11d48;
  margin: 50px 0 30px 0;
  padding-bottom: 12px;
  border-bottom: 3px solid #e11d48;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const StoryItem = styled.div`
  margin-bottom: 45px;
  padding-bottom: 40px;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    margin-bottom: 0;
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const StoryHeader = styled.div`
  margin-bottom: 20px;
`;

export const Position = styled.h3`
  font-size: 22px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
  line-height: 1.4;
`;

export const CompanyAndDate = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
`;

export const Company = styled.div`
  font-size: 17px;
  color: #e11d48;
  font-weight: 600;
`;

export const DateText = styled.div`
  font-size: 15px;
  color: #6b7280;
  font-weight: 500;
  white-space: nowrap;
`;

export const Narrative = styled.div`
  font-size: 16px;
  line-height: 2;
  color: #4b5563;
  margin: 20px 0;
`;

export const Achievements = styled.div`
  margin: 20px 0 0 0;
`;

export const AchievementItem = styled.div`
  margin: 16px 0;
  padding-left: 24px;
  position: relative;
  color: #374151;
  line-height: 1.9;
  font-size: 15px;

  &:before {
    content: '▸';
    position: absolute;
    left: 0;
    color: #e11d48;
    font-weight: 700;
  }
`;

export const EducationItem = styled.div`
  margin-bottom: 32px;
  padding-bottom: 30px;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    margin-bottom: 0;
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const Institution = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 10px 0;
`;

export const Degree = styled.div`
  font-size: 16px;
  color: #4b5563;
  margin-bottom: 8px;
  line-height: 1.8;
`;

export const EducationDate = styled.div`
  font-size: 15px;
  color: #6b7280;
  font-weight: 500;
`;

export const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
`;

export const SkillCategory = styled.div`
  padding: 20px;
  background: #fef2f2;
  border-radius: 8px;
  border-left: 4px solid #e11d48;
`;

export const SkillName = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #e11d48;
  margin: 0 0 12px 0;
`;

export const SkillTags = styled.div`
  font-size: 15px;
  color: #6b7280;
  line-height: 1.8;
`;

export const QuoteBlock = styled.blockquote`
  font-size: 17px;
  line-height: 2;
  color: #4b5563;
  font-style: italic;
  margin: 20px 0;
  padding: 24px 30px;
  background: #fef2f2;
  border-left: 4px solid #e11d48;
  border-radius: 4px;
`;
