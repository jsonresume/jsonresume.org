/*
 * UTF-8 Safe — Main Column Styled Components
 */
import styled from 'styled-components';
import { Section, SectionTitle } from '@jsonresume/core';
import { colors, spacing } from './tokens.js';

export const StyledSection = styled(Section)`
  margin-bottom: ${spacing.lg};
  &:last-child {
    margin-bottom: 0;
  }
`;

export const StyledSectionTitle = styled(SectionTitle)`
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

export const EntryBlock = styled.div`
  margin-bottom: ${spacing.md};
  &:last-child {
    margin-bottom: 0;
  }
  @media print {
    break-inside: avoid;
  }
`;

export const CardBlock = styled.div`
  margin-bottom: ${spacing.sm};
  padding: ${spacing.md};
  background: ${colors.surface};
  border: 1px solid ${colors.borderLight};
  border-radius: 8px;
  transition: box-shadow 0.15s ease;
  &:hover {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  }
  &:last-child {
    margin-bottom: 0;
  }
  @media print {
    break-inside: avoid;
    border: 1px solid #ddd;
    box-shadow: none !important;
  }
`;

export const EntryHead = styled.div`
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

export const EntryOrg = styled.div`
  font-weight: 700;
  font-size: 15px;
  color: ${colors.text};
  a {
    color: ${colors.text};
  }
  a:hover {
    color: ${colors.primary};
  }
`;

export const MetaDate = styled.div`
  font-size: 12px;
  color: ${colors.textSubtle};
  white-space: nowrap;
  font-weight: 500;
  @media (max-width: 768px) {
    white-space: normal;
  }
`;

export const EntryPos = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${colors.primary};
  margin-bottom: ${spacing.xs};
  @media print {
    color: ${colors.text};
  }
`;

export const EntryLoc = styled.div`
  font-size: 13px;
  color: ${colors.textSubtle};
  margin-bottom: ${spacing.xs};
`;

export const Desc = styled.p`
  font-size: 14px;
  color: ${colors.textSecondary};
  line-height: 1.7;
  margin: 0 0 ${spacing.sm};
  &:last-child {
    margin: 0;
  }
`;

export const Highlights = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${spacing.sm} 0 0;
`;

export const HighlightItem = styled.li`
  font-size: 13px;
  color: ${colors.textSecondary};
  line-height: 1.6;
  padding-left: ${spacing.md};
  position: relative;
  margin-bottom: 3px;
  &::before {
    content: '';
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

export const NotiItem = styled.div`
  margin-bottom: ${spacing.md};
  &:last-child {
    margin-bottom: 0;
  }
`;

export const NotiTitle = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: ${colors.text};
`;

export const NotiMeta = styled.div`
  font-size: 12px;
  color: ${colors.textSubtle};
  margin-bottom: ${spacing.xs};
`;

export const RefName = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: ${colors.text};
  margin-bottom: ${spacing.xs};
`;

export const RefText = styled.div`
  font-size: 13px;
  color: ${colors.textSecondary};
  line-height: 1.6;
  font-style: italic;
`;
