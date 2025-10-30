import React from 'react';
import styled from 'styled-components';

/**
 * SectionRuleTitle Component
 * Section title with full-width hairline rule beneath for visual separation
 *
 * @component
 * @example
 * <SectionRuleTitle>Professional Experience</SectionRuleTitle>
 * <SectionRuleTitle level={3} ruleWidth="50%">Education</SectionRuleTitle>
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Title text content
 * @param {number} [props.level=2] - Heading level (1-6)
 * @param {string} [props.ruleWidth='100%'] - Width of the rule line
 * @param {string} [props.ruleColor] - Custom color for the rule
 * @param {string} [props.className] - Additional CSS classes
 */

const Container = styled.div`
  margin-bottom: var(--resume-space-item, 16px);

  @media print {
    page-break-after: avoid;
  }
`;

const Title = styled.h2`
  font-size: var(--resume-size-heading, 16px);
  font-weight: var(--resume-weight-semibold, 600);
  color: var(--resume-color-primary, #1a1a1a);
  margin: 0 0 8px 0;
  line-height: var(--resume-line-height-tight, 1.2);

  @media print {
    color: #000000; /* Ensure 4.5:1 contrast */
  }
`;

const Rule = styled.hr`
  width: ${(props) => props.$width || '100%'};
  height: 0;
  border: none;
  border-top: 0.5px solid
    ${(props) => props.$color || 'var(--resume-color-border, #e5e7eb)'};
  margin: 0;

  /* Ensure visibility in print */
  @media print {
    border-top-width: 1px;
    border-top-color: ${(props) => props.$color || '#cccccc'};
  }
`;

export function SectionRuleTitle({
  children,
  level = 2,
  ruleWidth = '100%',
  ruleColor,
  className,
  ...rest
}) {
  const Tag = `h${Math.min(Math.max(level, 1), 6)}`; // Constrain to h1-h6

  return (
    <Container
      className={`resume-section-rule-title ${className || ''}`.trim()}
      {...rest}
    >
      <Title as={Tag} className="resume-section-rule-title-text">
        {children}
      </Title>
      <Rule
        $width={ruleWidth}
        $color={ruleColor}
        className="resume-section-rule"
        aria-hidden="true"
      />
    </Container>
  );
}

export default SectionRuleTitle;
