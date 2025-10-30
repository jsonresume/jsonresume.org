import React from 'react';
/**
 * SkillCloud
 * Tag cloud style skill display with varying sizes
 */
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

const SkillTag = styled.span`
  display: inline-block;
  padding: 4px 12px;
  font-size: ${(props) => {
    if (props.$weight >= 80) return 'var(--resume-size-subheading)';
    if (props.$weight >= 50) return 'var(--resume-size-body)';
    return 'var(--resume-size-small)';
  }};
  font-weight: ${(props) =>
    props.$weight >= 70
      ? 'var(--resume-weight-semibold)'
      : 'var(--resume-weight-normal)'};
  color: var(--resume-color-primary);
  background-color: ${(props) =>
    `color-mix(in srgb, var(--resume-color-accent) ${props.$weight}%, transparent)`};
  border-radius: var(--resume-radius-sm);

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

export function SkillCloud({ skills = [], className }) {
  // Normalize weights to 0-100 scale
  const maxLevel = Math.max(...skills.map((s) => s.level || 1));

  return (
    <Container className={className}>
      {skills.map((skill, index) => (
        <SkillTag key={index} $weight={((skill.level || 1) / maxLevel) * 100}>
          {typeof skill === 'string' ? skill : skill.name}
        </SkillTag>
      ))}
    </Container>
  );
}

export default SkillCloud;
