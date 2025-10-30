import React from 'react';
import styled from 'styled-components';

/**
 * HyphenationSafeParagraph
 * Paragraph component with balanced hyphenation for improved text flow.
 * Sets appropriate language attributes for quality hyphenation algorithms.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to render
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.as='p'] - HTML element to render as
 * @param {string} [props.lang='en'] - Language code for hyphenation (en, es, fr, de, etc.)
 * @param {string} [props.color] - Text color override
 * @param {string} [props.textAlign='left'] - Text alignment
 * @param {number} [props.maxLines] - Maximum number of lines before truncation
 *
 * @example
 * ```jsx
 * <HyphenationSafeParagraph>
 *   Implemented comprehensive internationalization framework...
 * </HyphenationSafeParagraph>
 *
 * <HyphenationSafeParagraph lang="fr">
 *   Développement d'applications web modernes avec React...
 * </HyphenationSafeParagraph>
 *
 * <HyphenationSafeParagraph maxLines={3}>
 *   Long description text that will be truncated after 3 lines...
 * </HyphenationSafeParagraph>
 * ```
 */

const StyledHyphenatedParagraph = styled.p`
  font-size: var(--resume-size-body);
  font-weight: var(--resume-weight-normal);
  color: ${(props) => props.$color || 'var(--resume-color-secondary)'};
  line-height: var(--resume-line-height-normal);
  text-align: ${(props) => props.$textAlign || 'left'};
  margin: 0 0 var(--resume-space-tight) 0;

  /* Enable hyphenation for better text flow */
  hyphens: auto;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;

  /* Prevent orphans and widows */
  orphans: 2;
  widows: 2;

  /* Balanced text wrapping */
  text-wrap: balance;

  /* Optional line clamping */
  ${(props) =>
    props.$maxLines &&
    `
    display: -webkit-box;
    -webkit-line-clamp: ${props.$maxLines};
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  `}

  /* Print optimization - disable hyphenation for cleaner output */
  @media print {
    hyphens: none;
    -webkit-hyphens: none;
    page-break-inside: avoid;
    text-wrap: pretty;
  }
`;

export function HyphenationSafeParagraph({
  children,
  className,
  as = 'p',
  lang = 'en',
  color,
  textAlign,
  maxLines,
}) {
  return (
    <StyledHyphenatedParagraph
      as={as}
      lang={lang}
      $color={color}
      $textAlign={textAlign}
      $maxLines={maxLines}
      className={className}
    >
      {children}
    </StyledHyphenatedParagraph>
  );
}

export default HyphenationSafeParagraph;
