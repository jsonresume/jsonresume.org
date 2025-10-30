import React from 'react';
import styled from 'styled-components';

/**
 * SoftCardOutline Component
 * Delicate rounded outline around content without shadows
 * Uses 1pt stroke for clean, professional appearance
 * Perfect for grouping related information
 *
 * @component
 * @example
 * <SoftCardOutline>
 *   <h4>Senior Software Engineer</h4>
 *   <p>Company Name • 2020-2023</p>
 *   <ul>
 *     <li>Key responsibility 1</li>
 *     <li>Key responsibility 2</li>
 *   </ul>
 * </SoftCardOutline>
 *
 * @example
 * <SoftCardOutline variant="accent" padding="lg">
 *   <div>Featured Project Content</div>
 * </SoftCardOutline>
 */

const StyledCardOutline = styled.div`
  /* 1pt stroke as specified */
  border: 1px solid
    ${(props) => {
      if (props.$variant === 'accent') {
        return (
          props.theme?.colors?.accentBorder ||
          'var(--resume-color-accent-border, #cce5ff)'
        );
      }
      if (props.$variant === 'muted') {
        return (
          props.theme?.colors?.border || 'var(--resume-color-border, #e5e5e5)'
        );
      }
      // Default neutral
      return (
        props.theme?.colors?.borderLight ||
        'var(--resume-color-border-light, #d4d4d4)'
      );
    }};

  /* Rounded corners for softness */
  border-radius: ${(props) => {
    if (props.$rounded === 'sm') return '4px';
    if (props.$rounded === 'lg') return '12px';
    return props.theme?.radius?.md || 'var(--resume-radius-md, 8px)'; // default md
  }};

  /* No shadows - clean outline only */
  box-shadow: none;

  /* Padding options */
  padding: ${(props) => {
    if (props.$padding === 'sm') return '12px';
    if (props.$padding === 'lg') return '24px';
    return '16px'; // default md
  }};

  margin: ${(props) => {
    if (props.$margin === 'sm') return '8px 0';
    if (props.$margin === 'lg') return '24px 0';
    if (props.$margin === 'none') return '0';
    return '16px 0'; // default md
  }};

  /* Optional subtle background */
  background: ${(props) => {
    if (props.$background === 'accent') {
      return (
        props.theme?.colors?.accentMuted ||
        'var(--resume-color-accent-muted, rgba(0, 102, 204, 0.03))'
      );
    }
    if (props.$background === 'muted') {
      return 'var(--resume-color-background-muted, rgba(0, 0, 0, 0.02))';
    }
    return 'transparent'; // default
  }};

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

  @media print {
    /* Ensure border prints clearly */
    border: 1pt solid
      ${(props) => {
        if (props.$variant === 'accent') return '#b3d9ff';
        if (props.$variant === 'muted') return '#d4d4d4';
        return '#c0c0c0';
      }};

    /* Remove border radius for print (cleaner appearance) */
    border-radius: 0;

    /* Remove background fills for print */
    background: transparent;

    /* Ensure high contrast text */
    color: #000;

    /* Adjust padding for print density */
    padding: ${(props) => {
      if (props.$padding === 'sm') return '10px';
      if (props.$padding === 'lg') return '20px';
      return '14px';
    }};

    /* Prevent splitting card across pages */
    page-break-inside: avoid;

    /* Ensure no page edge collision */
    margin-left: 0;
    margin-right: 0;
  }
`;

export function SoftCardOutline({
  children,
  variant = 'default',
  padding = 'md',
  margin = 'md',
  rounded = 'md',
  background = 'none',
  className,
  ...rest
}) {
  return (
    <StyledCardOutline
      $variant={variant}
      $padding={padding}
      $margin={margin}
      $rounded={rounded}
      $background={background}
      className={`resume-card-outline resume-card-outline-${variant} ${
        className || ''
      }`.trim()}
      {...rest}
    >
      {children}
    </StyledCardOutline>
  );
}

export default SoftCardOutline;
