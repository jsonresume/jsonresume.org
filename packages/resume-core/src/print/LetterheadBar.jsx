import React from 'react';
/**
 * LetterheadBar
 * Thin top bar across entire page with name
 * Reserves top margin for unprintable area
 */
import styled from 'styled-components';

const LetterheadContainer = styled.div`
  @media print {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: var(--resume-space-xs, 0.5rem) var(--resume-space-base, 1rem);
    background: var(--resume-color-accent, #f3f4f6);
    border-bottom: 2px solid var(--resume-color-primary, #111827);
    z-index: 1000;

    /* Reserve space for unprintable area */
    margin-top: 0.25in;
  }

  @media screen {
    padding: var(--resume-space-xs, 0.5rem) var(--resume-space-base, 1rem);
    background: var(--resume-color-accent, #f3f4f6);
    border-bottom: 2px solid var(--resume-color-primary, #111827);
  }
`;

const LetterheadContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--resume-size-small, 0.875rem);
`;

const Name = styled.div`
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--resume-color-primary, #111827);
  font-size: var(--resume-size-base, 1rem);
`;

const Tagline = styled.div`
  color: var(--resume-color-secondary, #6b7280);
  font-size: var(--resume-size-small, 0.875rem);
`;

const Spacer = styled.div`
  @media print {
    height: 0.75in;
  }

  @media screen {
    height: 3rem;
  }
`;

/**
 * LetterheadBar component displays a persistent bar at the top of each page
 * Reserves appropriate top margin for printer unprintable areas
 *
 * @param {Object} props
 * @param {string} props.name - Full name to display prominently
 * @param {string} [props.tagline] - Optional tagline or subtitle
 * @param {boolean} [props.includespacer=true] - Add spacer to prevent content overlap
 * @param {React.ReactNode} [props.children] - Optional custom content
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element}
 *
 * @example
 * <LetterheadBar name="Jane Smith" tagline="Product Designer" />
 * <LetterheadBar name="John Doe">
 *   <div>Custom content</div>
 * </LetterheadBar>
 */
export function LetterheadBar({
  name,
  tagline,
  includeSpacer = true,
  children,
  className,
}) {
  return (
    <>
      <LetterheadContainer className={className}>
        <LetterheadContent>
          <Name>{name}</Name>
          {tagline && <Tagline>{tagline}</Tagline>}
          {children}
        </LetterheadContent>
      </LetterheadContainer>
      {includeSpacer && <Spacer />}
    </>
  );
}

export default LetterheadBar;
