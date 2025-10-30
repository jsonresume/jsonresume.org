import React from 'react';
/**
 * SkillBar
 * Horizontal bar showing skill proficiency level
 */
import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: var(--resume-space-tight);
`;

const Label = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: var(--resume-size-body);
  color: var(--resume-color-primary);
`;

const BarContainer = styled.div`
  width: 100%;
  height: ${(props) => props.$height || '8px'};
  background-color: var(--resume-color-border);
  border-radius: var(--resume-radius-sm);
  overflow: hidden;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const BarFill = styled.div`
  width: ${(props) => props.$level}%;
  height: 100%;
  background-color: ${(props) => props.$color || 'var(--resume-color-accent)'};
  transition: width 0.3s ease;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

export function SkillBar({
  skill,
  level = 0,
  showPercentage = false,
  color,
  height,
  className,
}) {
  return (
    <Container className={className}>
      <Label>
        <span>{skill}</span>
        {showPercentage && <span>{level}%</span>}
      </Label>
      <BarContainer $height={height}>
        <BarFill $level={level} $color={color} />
      </BarContainer>
    </Container>
  );
}

export default SkillBar;
