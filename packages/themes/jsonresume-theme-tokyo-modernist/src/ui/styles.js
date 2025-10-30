import styled from 'styled-components';
import { SectionTitle, ContactInfo } from '@resume/core';

export const Layout = styled.div`
  max-width: 840px;
  margin: 0 auto;
  padding: 48px 40px;
  background: #fafbfc;
  font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  color: #1a1d23;
  line-height: 1.6;

  @media print {
    padding: 40px;
    background: white;
  }
`;

export const Header = styled.header`
  margin-bottom: 56px;
  padding: 40px;
  background: linear-gradient(
    135deg,
    rgba(199, 21, 133, 0.03) 0%,
    rgba(199, 21, 133, 0.01) 100%
  );
  border-left: 8px solid #c71585;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, transparent 50%, #c71585 50%);
    opacity: 0.08;
    clip-path: polygon(100% 0, 100% 100%, 0 0);
  }
`;

export const Name = styled.h1`
  font-size: 56px;
  font-weight: 800;
  color: #1a1d23;
  margin: 0 0 8px 0;
  letter-spacing: -2px;
  line-height: 1.1;
  text-transform: uppercase;
  font-variation-settings: 'wght' 800;
`;

export const Label = styled.div`
  font-size: 20px;
  color: #6b7280;
  margin-bottom: 24px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: 14px;
`;

export const StyledContactInfo = styled(ContactInfo)`
  font-size: 15px;
  display: flex;
  gap: 24px;
  flex-wrap: wrap;

  a {
    font-size: 15px;
    color: #c71585;
    text-decoration: none;
    font-weight: 600;
    position: relative;
    padding-bottom: 2px;

    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: #c71585;
      transition: width 0.3s ease;
    }

    &:hover:after {
      width: 100%;
    }
  }
`;

export const Summary = styled.p`
  font-size: 17px;
  line-height: 1.7;
  color: #4b5563;
  margin: 24px 0 0 0;
  max-width: 680px;
`;

export const StyledSectionTitle = styled(SectionTitle)`
  font-size: 32px;
  font-weight: 800;
  color: #1a1d23;
  margin: 48px 0 32px 0;
  padding-bottom: 16px;
  border-bottom: 3px solid #c71585;
  position: relative;
  text-transform: uppercase;
  letter-spacing: -1px;
  display: inline-block;
  min-width: 280px;

  &:after {
    content: '';
    position: absolute;
    bottom: -3px;
    right: -40px;
    width: 32px;
    height: 3px;
    background: #e5e7eb;
  }
`;

export const WorkItem = styled.div`
  margin-bottom: 40px;
  padding: 32px;
  background: white;
  border-left: 4px solid #e5e7eb;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    border-left-color: #c71585;
    box-shadow: -4px 0 0 0 rgba(199, 21, 133, 0.1);
  }

  &:before {
    content: '';
    position: absolute;
    top: 32px;
    left: -8px;
    width: 8px;
    height: 8px;
    background: #c71585;
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const WorkHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  margin-bottom: 16px;
  gap: 24px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

export const Position = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #1a1d23;
  margin: 0;
  letter-spacing: -0.5px;
`;

export const Company = styled.div`
  font-size: 18px;
  color: #c71585;
  font-weight: 600;
  margin-top: 4px;
  letter-spacing: 0.2px;
`;

export const DateText = styled.div`
  font-size: 13px;
  color: #9ca3af;
  font-weight: 600;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: right;

  @media (max-width: 640px) {
    text-align: left;
  }
`;

export const WorkSummary = styled.p`
  margin: 16px 0;
  color: #4b5563;
  line-height: 1.7;
  font-size: 16px;
`;

export const Highlights = styled.ul`
  margin: 16px 0 0 0;
  padding: 0;
  list-style-type: none;
  display: grid;
  gap: 12px;

  li {
    color: #4b5563;
    line-height: 1.7;
    font-size: 15px;
    padding-left: 24px;
    position: relative;

    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 10px;
      width: 12px;
      height: 2px;
      background: #c71585;
    }
  }
`;

export const EducationItem = styled.div`
  margin-bottom: 32px;
  padding: 24px 32px;
  background: white;
  border-top: 2px solid #e5e7eb;
  border-bottom: 2px solid #e5e7eb;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Institution = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1a1d23;
  margin: 0 0 8px 0;
  letter-spacing: -0.3px;
`;

export const Degree = styled.div`
  font-size: 17px;
  color: #4b5563;
  margin-bottom: 8px;
  font-weight: 500;
`;

export const EducationDate = styled.div`
  font-size: 13px;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

export const SkillCategory = styled.div`
  padding: 24px;
  background: white;
  border: 2px solid #e5e7eb;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, #c71585 0%, transparent 100%);
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, transparent 50%, #c71585 50%);
    opacity: 0.08;
    clip-path: polygon(100% 0, 100% 100%, 0 0);
  }
`;

export const SkillName = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: #1a1d23;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-size: 14px;
`;

export const SkillTags = styled.div`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  font-weight: 500;
`;

export const ProjectItem = styled(WorkItem)`
  background: linear-gradient(135deg, rgba(199, 21, 133, 0.02) 0%, white 100%);
`;
