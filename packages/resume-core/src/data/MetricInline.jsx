import React from 'react';
import styled from 'styled-components';

/**
 * MetricInline Component
 * Bold inline numerics styled consistently for embedding within text
 * Uses font weight instead of color for accessibility and print compatibility
 *
 * @component
 * @example
 * <p>Increased revenue by <MetricInline>40%</MetricInline> year over year</p>
 * <p>Led team of <MetricInline size="lg">12</MetricInline> engineers</p>
 */

const StyledMetric = styled.strong`
  font-weight: ${(props) => {
    if (props.$size === 'sm') return 'var(--resume-weight-semibold, 600)';
    if (props.$size === 'lg') return 'var(--resume-weight-extrabold, 800)';
    return 'var(--resume-weight-bold, 700)'; // default md
  }};
  font-size: ${(props) => {
    if (props.$size === 'sm') return '0.95em';
    if (props.$size === 'lg') return '1.1em';
    return '1em'; // default md
  }};
  color: inherit;
  white-space: nowrap;

  @media print {
    font-weight: ${(props) => {
      if (props.$size === 'sm') return '600';
      if (props.$size === 'lg') return '800';
      return '700';
    }};
    color: inherit;
  }
`;

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - The metric value to display
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Size variant (affects font weight and size)
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element}
 */
export function MetricInline({ children, size = 'md', className, ...rest }) {
  return (
    <StyledMetric
      $size={size}
      className={`resume-metric-inline resume-metric-${size} ${
        className || ''
      }`.trim()}
      {...rest}
    >
      {children}
    </StyledMetric>
  );
}

export default MetricInline;
