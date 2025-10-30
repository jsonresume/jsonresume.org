import React from 'react';
import styled from 'styled-components';

/**
 * SmallCapsHeading Component
 * Heading with small caps styling and modest tracking.
 * Readable at 11-13pt equivalent sizes for section headings.
 *
 * @component
 * @example
 * <SmallCapsHeading level={2}>Professional Experience</SmallCapsHeading>
 * <SmallCapsHeading level={3} size="sm">Education</SmallCapsHeading>
 *
 * @param {React.ReactNode} children - The heading text
 * @param {number} [level=2] - Heading level (1-6) for semantic HTML
 * @param {string} [size='md'] - Size variant: 'sm' (11pt), 'md' (12pt), 'lg' (13pt)
 * @param {string} [className] - Additional CSS classes
 */

const StyledHeading = styled.h2`
  font-size: ${(props) => {
    if (props.$size === 'sm') return '11pt';
    if (props.$size === 'lg') return '13pt';
    return '12pt'; // default md
  }};
  font-weight: ${(props) =>
    props.theme?.typography?.weights?.semibold ||
    'var(--resume-weight-semibold, 600)'};
  color: ${(props) =>
    props.theme?.colors?.primary || 'var(--resume-color-primary, #1a1a1a)'};
  font-variant: small-caps;
  letter-spacing: 0.06em;
  line-height: 1.3;
  margin: 0 0 12px 0;
  text-transform: lowercase; /* Allows font-variant to work properly */

  @media print {
    font-size: ${(props) => {
      if (props.$size === 'sm') return '11pt';
      if (props.$size === 'lg') return '13pt';
      return '12pt';
    }};
    color: #1a1a1a;
    letter-spacing: 0.06em;
    margin: 0 0 10px 0;
    font-variant: small-caps;
    page-break-after: avoid;
  }
`;

export function SmallCapsHeading({
  children,
  level = 2,
  size = 'md',
  className,
  ...rest
}) {
  // Map level to valid HTML heading tags
  const headingTag = `h${Math.max(1, Math.min(6, level))}`;

  return (
    <StyledHeading
      as={headingTag}
      $size={size}
      className={`resume-small-caps-heading resume-small-caps-heading-${size} ${
        className || ''
      }`.trim()}
      {...rest}
    >
      {children}
    </StyledHeading>
  );
}

export default SmallCapsHeading;
