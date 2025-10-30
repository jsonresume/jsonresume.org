import React from 'react';
/**
 * StatCard
 * Card displaying a statistic or metric
 */
import styled from 'styled-components';

const Card = styled.div`
  padding: var(--resume-space-item);
  background-color: var(--resume-color-background);
  border: 1px solid var(--resume-color-border);
  border-radius: var(--resume-radius-md);
  text-align: ${(props) => props.$align || 'left'};

  @media print {
    border: 1px solid var(--resume-color-border);
    break-inside: avoid;
  }
`;

const Value = styled.div`
  font-size: ${(props) => props.$size || 'var(--resume-size-name)'};
  font-weight: var(--resume-weight-bold);
  color: ${(props) => props.$color || 'var(--resume-color-accent)'};
  line-height: 1;
  margin-bottom: 4px;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const Label = styled.div`
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
`;

const Description = styled.div`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
  margin-top: 4px;
`;

export function StatCard({
  value,
  label,
  description,
  valueSize,
  valueColor,
  align = 'left',
  className,
}) {
  return (
    <Card $align={align} className={className}>
      <Value $size={valueSize} $color={valueColor}>
        {value}
      </Value>
      {label && <Label>{label}</Label>}
      {description && <Description>{description}</Description>}
    </Card>
  );
}

export default StatCard;
