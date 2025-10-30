import React from 'react';
import styled from 'styled-components';

/**
 * HeroNameBlock Component
 * Large, prominent name heading with optional label and thin underline accent
 *
 * @component
 * @example
 * <HeroNameBlock name="Jane Smith" label="Portfolio" />
 * <HeroNameBlock name="John Doe" />
 *
 * @param {Object} props
 * @param {string} props.name - The name to display prominently
 * @param {string} [props.label] - Optional label/subtitle above the name
 * @param {string} [props.className] - Additional CSS classes
 */

const Container = styled.header`
  text-align: center;
  margin-bottom: var(--resume-space-section, 24px);

  @media print {
    break-after: avoid;
  }
`;

const Label = styled.div`
  font-size: var(--resume-size-small, 10px);
  font-weight: var(--resume-weight-medium, 500);
  color: var(--resume-color-secondary, #4a4a4a);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--resume-space-tight, 8px);

  @media print {
    color: #4a4a4a; /* Ensure print visibility */
  }
`;

const Name = styled.h1`
  font-size: var(--resume-size-name, 36px);
  font-weight: var(--resume-weight-bold, 700);
  color: var(--resume-color-primary, #1a1a1a);
  letter-spacing: -0.02em; /* Subtle negative tracking, avoid excessive spacing */
  margin: 0 auto;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--resume-color-border, #e5e7eb);
  max-width: fit-content;
  line-height: var(--resume-line-height-tight, 1.2);

  /* Ensure 4.5:1 contrast ratio */
  @media print {
    color: #000000;
    border-bottom-color: #999999;
  }
`;

export function HeroNameBlock({ name, label, className, ...rest }) {
  return (
    <Container
      className={`resume-hero-name-block ${className || ''}`.trim()}
      {...rest}
    >
      {label && <Label className="resume-hero-label">{label}</Label>}
      <Name className="resume-hero-name">{name}</Name>
    </Container>
  );
}

export default HeroNameBlock;
