import React from 'react';
/**
 * ProficiencyScale
 * Visual proficiency scale for skills or languages
 */
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: var(--resume-space-tight);
  margin-bottom: 8px;
`;

const Label = styled.span`
  min-width: 120px;
  font-size: var(--resume-size-body);
  color: var(--resume-color-primary);

  @media (max-width: 768px) {
    min-width: 100px;
    font-size: var(--resume-size-small);
  }
`;

const Scale = styled.div`
  display: flex;
  gap: 4px;
  flex: 1;
`;

const Segment = styled.div`
  flex: 1;
  height: ${(props) => props.$size || '12px'};
  background-color: ${(props) =>
    props.$filled
      ? props.$color || 'var(--resume-color-accent)'
      : 'var(--resume-color-border)'};
  border-radius: var(--resume-radius-xs);
  transition: background-color 0.3s ease;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border: 1px solid
      ${(props) =>
        props.$filled
          ? props.$color || 'var(--resume-color-accent)'
          : 'var(--resume-color-border)'};
  }
`;

const LevelText = styled.span`
  min-width: 80px;
  text-align: right;
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);

  @media (max-width: 768px) {
    display: none;
  }
`;

/**
 * @param {Object} props
 * @param {string} props.label - Skill or language name
 * @param {number} props.level - Proficiency level (1-5 or 1-10)
 * @param {number} [props.max=5] - Maximum level
 * @param {string} [props.color] - Custom color
 * @param {string} [props.size] - Segment height
 * @param {boolean} [props.showLevel=false] - Show numeric level
 * @param {string} [props.className] - Additional CSS classes
 */
export function ProficiencyScale({
  label,
  level,
  max = 5,
  color,
  size,
  showLevel = false,
  className,
}) {
  const segments = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <Container className={className}>
      <Label>{label}</Label>
      <Scale>
        {segments.map((segment) => (
          <Segment
            key={segment}
            $filled={segment <= level}
            $color={color}
            $size={size}
          />
        ))}
      </Scale>
      {showLevel && (
        <LevelText>
          {level}/{max}
        </LevelText>
      )}
    </Container>
  );
}

export default ProficiencyScale;
