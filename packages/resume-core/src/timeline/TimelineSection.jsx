import React from 'react';
/**
 * TimelineSection
 * Container for timeline items
 */
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  margin-bottom: var(--resume-space-section);

  @media print {
    page-break-inside: avoid;
  }
`;

export function TimelineSection({ children, className }) {
  return <Container className={className}>{children}</Container>;
}

export default TimelineSection;
