import React from 'react';
import styled from 'styled-components';

/**
 * AccentCalloutPanel Component
 * High-contrast callout with bold header for important information
 * Avoids reversed white-on-dark text for better print compatibility
 * Uses increased font size and weight for emphasis
 *
 * @component
 * @example
 * <AccentCalloutPanel title="Key Achievement">
 *   Led migration of legacy system serving 10M+ users with zero downtime
 * </AccentCalloutPanel>
 *
 * @example
 * <AccentCalloutPanel
 *   title="Career Highlight"
 *   icon="🏆"
 *   variant="success"
 * >
 *   Promoted to Senior Engineer after 18 months
 * </AccentCalloutPanel>
 */

const StyledCalloutPanel = styled.div`
  border-left: 4px solid
    ${(props) => {
      if (props.$variant === 'success')
        return 'var(--resume-color-success, #22c55e)';
      if (props.$variant === 'warning')
        return 'var(--resume-color-warning, #f59e0b)';
      if (props.$variant === 'info') return 'var(--resume-color-info, #3b82f6)';
      return (
        props.theme?.colors?.accent || 'var(--resume-color-accent, #0066cc)'
      );
    }};

  background: ${(props) => {
    if (props.$variant === 'success')
      return 'var(--resume-color-success-light, rgba(34, 197, 94, 0.08))';
    if (props.$variant === 'warning')
      return 'var(--resume-color-warning-light, rgba(245, 158, 11, 0.08))';
    if (props.$variant === 'info')
      return 'var(--resume-color-info-light, rgba(59, 130, 246, 0.08))';
    return (
      props.theme?.colors?.accentLight ||
      'var(--resume-color-accent-light, rgba(0, 102, 204, 0.08))'
    );
  }};

  padding: ${(props) =>
    props.$size === 'sm' ? '12px 16px' : '16px 20px'}; /* default md */

  margin: 16px 0;
  border-radius: ${(props) =>
    props.theme?.radius?.md || 'var(--resume-radius-md, 6px)'};

  /* Ensure high contrast text, no reversed text */
  color: ${(props) =>
    props.theme?.colors?.primary || 'var(--resume-color-primary, #000)'};

  @media print {
    /* Solid border for print clarity */
    border-left: 3pt solid
      ${(props) => {
        if (props.$variant === 'success') return '#22c55e';
        if (props.$variant === 'warning') return '#f59e0b';
        if (props.$variant === 'info') return '#3b82f6';
        return '#0066cc';
      }};

    /* Lighter background for print */
    background: ${(props) => {
      if (props.$variant === 'success') return 'rgba(34, 197, 94, 0.05)';
      if (props.$variant === 'warning') return 'rgba(245, 158, 11, 0.05)';
      if (props.$variant === 'info') return 'rgba(59, 130, 246, 0.05)';
      return 'rgba(0, 102, 204, 0.05)';
    }};

    /* Remove border radius */
    border-radius: 0;

    /* Ensure black text for maximum contrast */
    color: #000;

    /* Prevent splitting across pages */
    page-break-inside: avoid;
  }
`;

const CalloutHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  /* Icon styling */
  .callout-icon {
    font-size: 16pt;
    line-height: 1;
  }
`;

const CalloutTitle = styled.div`
  /* Bold, larger title for emphasis (as per design constraints) */
  font-size: ${(props) => (props.$size === 'sm' ? '11pt' : '12pt')};
  font-weight: 700;
  color: ${(props) => {
    if (props.$variant === 'success')
      return 'var(--resume-color-success-dark, #16a34a)';
    if (props.$variant === 'warning')
      return 'var(--resume-color-warning-dark, #d97706)';
    if (props.$variant === 'info')
      return 'var(--resume-color-info-dark, #2563eb)';
    return props.theme?.colors?.accent || 'var(--resume-color-accent, #0066cc)';
  }};

  @media print {
    /* Maintain weight and bump size slightly for print */
    font-weight: 700;
    font-size: ${(props) => (props.$size === 'sm' ? '11pt' : '12pt')};
    color: #000;
  }
`;

const CalloutContent = styled.div`
  font-size: 10pt;
  line-height: 1.6;

  > *:first-child {
    margin-top: 0;
  }

  > *:last-child {
    margin-bottom: 0;
  }

  @media print {
    font-size: 10pt;
    line-height: 1.5;
  }
`;

export function AccentCalloutPanel({
  children,
  title,
  icon,
  variant = 'default',
  size = 'md',
  className,
  ...rest
}) {
  return (
    <StyledCalloutPanel
      $variant={variant}
      $size={size}
      className={`resume-callout-panel resume-callout-${variant} ${
        className || ''
      }`.trim()}
      {...rest}
    >
      {title && (
        <CalloutHeader>
          {icon && <span className="callout-icon">{icon}</span>}
          <CalloutTitle $variant={variant} $size={size}>
            {title}
          </CalloutTitle>
        </CalloutHeader>
      )}
      <CalloutContent>{children}</CalloutContent>
    </StyledCalloutPanel>
  );
}

export default AccentCalloutPanel;
