import React from 'react';
import styled from 'styled-components';

/**
 * RoleHeaderCompact
 *
 * Tight role header stack with locked line-heights for consistency.
 * Stacks Title (bold) / Company (regular) / Dates+Location (muted).
 * Optimized for print with consistent spacing.
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Job title
 * @param {string} props.company - Company name
 * @param {string} [props.location] - Location (optional)
 * @param {string} [props.date] - Date range (optional)
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * ```jsx
 * <RoleHeaderCompact
 *   title="Senior Software Engineer"
 *   company="Acme Corp"
 *   location="San Francisco, CA"
 *   date="Jan 2020 - Present"
 * />
 * ```
 */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: var(--resume-space-tight);

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;

const Title = styled.div`
  font-size: var(--resume-size-subheading);
  font-weight: var(--resume-weight-bold);
  color: var(--resume-color-primary);
  line-height: 1.2;
  margin: 0;

  @media print {
    line-height: 1.2;
  }
`;

const Company = styled.div`
  font-size: var(--resume-size-body);
  font-weight: var(--resume-weight-normal);
  color: var(--resume-color-primary);
  line-height: 1.3;
  margin: 0;

  @media print {
    line-height: 1.3;
  }
`;

const Meta = styled.div`
  font-size: var(--resume-size-small);
  font-weight: var(--resume-weight-normal);
  color: var(--resume-color-secondary);
  line-height: 1.3;
  margin: 0;

  @media print {
    line-height: 1.3;
  }
`;

export function RoleHeaderCompact({
  title,
  company,
  location,
  date,
  className,
}) {
  return (
    <Container className={className}>
      {title && <Title>{title}</Title>}
      {company && <Company>{company}</Company>}
      {(location || date) && (
        <Meta>
          {location && <span>{location}</span>}
          {location && date && <span> • </span>}
          {date && <span>{date}</span>}
        </Meta>
      )}
    </Container>
  );
}

export default RoleHeaderCompact;
