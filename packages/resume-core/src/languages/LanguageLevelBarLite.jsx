import React from 'react';
/**
 * LanguageLevelBarLite
 * Character-based language proficiency display (ATS/print safe)
 * Uses Unicode characters for visual level indication without graphics
 */
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
  margin-bottom: 0.5em;
  font-size: var(--resume-size-body);
  line-height: var(--resume-line-height-normal);
  break-inside: avoid;

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  @media (max-width: 768px) {
    font-size: var(--resume-size-small);
    gap: 0.5em;
  }
`;

const Label = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5em;
  flex: 1;
`;

const Language = styled.span`
  font-weight: var(--resume-weight-medium);
  color: var(--resume-color-primary);
`;

const Fluency = styled.span`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
`;

const BarText = styled.span`
  font-family: 'Courier New', Courier, monospace;
  font-size: var(--resume-size-body);
  color: var(--resume-color-primary);
  letter-spacing: 2px;
  white-space: nowrap;

  @media print {
    letter-spacing: 3px;
  }
`;

// Proficiency level mappings to 5-segment scale
const FLUENCY_LEVELS = {
  Native: 5,
  Fluent: 5,
  Professional: 4,
  Intermediate: 3,
  Elementary: 2,
  Beginner: 1,
};

// Convert percentage to 5-segment scale
function percentageToSegments(percentage) {
  if (percentage >= 90) return 5;
  if (percentage >= 70) return 4;
  if (percentage >= 50) return 3;
  if (percentage >= 30) return 2;
  return 1;
}

/**
 * LanguageLevelBarLite Component
 *
 * Displays language proficiency using character-based bar for ATS compatibility.
 * Uses Unicode block characters (■ □) for visual representation without graphics.
 *
 * @param {Object} props - Component props
 * @param {string} props.language - Language name
 * @param {string|number} props.fluency - Fluency level (name, percentage, or 1-5 scale)
 * @param {boolean} [props.showLabel=true] - Show fluency level text label
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * ```jsx
 * <LanguageLevelBarLite language="Spanish" fluency="Professional" />
 * <LanguageLevelBarLite language="French" fluency={75} />
 * <LanguageLevelBarLite language="German" fluency={3} showLabel={false} />
 * ```
 *
 * @example Output
 * Spanish (Professional)    ■■■■□
 * French (75%)              ■■■■□
 * German                    ■■■□□
 */
export function LanguageLevelBarLite({
  language,
  fluency,
  showLabel = true,
  className,
}) {
  // Determine segment count (1-5)
  let segments;
  let displayText;

  if (typeof fluency === 'string') {
    // Named level (Native, Fluent, etc.)
    segments = FLUENCY_LEVELS[fluency] || 3;
    displayText = fluency;
  } else if (typeof fluency === 'number') {
    if (fluency <= 5) {
      // Direct segment count (1-5)
      segments = Math.max(1, Math.min(5, Math.round(fluency)));
      displayText = null;
    } else {
      // Percentage (0-100)
      segments = percentageToSegments(fluency);
      displayText = `${fluency}%`;
    }
  } else {
    segments = 3;
    displayText = null;
  }

  // Create bar string: filled (■) + empty (□)
  const filled = '■'.repeat(segments);
  const empty = '□'.repeat(5 - segments);
  const bar = filled + empty;

  return (
    <Container className={className}>
      <Label>
        <Language>{language}</Language>
        {showLabel && displayText && <Fluency>({displayText})</Fluency>}
      </Label>
      <BarText aria-label={`${segments} out of 5`}>{bar}</BarText>
    </Container>
  );
}

export default LanguageLevelBarLite;
