import styled from 'styled-components';
import { Section, SectionTitle, ContactInfo } from '@jsonresume/core';

const ACCENT = '#d97706';

export const Layout = styled.div`
  max-width: 880px;
  margin: 0 auto;
  padding: 64px 72px;
  background: #fefbf5;
  color: #3f2f25;
  font-family: 'Nunito', 'Inter', 'Segoe UI', sans-serif;
  line-height: 1.7;
  border-radius: 20px;
  box-shadow: 0 32px 60px rgba(149, 108, 57, 0.12);
  border: 1px solid rgba(217, 119, 6, 0.16);

  @media (max-width: 720px) {
    padding: 48px 28px;
  }

  @media print {
    padding: 40px 48px;
    border-radius: 0;
    box-shadow: none;
    border: none;
    background: white;
  }
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
  padding-bottom: 28px;
  border-bottom: 1px solid rgba(217, 119, 6, 0.25);
`;

export const Name = styled.h1`
  font-size: 38px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #92400e;
  margin: 0;
`;

export const Label = styled.div`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #b45309;
`;

export const StyledContactInfo = styled(ContactInfo)`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  font-size: 13px;
  color: #6f5d4e;

  a {
    color: #b45309;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s ease;

    &:hover {
      border-color: rgba(217, 119, 6, 0.5);
    }
  }
`;

export const Summary = styled.p`
  margin: 0;
  padding: 18px 22px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(217, 119, 6, 0.12);
  color: #4f3d31;
  font-size: 15px;
  line-height: 1.8;
`;

export const SectionBlock = styled(Section)`
  margin-bottom: 36px;
  padding-top: 24px;
  border-top: 1px solid rgba(217, 119, 6, 0.18);

  &:last-of-type {
    margin-bottom: 0;
  }
`;

export const SectionHeading = styled(SectionTitle)`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #b45309;
  margin: 0 0 20px 0;

  &::before {
    content: '';
    display: block;
    width: 36px;
    height: 2px;
    background: currentColor;
    opacity: 0.4;
  }
`;

export const Entry = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

export const EntryTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #4a3326;
  letter-spacing: 0.01em;
`;

export const EntrySubtitle = styled.div`
  font-size: 14px;
  color: #7c6a58;
`;

export const EntryMeta = styled.div`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #b45309;
  white-space: nowrap;
`;

export const EntrySummary = styled.p`
  margin: 0;
  color: #4f3d31;
  line-height: 1.75;
  font-size: 14px;
`;

export const BulletList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;

  li {
    position: relative;
    padding-left: 18px;
    color: #4f3d31;
    font-size: 14px;
    line-height: 1.7;
  }

  li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 10px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${ACCENT};
    opacity: 0.6;
  }
`;

export const SkillGrid = styled.div`
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;

export const SkillCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SkillTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #4a3326;
`;

export const KeywordList = styled.div`
  font-size: 13px;
  color: #6f5d4e;
`;

export const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(217, 119, 6, 0.14);
  color: #8a4d0f;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const Anchor = styled.a`
  color: #b45309;
  text-decoration: none;
  border-bottom: 1px solid rgba(217, 119, 6, 0.3);
  transition: border-color 0.2s ease;

  &:hover {
    border-color: rgba(217, 119, 6, 0.6);
  }
`;
