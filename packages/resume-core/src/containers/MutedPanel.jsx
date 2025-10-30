import React from 'react';
import styled from 'styled-components';

/**
 * MutedPanel Component
 * Subtle tinted box for summaries and secondary content
 * Uses 5-8% tint fills with high text contrast
 *
 * @component
 * @example
 * <MutedPanel>
 *   <p>Professional summary text goes here...</p>
 * </MutedPanel>
 *
 * @example
 * <MutedPanel tint="accent" padding="lg">
 *   <h3>Key Highlights</h3>
 *   <ul>
 *     <li>Achievement 1</li>
 *     <li>Achievement 2</li>
 *   </ul>
 * </MutedPanel>
 */

const StyledMutedPanel = styled.div`
  background: ${(props) => {
    if (props.$tint === 'accent') {
      return (
        props.theme?.colors?.accentMuted ||
        'var(--resume-color-accent-muted, rgba(0, 102, 204, 0.06))'
      );
    }
    if (props.$tint === 'warm') {
      return 'var(--resume-color-warm-muted, rgba(102, 51, 0, 0.05))';
    }
    if (props.$tint === 'cool') {
      return 'var(--resume-color-cool-muted, rgba(0, 51, 102, 0.05))';
    }
    // Default neutral tint
    return props.theme?.colors?.muted || 'var(--resume-color-muted, #f5f5f5)';
  }};

  color: ${(props) =>
    props.theme?.colors?.primary || 'var(--resume-color-primary, #000)'};

  padding: ${(props) => {
    if (props.$padding === 'sm') return '12px';
    if (props.$padding === 'lg') return '24px';
    return '16px'; // default md
  }};

  border-radius: ${(props) =>
    props.theme?.radius?.md || 'var(--resume-radius-md, 6px)'};

  margin: ${(props) => {
    if (props.$margin === 'sm') return '8px 0';
    if (props.$margin === 'lg') return '24px 0';
    if (props.$margin === 'none') return '0';
    return '16px 0'; // default md
  }};

  /* High text contrast for readability */
  line-height: 1.6;
  font-size: 10pt;

  /* Ensure content spacing */
  > *:first-child {
    margin-top: 0;
  }

  > *:last-child {
    margin-bottom: 0;
  }

  @media print {
    /* Use subtle backgrounds that print well */
    background: ${(props) => {
      if (props.$tint === 'accent') return 'rgba(0, 102, 204, 0.05)';
      if (props.$tint === 'warm') return 'rgba(102, 51, 0, 0.04)';
      if (props.$tint === 'cool') return 'rgba(0, 51, 102, 0.04)';
      return '#f8f8f8';
    }};

    /* Ensure high contrast text for printing */
    color: #000;

    /* Remove border radius for cleaner print appearance */
    border-radius: 0;

    /* Adjust spacing for print density */
    padding: ${(props) => {
      if (props.$padding === 'sm') return '10px';
      if (props.$padding === 'lg') return '20px';
      return '14px';
    }};

    /* Prevent orphaned panels */
    page-break-inside: avoid;
  }
`;

export function MutedPanel({
  children,
  tint = 'neutral',
  padding = 'md',
  margin = 'md',
  className,
  ...rest
}) {
  return (
    <StyledMutedPanel
      $tint={tint}
      $padding={padding}
      $margin={margin}
      className={`resume-muted-panel resume-muted-panel-${tint} ${
        className || ''
      }`.trim()}
      {...rest}
    >
      {children}
    </StyledMutedPanel>
  );
}

export default MutedPanel;
