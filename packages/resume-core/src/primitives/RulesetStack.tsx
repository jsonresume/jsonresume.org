import React from 'react';
import styled from 'styled-components';

/**
 * RulesetStack Component
 * Alternating rule + gap stack for visual grouping and rhythm
 * Creates structured visual hierarchy through repetition
 *
 * Design constraints:
 * - Gap spacing based on multiples of body leading (line-height)
 * - Rule thickness consistent with keyline weight (0.3-0.5pt)
 * - Stack count: 2-5 rules (optimal visual balance)
 * - Gap multipliers: 0.5x, 1x, 1.5x, or 2x body leading
 *
 * @component
 * @example
 * // Standard 3-rule stack
 * <RulesetStack count={3} />
 *
 * @example
 * // Tight spacing with 4 rules
 * <RulesetStack count={4} gapMultiplier={0.5} />
 *
 * @example
 * // Custom color and thickness
 * <RulesetStack count={2} color="#94a3b8" thickness="0.5pt" />
 */

interface RulesetStackProps {
  /** Number of rules to render (2-5, defaults to 3) */
  count?: number;
  /** Gap multiplier based on body leading (defaults to 1) */
  gapMultiplier?: number;
  /** Rule thickness (defaults to 0.4pt) */
  thickness?: string;
  /** Rule color (defaults to theme border color) */
  color?: string;
  /** Additional CSS class name */
  className?: string;
}

const StyledStack = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${(props) =>
    props.theme?.spacing?.tight || 'var(--resume-space-tight, 0.5rem)'};
  margin-bottom: ${(props) =>
    props.theme?.spacing?.tight || 'var(--resume-space-tight, 0.5rem)'};

  @media print {
    page-break-inside: avoid;
  }
`;

const StyledRule = styled.div<{
  thickness?: string;
  color?: string;
  gapSize: string;
}>`
  width: 100%;
  height: ${(props) => props.thickness || '0.4pt'};
  background-color: ${(props) =>
    props.color ||
    props.theme?.colors?.border ||
    'var(--resume-color-border, #e5e7eb)'};
  margin-bottom: ${(props) => props.gapSize};

  &:last-child {
    margin-bottom: 0;
  }

  @media print {
    /* Ensure minimum stroke weight for print visibility */
    min-height: 0.3pt;
    /* Ensure color renders in print */
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

export function RulesetStack({
  count = 3,
  gapMultiplier = 1,
  thickness,
  color,
  className,
  ...rest
}: RulesetStackProps) {
  // Clamp count between 2 and 5
  const ruleCount = Math.min(Math.max(count, 2), 5);

  // Calculate gap size based on body leading (assuming 1.5 line-height)
  // Default body line-height from tokens is 1.5
  const baseLeading = 1.5; // From typography.lineHeights.normal
  const gapSize = `calc(${baseLeading * gapMultiplier}rem * 0.5)`;

  return (
    <StyledStack
      role="separator"
      aria-orientation="horizontal"
      className={`resume-ruleset-stack ${className || ''}`.trim()}
      {...rest}
    >
      {Array.from({ length: ruleCount }, (_, index) => (
        <StyledRule
          key={index}
          thickness={thickness}
          color={color}
          gapSize={gapSize}
          aria-hidden="true"
        />
      ))}
    </StyledStack>
  );
}

export default RulesetStack;
