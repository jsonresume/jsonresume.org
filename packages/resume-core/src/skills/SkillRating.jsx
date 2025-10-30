import React from 'react';
/**
 * SkillRating
 * Visual rating system for skills (dots/stars)
 */
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: var(--resume-space-tight);
  margin-bottom: var(--resume-space-tight);
`;

const SkillName = styled.span`
  flex: 1;
  font-size: var(--resume-size-body);
  color: var(--resume-color-primary);
`;

const RatingContainer = styled.div`
  display: flex;
  gap: 4px;
`;

const Dot = styled.span`
  width: ${(props) => props.$size || '10px'};
  height: ${(props) => props.$size || '10px'};
  border-radius: 50%;
  background-color: ${(props) =>
    props.$filled
      ? 'var(--resume-color-accent)'
      : 'var(--resume-color-border)'};

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

export function SkillRating({
  skill,
  rating = 0,
  max = 5,
  size = '10px',
  className,
}) {
  return (
    <Container className={className}>
      <SkillName>{skill}</SkillName>
      <RatingContainer>
        {Array.from({ length: max }, (_, i) => (
          <Dot key={i} $filled={i < rating} $size={size} />
        ))}
      </RatingContainer>
    </Container>
  );
}

export default SkillRating;
