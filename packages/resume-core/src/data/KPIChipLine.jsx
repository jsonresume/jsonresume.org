import React from 'react';
import styled from 'styled-components';

/**
 * KPIChipLine Component
 * Row of tiny text chips for displaying key performance indicators
 * Uses stroke-less pills without filled backgrounds for better contrast and print optimization
 *
 * @component
 * @example
 * <KPIChipLine kpis={['95% Uptime', 'NPS 8.5', '200K MAU', '<100ms P95']} />
 * <KPIChipLine>
 *   <KPIChip>95% Uptime</KPIChip>
 *   <KPIChip>NPS 8.5</KPIChip>
 * </KPIChipLine>
 */

const ChipContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.$gap || '8px'};
  align-items: center;
  margin: ${(props) => props.$margin || '8px 0'};

  @media print {
    gap: 6px;
  }
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${(props) => {
    if (props.$size === 'xs') return '2px 8px';
    if (props.$size === 'md') return '4px 12px';
    return '3px 10px'; // default sm
  }};
  border-radius: ${(props) =>
    props.theme?.radius?.full || 'var(--resume-radius-full, 999px)'};
  border: 1px solid
    ${(props) =>
      props.theme?.colors?.border || 'var(--resume-color-border, #ddd)'};
  background: transparent;
  font-size: ${(props) => {
    if (props.$size === 'xs') return '8pt';
    if (props.$size === 'md') return '10pt';
    return '9pt'; // default sm
  }};
  font-weight: ${(props) =>
    props.theme?.typography?.weightMedium ||
    'var(--resume-weight-medium, 500)'};
  color: ${(props) =>
    props.theme?.colors?.secondary || 'var(--resume-color-secondary, #333)'};
  white-space: nowrap;
  line-height: 1.2;

  @media print {
    border: 1px solid #ccc;
    background: transparent;
    color: #000;
    padding: ${(props) => {
      if (props.$size === 'xs') return '2px 6px';
      if (props.$size === 'md') return '3px 10px';
      return '2px 8px';
    }};
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const Divider = styled.span`
  color: ${(props) =>
    props.theme?.colors?.border || 'var(--resume-color-border, #ddd)'};
  font-size: ${(props) => {
    if (props.$size === 'xs') return '8pt';
    if (props.$size === 'md') return '10pt';
    return '9pt';
  }};
  user-select: none;

  @media print {
    color: #ccc;
  }
`;

/**
 * Single KPI Chip
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The KPI text to display
 * @param {'xs'|'sm'|'md'} [props.size='sm'] - Size variant
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element}
 */
export function KPIChip({ children, size = 'sm', className, ...rest }) {
  return (
    <Chip
      $size={size}
      className={`resume-kpi-chip resume-kpi-${size} ${className || ''}`.trim()}
      {...rest}
    >
      {children}
    </Chip>
  );
}

/**
 * Row of KPI Chips
 *
 * @param {Object} props
 * @param {string[]} [props.kpis] - Array of KPI strings to display as chips
 * @param {React.ReactNode} [props.children] - Alternative: manual KPIChip children
 * @param {'xs'|'sm'|'md'} [props.size='sm'] - Size variant for auto-generated chips
 * @param {string} [props.gap='8px'] - Gap between chips
 * @param {string} [props.margin='8px 0'] - Margin around container
 * @param {boolean} [props.showDividers=false] - Show dividers between chips
 * @param {string} [props.divider='|'] - Divider character
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element}
 */
export function KPIChipLine({
  children,
  kpis,
  size = 'sm',
  gap = '8px',
  margin = '8px 0',
  showDividers = false,
  divider = '|',
  className,
  ...rest
}) {
  // Support both kpis array (convenience) and children (manual composition)
  const content = kpis
    ? kpis.map((kpi, index) => (
        <React.Fragment key={index}>
          {showDividers && index > 0 && (
            <Divider $size={size} aria-hidden="true">
              {divider}
            </Divider>
          )}
          <KPIChip size={size}>{kpi}</KPIChip>
        </React.Fragment>
      ))
    : children;

  return (
    <ChipContainer
      $gap={gap}
      $margin={margin}
      className={`resume-kpi-chip-line ${className || ''}`.trim()}
      {...rest}
    >
      {content}
    </ChipContainer>
  );
}

export default KPIChipLine;
