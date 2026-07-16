/*
 * UTF-8 Safe — Sidebar Styled Components
 */
import styled from 'styled-components';
import { Badge, BadgeList } from '@jsonresume/core';
import { colors, spacing } from './tokens.js';

export const SideSection = styled.section`
  margin-bottom: ${spacing.lg};
  &:last-child {
    margin-bottom: 0;
  }
`;

export const SideSectionTitle = styled.h3`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${colors.textSubtle};
  margin: 0 0 ${spacing.md};
  padding-bottom: ${spacing.sm};
  border-bottom: 2px solid ${colors.border};
`;

export const ContactItem = styled.div`
  font-size: 13px;
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.sm};
  &:last-child {
    margin-bottom: 0;
  }
`;

export const ContactIcon = styled.span`
  font-size: 12px;
  color: ${colors.textSubtle};
  width: 16px;
  text-align: center;
  flex-shrink: 0;
`;

export const ProfileItem = styled.div`
  font-size: 13px;
  margin-bottom: ${spacing.sm};
  &:last-child {
    margin-bottom: 0;
  }
`;

export const ProfileNetwork = styled.span`
  display: block;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${colors.textSubtle};
  margin-bottom: 1px;
`;

export const SkillBlock = styled.div`
  margin-bottom: ${spacing.sm};
  &:last-child {
    margin-bottom: 0;
  }
`;

export const SkillHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: ${spacing.xs};
`;

export const SkillName = styled.span`
  font-weight: 600;
  font-size: 13px;
  color: ${colors.text};
`;

export const SkillLevel = styled.span`
  font-size: 11px;
  color: ${colors.textSubtle};
  font-weight: 500;
`;

export const StyledBadge = styled(Badge)`
  font-size: 11px;
  padding: 2px 8px;
  background: ${colors.tagBg};
  color: ${colors.tagText};
  border: none;
  border-radius: 4px;
  line-height: 1.5;
`;

export const StyledBadgeList = styled(BadgeList)`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

export const AccentBadge = styled(StyledBadge)`
  background: ${colors.tagAccentBg};
  color: ${colors.tagAccentText};
`;

export const LangRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: ${spacing.sm};
  &:last-child {
    margin-bottom: 0;
  }
`;

export const LangName = styled.span`
  font-weight: 600;
  font-size: 13px;
  color: ${colors.text};
`;

export const LangFluency = styled.span`
  font-size: 12px;
  color: ${colors.textSecondary};
  font-style: italic;
`;

export const InterestName = styled.div`
  font-weight: 600;
  font-size: 13px;
  color: ${colors.text};
  margin-bottom: ${spacing.xs};
`;

export const CertBlock = styled.div`
  font-size: 13px;
  margin-bottom: ${spacing.sm};
  &:last-child {
    margin-bottom: 0;
  }
`;

export const CertName = styled.div`
  font-weight: 600;
  color: ${colors.text};
  margin-bottom: 1px;
`;

export const CertIssuer = styled.div`
  font-size: 12px;
  color: ${colors.textSecondary};
`;

export const CertDate = styled.div`
  font-size: 11px;
  color: ${colors.textSubtle};
`;
