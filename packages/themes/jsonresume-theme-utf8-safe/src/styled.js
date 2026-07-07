/*
 * UTF-8 Safe — Layout Styled Components
 *
 * Page shell, header, two-column grid only.
 */
import styled from 'styled-components';
import { ContactInfo } from '@jsonresume/core';
import { colors, spacing } from './tokens.js';

export const Page = styled.div`
  max-width: 1050px;
  margin: ${spacing.xl} auto;
  background: ${colors.surface};
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    sans-serif;
  font-size: 15px;
  line-height: 1.6;
  color: ${colors.text};
  -webkit-font-smoothing: antialiased;
  a {
    color: ${colors.link};
    text-decoration: none;
    transition: color 0.15s ease;
  }
  a:hover {
    color: ${colors.primaryHover};
    text-decoration: underline;
  }
  @media (max-width: 768px) {
    margin: 0;
    border-radius: 0;
    box-shadow: none;
  }
  @media print {
    max-width: none;
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    font-size: 12px;
    a {
      color: ${colors.text};
    }
  }
`;

export const Header = styled.header`
  background: ${colors.headerBg};
  color: ${colors.headerText};
  padding: ${spacing.xl} ${spacing.xl} ${spacing.lg};
  @media (max-width: 768px) {
    padding: ${spacing.lg} ${spacing.md};
  }
  @media print {
    padding: ${spacing.md} ${spacing.md} ${spacing.sm};
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

export const Name = styled.h1`
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 ${spacing.sm};
  line-height: 1.2;
  @media (max-width: 768px) {
    font-size: 26px;
  }
  @media print {
    font-size: 26px;
  }
`;

export const LabelBadge = styled.span`
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  color: ${colors.headerSubtle};
  margin-bottom: ${spacing.md};
  padding: ${spacing.xs} ${spacing.sm};
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  @media print {
    font-size: 12px;
    border-color: rgba(0, 0, 0, 0.1);
    color: #555;
  }
`;

export const SummaryText = styled.p`
  font-size: 14px;
  line-height: 1.7;
  color: ${colors.headerSubtle};
  margin: 0;
  @media print {
    color: #555;
  }
`;

export const StyledContactInfo = styled(ContactInfo)`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.md};
  margin-top: ${spacing.md};
  font-size: 13px;
  a {
    color: ${colors.headerSubtle};
  }
  a:hover {
    color: #fff;
  }
  .contact-item {
    color: ${colors.headerSubtle};
  }
  @media print {
    a {
      color: ${colors.text};
    }
    .contact-item {
      color: ${colors.textSecondary};
    }
  }
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  min-height: 500px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Sidebar = styled.aside`
  background: ${colors.sidebarBg};
  padding: ${spacing.lg} ${spacing.md} ${spacing.lg} ${spacing.lg};
  border-right: 1px solid ${colors.borderLight};
  @media (max-width: 768px) {
    padding: ${spacing.md};
    border-right: none;
    border-bottom: 1px solid ${colors.borderLight};
  }
  @media print {
    padding: ${spacing.md} ${spacing.sm} ${spacing.md} ${spacing.md};
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

export const Main = styled.main`
  padding: ${spacing.lg} ${spacing.xl} ${spacing.lg} ${spacing.lg};
  @media (max-width: 768px) {
    padding: ${spacing.md};
  }
  @media print {
    padding: ${spacing.md};
  }
`;
