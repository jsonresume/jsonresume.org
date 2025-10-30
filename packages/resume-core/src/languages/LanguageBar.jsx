import React from 'react';
/**
 * LanguageBar
 * Bar chart for language proficiency levels
 */
import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: var(--resume-space-tight);
`;

const Label = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: var(--resume-size-body);
  color: var(--resume-color-primary);
`;

const Language = styled.span`
  font-weight: var(--resume-weight-medium);
`;

const Fluency = styled.span`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
`;

const BarContainer = styled.div`
  width: 100%;
  height: 10px;
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

// Proficiency level mappings
const FLUENCY_LEVELS = {
  Native: 100,
  Fluent: 90,
  Professional: 75,
  Intermediate: 60,
  Elementary: 40,
  Beginner: 25,
};

/**
 * @param {Object} props
 * @param {string} props.language - Language name
 * @param {string|number} props.fluency - Fluency level (name or percentage)
 * @param {string} [props.color] - Custom bar color
 * @param {string} [props.className] - Additional CSS classes
 */
export function LanguageBar({ language, fluency, color, className }) {
  const level =
    typeof fluency === 'number' ? fluency : FLUENCY_LEVELS[fluency] || 50;

  return (
    <Container className={className}>
      <Label>
        <Language>{language}</Language>
        <Fluency>
          {typeof fluency === 'string' ? fluency : `${fluency}%`}
        </Fluency>
      </Label>
      <BarContainer>
        <BarFill $level={level} $color={color} />
      </BarContainer>
    </Container>
  );
}

export default LanguageBar;
