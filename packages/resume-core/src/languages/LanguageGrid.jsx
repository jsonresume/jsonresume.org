import React from 'react';
/**
 * LanguageGrid
 * Grid layout for languages with proficiency indicators
 */
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--resume-space-tight);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  @media print {
    break-inside: avoid;
  }
`;

const LanguageCard = styled.div`
  padding: var(--resume-space-tight);
  background-color: var(--resume-color-background);
  border: 1px solid var(--resume-color-border);
  border-radius: var(--resume-radius-sm);
  break-inside: avoid;

  @media print {
    border: 1px solid var(--resume-color-border);
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;

const Language = styled.div`
  font-size: var(--resume-size-body);
  font-weight: var(--resume-weight-medium);
  color: var(--resume-color-primary);
  margin-bottom: 8px;
`;

const Fluency = styled.div`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
`;

const Dots = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 8px;
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.$filled
      ? 'var(--resume-color-accent)'
      : 'var(--resume-color-border)'};

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border: 1px solid
      ${(props) =>
        props.$filled
          ? 'var(--resume-color-accent)'
          : 'var(--resume-color-border)'};
  }
`;

// Map fluency levels to dot counts (out of 5)
const FLUENCY_DOTS = {
  Native: 5,
  Fluent: 5,
  Professional: 4,
  Intermediate: 3,
  Elementary: 2,
  Beginner: 1,
};

/**
 * @param {Object} props
 * @param {Array} props.languages - Array of language objects
 * @param {string} props.languages[].language - Language name
 * @param {string} props.languages[].fluency - Fluency level
 * @param {boolean} [props.showDots=true] - Show proficiency dots
 * @param {string} [props.className] - Additional CSS classes
 */
export function LanguageGrid({ languages = [], showDots = true, className }) {
  if (!languages || languages.length === 0) return null;

  return (
    <Grid className={className}>
      {languages.map((lang, index) => {
        const dotCount = FLUENCY_DOTS[lang.fluency] || 3;

        return (
          <LanguageCard key={index}>
            <Language>{lang.language}</Language>
            <Fluency>{lang.fluency}</Fluency>
            {showDots && (
              <Dots>
                {[...Array(5)].map((_, i) => (
                  <Dot key={i} $filled={i < dotCount} />
                ))}
              </Dots>
            )}
          </LanguageCard>
        );
      })}
    </Grid>
  );
}

export default LanguageGrid;
