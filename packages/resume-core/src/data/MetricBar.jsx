import React from 'react';
/**
 * MetricBar
 * Horizontal bar with label and value
 */
import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: var(--resume-space-tight);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
`;

const Label = styled.span`
  font-size: var(--resume-size-body);
  color: var(--resume-color-primary);
  font-weight: var(--resume-weight-medium);
`;

const Value = styled.span`
  font-size: var(--resume-size-small);
  color: var(--resume-color-accent);
  font-weight: var(--resume-weight-semibold);
`;

const Bar = styled.div`
  width: 100%;
  height: ${(props) => props.$height || '24px'};
  background-color: var(--resume-color-border);
  border-radius: var(--resume-radius-sm);
  overflow: hidden;
  position: relative;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const Fill = styled.div`
  width: ${(props) => props.$percentage}%;
  height: 100%;
  background-color: ${(props) => props.$color || 'var(--resume-color-accent)'};
  display: flex;
  align-items: center;
  padding: 0 8px;
  transition: width 0.3s ease;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const InnerLabel = styled.span`
  font-size: var(--resume-size-small);
  color: #ffffff;
  font-weight: var(--resume-weight-medium);
  white-space: nowrap;
`;

export function MetricBar({
  label,
  value,
  max = 100,
  height = '24px',
  color,
  showInnerLabel = false,
  className,
}) {
  const percentage = (value / max) * 100;

  return (
    <Container className={className}>
      <Header>
        <Label>{label}</Label>
        <Value>{value}</Value>
      </Header>
      <Bar $height={height}>
        <Fill $percentage={percentage} $color={color}>
          {showInnerLabel && <InnerLabel>{label}</InnerLabel>}
        </Fill>
      </Bar>
    </Container>
  );
}

export default MetricBar;
