import React from 'react';
/**
 * Callout
 * Highlighted callout box for important information
 */
import styled from 'styled-components';

const Container = styled.div`
  padding: var(--resume-space-item);
  margin: var(--resume-space-item) 0;
  background-color: ${(props) => {
    if (props.$variant === 'success')
      return 'var(--resume-color-success-bg, #d4edda)';
    if (props.$variant === 'warning')
      return 'var(--resume-color-warning-bg, #fff3cd)';
    if (props.$variant === 'error')
      return 'var(--resume-color-error-bg, #f8d7da)';
    return 'var(--resume-color-muted)';
  }};
  border-left: 4px solid
    ${(props) => {
      if (props.$variant === 'success')
        return 'var(--resume-color-success, #28a745)';
      if (props.$variant === 'warning')
        return 'var(--resume-color-warning, #ffc107)';
      if (props.$variant === 'error')
        return 'var(--resume-color-error, #dc3545)';
      return 'var(--resume-color-accent)';
    }};
  border-radius: var(--resume-radius-sm);
  break-inside: avoid;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border-left: 4px solid
      ${(props) => {
        if (props.$variant === 'success')
          return 'var(--resume-color-success, #28a745)';
        if (props.$variant === 'warning')
          return 'var(--resume-color-warning, #ffc107)';
        if (props.$variant === 'error')
          return 'var(--resume-color-error, #dc3545)';
        return 'var(--resume-color-accent)';
      }};
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;

const Title = styled.div`
  font-size: var(--resume-size-subheading);
  font-weight: var(--resume-weight-medium);
  color: var(--resume-color-primary);
  margin-bottom: 8px;
`;

const Content = styled.div`
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
`;

/**
 * @param {Object} props
 * @param {string|React.ReactNode} props.children - Callout content
 * @param {string} [props.title] - Optional title
 * @param {string} [props.variant='info'] - Style variant (info, success, warning, error)
 * @param {string} [props.className] - Additional CSS classes
 */
export function Callout({ children, title, variant = 'info', className }) {
  return (
    <Container $variant={variant} className={className}>
      {title && <Title>{title}</Title>}
      <Content>{children}</Content>
    </Container>
  );
}

export default Callout;
