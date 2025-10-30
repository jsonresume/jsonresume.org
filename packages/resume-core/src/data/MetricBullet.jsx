import React from 'react';
import styled from 'styled-components';

/**
 * MetricBullet Component
 * Bullet point with leading bold metric token aligned to tab stop for vertical rhythm
 * Ideal for achievement lists with quantifiable results
 *
 * @component
 * @example
 * <MetricBullet metric="40%">Revenue increase in Q4 2023</MetricBullet>
 * <MetricBullet metric="$2.5M" align="right">Annual cost savings achieved</MetricBullet>
 */

const BulletContainer = styled.li`
  display: flex;
  align-items: baseline;
  margin-bottom: ${(props) => (props.$spacing === 'tight' ? '4px' : '8px')};
  line-height: 1.5;
  list-style: none;

  @media print {
    page-break-inside: avoid;
  }
`;

const Metric = styled.span`
  font-weight: var(--resume-weight-bold, 700);
  color: var(--resume-color-primary, #000);
  min-width: ${(props) => (props.$align === 'right' ? 'auto' : '60px')};
  max-width: ${(props) => (props.$align === 'right' ? '80px' : 'auto')};
  margin-right: ${(props) => (props.$align === 'right' ? '12px' : '0')};
  margin-left: ${(props) => (props.$align === 'right' ? '0' : '12px')};
  text-align: ${(props) => (props.$align === 'right' ? 'right' : 'left')};
  flex-shrink: 0;
  white-space: nowrap;

  ${(props) =>
    props.$align === 'right'
      ? `
    order: -1;
  `
      : ''}

  @media print {
    font-weight: 700;
    color: #000;
  }
`;

const Content = styled.span`
  flex: 1;
  color: var(--resume-color-primary, #000);
`;

const Bullet = styled.span`
  margin-right: 8px;
  color: var(--resume-color-accent, #0066cc);
  font-weight: var(--resume-weight-bold, 700);

  @media print {
    color: #333;
  }
`;

/**
 * @param {Object} props
 * @param {string} props.metric - The metric value to display (e.g., "40%", "$2.5M", "12x")
 * @param {React.ReactNode} props.children - The description text
 * @param {'left'|'right'} [props.align='left'] - Metric alignment (left = after bullet, right = before bullet)
 * @param {'normal'|'tight'} [props.spacing='normal'] - Vertical spacing between bullets
 * @param {string} [props.bullet='•'] - Custom bullet character
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element}
 */
export function MetricBullet({
  metric,
  children,
  align = 'left',
  spacing = 'normal',
  bullet = '•',
  className,
  ...rest
}) {
  if (!metric || !children) return null;

  return (
    <BulletContainer
      $spacing={spacing}
      className={`resume-metric-bullet ${className || ''}`.trim()}
      {...rest}
    >
      {align === 'left' && <Bullet>{bullet}</Bullet>}
      <Metric $align={align}>{metric}</Metric>
      {align === 'right' && <Bullet>{bullet}</Bullet>}
      <Content>{children}</Content>
    </BulletContainer>
  );
}

/**
 * MetricBulletList Component
 * Container for multiple metric bullets
 *
 * @component
 * @example
 * <MetricBulletList>
 *   <MetricBullet metric="40%">Revenue increase</MetricBullet>
 *   <MetricBullet metric="$2.5M">Cost savings</MetricBullet>
 * </MetricBulletList>
 */
const ListContainer = styled.ul`
  margin: 8px 0;
  padding-left: 0;
  list-style: none;
`;

export function MetricBulletList({ children, className, ...rest }) {
  return (
    <ListContainer
      className={`resume-metric-bullet-list ${className || ''}`.trim()}
      {...rest}
    >
      {children}
    </ListContainer>
  );
}

export default MetricBullet;
