import React from 'react';
/**
 * PageHeaderLine
 * Repeating header line with name on subsequent pages
 * Uses CSS @page margin boxes to reserve top space
 */
import styled from 'styled-components';

const HeaderContainer = styled.div`
  display: none;

  @media print {
    display: block;
    position: running(header);
    padding-bottom: var(--resume-space-xs, 0.5rem);
    border-bottom: 1px solid var(--resume-color-border, #e5e7eb);
    font-size: var(--resume-size-small, 0.875rem);
    color: var(--resume-color-secondary, #6b7280);
  }
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Name = styled.span`
  font-weight: 600;
  color: var(--resume-color-primary, #111827);
`;

/**
 * PageHeaderLine component displays a header on subsequent pages
 * Automatically reserves top margin space for the header
 *
 * @param {Object} props
 * @param {string} props.name - Full name to display in header
 * @param {string} [props.subtitle] - Optional subtitle (e.g., job title)
 * @param {React.ReactNode} [props.children] - Optional custom content
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element}
 *
 * @example
 * <PageHeaderLine name="John Doe" subtitle="Software Engineer" />
 */
export function PageHeaderLine({ name, subtitle, children, className }) {
  return (
    <HeaderContainer className={className}>
      <HeaderContent>
        <Name>{name}</Name>
        {subtitle && <span>{subtitle}</span>}
        {children}
      </HeaderContent>
    </HeaderContainer>
  );
}

export default PageHeaderLine;
