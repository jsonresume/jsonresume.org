import React from 'react';
import styled from 'styled-components';

/**
 * SectionFlagTitle Component
 * Section title with short accent "flag" bar on the left side
 * Flag bar height matches the text x-height for optimal visual balance
 *
 * @component
 * @example
 * <SectionFlagTitle>Work Experience</SectionFlagTitle>
 * <SectionFlagTitle level={3} flagColor="#2563eb">Skills</SectionFlagTitle>
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Title text content
 * @param {number} [props.level=2] - Heading level (1-6)
 * @param {string} [props.flagColor] - Custom color for the flag bar
 * @param {string} [props.flagWidth='4px'] - Width of the flag bar
 * @param {string} [props.className] - Additional CSS classes
 */

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: var(--resume-space-item, 16px);

  @media print {
    page-break-after: avoid;
  }
`;

const Flag = styled.div`
  width: ${(props) => props.$width || '4px'};
  height: 0.7em; /* Match x-height of text, not full line-height */
  background-color: ${(props) =>
    props.$color || 'var(--resume-color-accent, #2563eb)'};
  border-radius: 2px;
  flex-shrink: 0;

  /* Ensure visibility in print */
  @media print {
    background-color: ${(props) => props.$color || '#000000'};
  }
`;

const Title = styled.h2`
  font-size: var(--resume-size-heading, 16px);
  font-weight: var(--resume-weight-semibold, 600);
  color: var(--resume-color-primary, #1a1a1a);
  margin: 0;
  line-height: var(--resume-line-height-tight, 1.2);

  @media print {
    color: #000000; /* Ensure 4.5:1 contrast */
  }
`;

export function SectionFlagTitle({
  children,
  level = 2,
  flagColor,
  flagWidth = '4px',
  className,
  ...rest
}) {
  const Tag = `h${Math.min(Math.max(level, 1), 6)}`; // Constrain to h1-h6

  return (
    <Container
      className={`resume-section-flag-title ${className || ''}`.trim()}
      {...rest}
    >
      <Flag
        $width={flagWidth}
        $color={flagColor}
        className="resume-section-flag"
        aria-hidden="true"
      />
      <Title as={Tag} className="resume-section-flag-title-text">
        {children}
      </Title>
    </Container>
  );
}

export default SectionFlagTitle;
