import React from 'react';
import styled from 'styled-components';

/**
 * NameStackElegant Component
 * Elegant vertical stack of name, role, and optional tagline with varying font weights
 * Avoids thin hairlines at small sizes for optimal print quality
 *
 * @component
 * @example
 * <NameStackElegant
 *   name="Alexandra Chen"
 *   role="Senior Product Designer"
 *   tagline="Creating intuitive digital experiences"
 * />
 *
 * @param {Object} props
 * @param {string} props.name - Full name (displayed prominently)
 * @param {string} props.role - Job title or role
 * @param {string} [props.tagline] - Optional short tagline or value proposition
 * @param {'left'|'center'|'right'} [props.align='center'] - Text alignment
 * @param {string} [props.className] - Additional CSS classes
 */

const Container = styled.header`
  text-align: ${(props) => props.$align || 'center'};
  margin-bottom: var(--resume-space-section, 24px);

  @media print {
    break-after: avoid;
  }
`;

const Name = styled.h1`
  font-size: var(--resume-size-name, 36px);
  font-weight: var(--resume-weight-bold, 700);
  color: var(--resume-color-primary, #1a1a1a);
  margin: 0 0 4px 0;
  line-height: var(--resume-line-height-tight, 1.2);
  letter-spacing: -0.02em;

  @media print {
    color: #000000; /* Ensure 4.5:1 contrast */
  }
`;

const Role = styled.div`
  font-size: var(--resume-size-heading, 16px);
  font-weight: var(--resume-weight-medium, 500); /* Avoid thin weights */
  color: var(--resume-color-secondary, #4a4a4a);
  margin: 0 0 8px 0;
  line-height: var(--resume-line-height-normal, 1.5);

  @media print {
    color: #333333; /* Ensure 4.5:1 contrast */
  }
`;

const Tagline = styled.div`
  font-size: var(--resume-size-body, 11px);
  font-weight: var(--resume-weight-normal, 400);
  color: var(--resume-color-secondary, #4a4a4a);
  margin: 0;
  line-height: var(--resume-line-height-relaxed, 1.75);
  max-width: 600px;
  margin-left: ${(props) => (props.$align === 'center' ? 'auto' : '0')};
  margin-right: ${(props) =>
    props.$align === 'center'
      ? 'auto'
      : props.$align === 'right'
      ? '0'
      : 'auto'};

  @media print {
    color: #4a4a4a;
  }
`;

export function NameStackElegant({
  name,
  role,
  tagline,
  align = 'center',
  className,
  ...rest
}) {
  return (
    <Container
      $align={align}
      className={`resume-name-stack-elegant ${className || ''}`.trim()}
      {...rest}
    >
      <Name className="resume-name">{name}</Name>
      <Role className="resume-role">{role}</Role>
      {tagline && (
        <Tagline $align={align} className="resume-tagline">
          {tagline}
        </Tagline>
      )}
    </Container>
  );
}

export default NameStackElegant;
