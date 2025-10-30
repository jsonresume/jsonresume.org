import React from 'react';
/**
 * BackgroundPattern
 * Background pattern overlay for visual interest
 */
import styled from 'styled-components';

const Pattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: ${(props) => props.$opacity || 0.05};
  z-index: 0;
  background-image: ${(props) => {
    if (props.$pattern === 'dots') {
      return `radial-gradient(circle, var(--resume-color-primary) 1px, transparent 1px)`;
    }
    if (props.$pattern === 'grid') {
      return `
        linear-gradient(var(--resume-color-border) 1px, transparent 1px),
        linear-gradient(90deg, var(--resume-color-border) 1px, transparent 1px)
      `;
    }
    if (props.$pattern === 'diagonal') {
      return `repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        var(--resume-color-border) 10px,
        var(--resume-color-border) 11px
      )`;
    }
    return 'none';
  }};
  background-size: ${(props) => {
    if (props.$pattern === 'dots') return '20px 20px';
    if (props.$pattern === 'grid') return '20px 20px';
    return 'auto';
  }};

  @media print {
    display: none;
  }
`;

/**
 * @param {Object} props
 * @param {string} [props.pattern='dots'] - Pattern type (dots, grid, diagonal)
 * @param {number} [props.opacity=0.05] - Pattern opacity
 * @param {string} [props.className] - Additional CSS classes
 */
export function BackgroundPattern({
  pattern = 'dots',
  opacity = 0.05,
  className,
}) {
  return (
    <Pattern $pattern={pattern} $opacity={opacity} className={className} />
  );
}

export default BackgroundPattern;
