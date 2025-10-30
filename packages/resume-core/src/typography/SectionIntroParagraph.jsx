import React from 'react';
import styled from 'styled-components';

/**
 * SectionIntroParagraph
 * Larger, softer paragraph component designed to open sections.
 * Uses increased line-height for readability when space is constrained.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to render
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.as='p'] - HTML element to render as
 * @param {string} [props.color] - Text color override
 * @param {string} [props.maxWidth] - Maximum width constraint
 *
 * @example
 * ```jsx
 * <SectionIntroParagraph>
 *   Senior software engineer with 10+ years building scalable systems.
 * </SectionIntroParagraph>
 * ```
 */

const StyledIntroParagraph = styled.p`
  font-size: var(--resume-size-body);
  font-weight: var(--resume-weight-normal);
  color: ${(props) => props.$color || 'var(--resume-color-secondary)'};
  line-height: var(--resume-line-height-relaxed);
  margin: 0 0 var(--resume-space-item) 0;
  max-width: ${(props) => props.$maxWidth || '100%'};

  /* Softer appearance for intro text */
  opacity: 0.95;

  /* Print optimization - maintain readability */
  @media print {
    line-height: var(--resume-line-height-normal);
    opacity: 1;
    page-break-inside: avoid;
  }
`;

export function SectionIntroParagraph({
  children,
  className,
  as = 'p',
  color,
  maxWidth,
}) {
  return (
    <StyledIntroParagraph
      as={as}
      $color={color}
      $maxWidth={maxWidth}
      className={className}
    >
      {children}
    </StyledIntroParagraph>
  );
}

export default SectionIntroParagraph;
