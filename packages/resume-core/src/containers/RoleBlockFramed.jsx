import React from 'react';
import styled from 'styled-components';

/**
 * RoleBlockFramed Component
 * Lightly framed container for each role/position with consistent padding
 * Designed to prevent page edge collisions with proper spacing
 * Ideal for experience entries, education items, and project blocks
 *
 * @component
 * @example
 * <RoleBlockFramed>
 *   <h3>Senior Software Engineer</h3>
 *   <p>Tech Company Inc. • 2020-2023 • San Francisco, CA</p>
 *   <ul>
 *     <li>Led team of 5 engineers</li>
 *     <li>Architected microservices platform</li>
 *   </ul>
 * </RoleBlockFramed>
 *
 * @example
 * <RoleBlockFramed variant="minimal" padding="lg">
 *   <div>Role content with minimal styling</div>
 * </RoleBlockFramed>
 */

const StyledRoleBlock = styled.div`
  /* Light frame - subtle border */
  border: 1px solid
    ${(props) => {
      if (props.$variant === 'accent') {
        return (
          props.theme?.colors?.accentBorder ||
          'var(--resume-color-accent-border, #e0e0e0)'
        );
      }
      if (props.$variant === 'minimal') {
        return 'transparent';
      }
      return (
        props.theme?.colors?.borderLight ||
        'var(--resume-color-border-light, #e5e5e5)'
      );
    }};

  /* Optional background tint */
  background: ${(props) => {
    if (props.$variant === 'accent') {
      return (
        props.theme?.colors?.accentMuted ||
        'var(--resume-color-accent-muted, rgba(0, 102, 204, 0.02))'
      );
    }
    if (props.$variant === 'tinted') {
      return 'var(--resume-color-background-muted, rgba(0, 0, 0, 0.01))';
    }
    return 'transparent'; // default and minimal
  }};

  /* Consistent padding to prevent edge collision */
  padding: ${(props) => {
    if (props.$padding === 'sm') return '12px 16px';
    if (props.$padding === 'lg') return '20px 24px';
    return '16px 20px'; // default md
  }};

  /* Spacing between role blocks */
  margin: ${(props) => {
    if (props.$spacing === 'sm') return '12px 0';
    if (props.$spacing === 'lg') return '24px 0';
    if (props.$spacing === 'none') return '0';
    return '16px 0'; // default md
  }};

  /* Subtle rounding */
  border-radius: ${(props) =>
    props.theme?.radius?.sm || 'var(--resume-radius-sm, 4px)'};

  /* Text styling */
  color: ${(props) =>
    props.theme?.colors?.primary || 'var(--resume-color-primary, #000)'};

  /* Content spacing */
  > *:first-child {
    margin-top: 0;
  }

  > *:last-child {
    margin-bottom: 0;
  }

  /* Ensure proper spacing for nested elements */
  h3,
  h4 {
    margin-bottom: 8px;
  }

  p {
    margin: 4px 0;
  }

  ul,
  ol {
    margin: 8px 0;
    padding-left: 20px;
  }

  li {
    margin: 4px 0;
  }

  @media print {
    /* Ensure border prints clearly */
    border: ${(props) => {
      if (props.$variant === 'minimal') return 'none';
      if (props.$variant === 'accent') return '0.5pt solid #d0d0d0';
      return '0.5pt solid #e0e0e0';
    }};

    /* Remove background for clean print */
    background: transparent;

    /* Remove border radius for print */
    border-radius: 0;

    /* Adjust padding for print density */
    padding: ${(props) => {
      if (props.$padding === 'sm') return '10px 12px';
      if (props.$padding === 'lg') return '16px 20px';
      return '12px 16px';
    }};

    /* Prevent page edge collision - ensure margins */
    margin-left: 0;
    margin-right: 0;

    /* Prevent splitting role blocks across pages */
    page-break-inside: avoid;

    /* Add small gap after each block for readability */
    margin-bottom: ${(props) => {
      if (props.$spacing === 'sm') return '10px';
      if (props.$spacing === 'lg') return '20px';
      if (props.$spacing === 'none') return '0';
      return '14px';
    }};

    /* Ensure high contrast text */
    color: #000;

    /* Optimize nested element spacing for print */
    h3,
    h4 {
      margin-bottom: 6px;
    }

    ul,
    ol {
      margin: 6px 0;
    }

    li {
      margin: 3px 0;
    }
  }
`;

export function RoleBlockFramed({
  children,
  variant = 'default',
  padding = 'md',
  spacing = 'md',
  className,
  ...rest
}) {
  return (
    <StyledRoleBlock
      $variant={variant}
      $padding={padding}
      $spacing={spacing}
      className={`resume-role-block resume-role-block-${variant} ${
        className || ''
      }`.trim()}
      {...rest}
    >
      {children}
    </StyledRoleBlock>
  );
}

export default RoleBlockFramed;
