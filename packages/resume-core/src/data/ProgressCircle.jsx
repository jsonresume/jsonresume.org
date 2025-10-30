import React from 'react';
/**
 * ProgressCircle
 * Circular progress indicator
 */
import styled from 'styled-components';

const Container = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const Circle = styled.svg`
  transform: rotate(-90deg);
`;

const Label = styled.span`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
  font-weight: var(--resume-weight-medium);
`;

export function ProgressCircle({
  value = 0,
  max = 100,
  size = 60,
  strokeWidth = 6,
  color = 'var(--resume-color-accent)',
  label,
  showValue = false,
  className,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (value / max) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Container className={className}>
      <Circle width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--resume-color-border)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
        {showValue && (
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dy="0.3em"
            fontSize={size / 4}
            fill="var(--resume-color-primary)"
            transform={`rotate(90 ${size / 2} ${size / 2})`}
          >
            {Math.round(progress)}%
          </text>
        )}
      </Circle>
      {label && <Label>{label}</Label>}
    </Container>
  );
}

export default ProgressCircle;
