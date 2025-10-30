import React from 'react';
/**
 * SoftShadowEmulation
 * Printed "shadow" effect using second keyline with slight offset
 * No actual blur - uses subtle tint (≤8%) for print-safe shadow effect
 */
import styled from 'styled-components';

const ShadowContainer = styled.div`
  position: relative;
  background: var(--resume-color-background, #ffffff);
`;

const ShadowBox = styled.div`
  position: relative;
  padding: ${(props) => props.$padding || 'var(--resume-space-base, 1rem)'};
  background: var(--resume-color-background, #ffffff);

  /* Primary border */
  border: 1px solid var(--resume-color-border, #e5e7eb);

  /* Shadow emulation using pseudo-element */
  &::after {
    content: '';
    position: absolute;
    top: ${(props) => props.$offset || '4px'};
    left: ${(props) => props.$offset || '4px'};
    right: -${(props) => props.$offset || '4px'};
    bottom: -${(props) => props.$offset || '4px'};
    border: 1px solid ${(props) => props.$shadowColor || 'rgba(0, 0, 0, 0.08)'};
    border-radius: inherit;
    z-index: -1;

    @media print {
      /* Ensure shadow prints - use solid light gray */
      border-color: ${(props) => props.$printShadowColor || '#f0f0f0'};
    }
  }
`;

/**
 * SoftShadowEmulation component creates a print-safe shadow effect
 * Uses a second border with offset instead of CSS box-shadow
 * Safe for ATS parsing and guaranteed to print on all devices
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to wrap with shadow
 * @param {string} [props.offset='4px'] - Shadow offset distance
 * @param {string} [props.shadowColor='rgba(0, 0, 0, 0.08)'] - Shadow tint (≤8% opacity)
 * @param {string} [props.printShadowColor='#f0f0f0'] - Solid color for print
 * @param {string} [props.padding] - Inner padding (defaults to --resume-space-base)
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element}
 *
 * @example
 * <SoftShadowEmulation>
 *   <h2>Section Title</h2>
 *   <p>Content with subtle shadow effect</p>
 * </SoftShadowEmulation>
 *
 * @example
 * <SoftShadowEmulation offset="6px" shadowColor="rgba(0, 0, 0, 0.06)">
 *   <ProfileCard />
 * </SoftShadowEmulation>
 */
export function SoftShadowEmulation({
  children,
  offset = '4px',
  shadowColor = 'rgba(0, 0, 0, 0.08)',
  printShadowColor = '#f0f0f0',
  padding,
  className,
}) {
  return (
    <ShadowContainer className={className}>
      <ShadowBox
        $offset={offset}
        $shadowColor={shadowColor}
        $printShadowColor={printShadowColor}
        $padding={padding}
      >
        {children}
      </ShadowBox>
    </ShadowContainer>
  );
}

export default SoftShadowEmulation;
