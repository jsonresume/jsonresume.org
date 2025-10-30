import React from 'react';
import styled from 'styled-components';

/**
 * BadgeRowOutline Component
 * Outlined badges (no fill) for skill clusters with consistent stroke width
 *
 * Displays skills or categories as outlined badges with no background fill.
 * Uses ≥0.5pt stroke to avoid low-DPI rendering artifacts (scalloping).
 * Optimized for both screen and print display.
 *
 * @component
 * @example
 * <BadgeRowOutline items={['Leadership', 'Communication', 'Problem Solving']} />
 * <BadgeRowOutline items={skills} size="small" strokeWidth="0.75pt" />
 */

const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => (props.$size === 'small' ? '6px' : '8px')};
  margin: ${(props) => (props.$size === 'small' ? '6px 0' : '8px 0')};

  @media print {
    gap: ${(props) => (props.$size === 'small' ? '4px' : '6px')};
    margin: 4pt 0;
  }
`;

const OutlineBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${(props) => {
    if (props.$size === 'small') return '3px 10px';
    if (props.$size === 'large') return '7px 16px';
    return '5px 12px'; // default medium
  }};
  border: ${(props) => props.$strokeWidth || '0.5pt'} solid
    ${(props) =>
      props.theme?.colors?.border || 'var(--resume-color-border, #666666)'};
  border-radius: ${(props) =>
    props.$rounded
      ? '999px'
      : props.theme?.radius?.sm || 'var(--resume-radius-sm, 4px)'};
  font-size: ${(props) => {
    if (props.$size === 'small') return '8.5pt';
    if (props.$size === 'large') return '10.5pt';
    return '9.5pt'; // default medium
  }};
  font-weight: 500;
  color: ${(props) =>
    props.theme?.colors?.primary || 'var(--resume-color-primary, #000000)'};
  background: transparent;
  white-space: nowrap;
  line-height: 1.2;

  /* Prevent scalloping on low-DPI displays */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @media print {
    /* Ensure minimum stroke width for print clarity */
    border-width: ${(props) => {
      const width = props.$strokeWidth || '0.5pt';
      return width;
    }};
    border-color: #666666;
    color: #000000;
    padding: ${(props) => {
      if (props.$size === 'small') return '2pt 8pt';
      if (props.$size === 'large') return '5pt 12pt';
      return '3pt 10pt';
    }};
    font-size: ${(props) => {
      if (props.$size === 'small') return '8pt';
      if (props.$size === 'large') return '10pt';
      return '9pt';
    }};

    /* Force exact colors for print */
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

export function BadgeRowOutline({
  items = [],
  size = 'medium',
  rounded = true,
  strokeWidth = '0.5pt',
  className,
  ...rest
}) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <BadgeContainer
      $size={size}
      className={`resume-badge-row-outline ${className || ''}`.trim()}
      {...rest}
    >
      {items.map((item, index) => (
        <OutlineBadge
          key={index}
          $size={size}
          $rounded={rounded}
          $strokeWidth={strokeWidth}
        >
          {item}
        </OutlineBadge>
      ))}
    </BadgeContainer>
  );
}

export default BadgeRowOutline;
