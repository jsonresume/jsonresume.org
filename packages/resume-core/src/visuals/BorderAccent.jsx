import React from 'react';
/**
 * BorderAccent
 * Decorative border accent for sections
 */
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  padding: ${(props) => props.$padding || 'var(--resume-space-item)'};
  border: ${(props) => {
    const color = props.$color || 'var(--resume-color-accent)';
    if (props.$position === 'all') return `2px solid ${color}`;
    return 'none';
  }};
  border-left: ${(props) => {
    if (props.$position === 'left' || props.$position === 'all') {
      return `4px solid ${props.$color || 'var(--resume-color-accent)'}`;
    }
    return 'none';
  }};
  border-right: ${(props) => {
    if (props.$position === 'right') {
      return `4px solid ${props.$color || 'var(--resume-color-accent)'}`;
    }
    return 'none';
  }};
  border-top: ${(props) => {
    if (props.$position === 'top' || props.$position === 'all') {
      return `4px solid ${props.$color || 'var(--resume-color-accent)'}`;
    }
    return 'none';
  }};
  border-bottom: ${(props) => {
    if (props.$position === 'bottom' || props.$position === 'all') {
      return `4px solid ${props.$color || 'var(--resume-color-accent)'}`;
    }
    return 'none';
  }};
  border-radius: ${(props) =>
    props.$rounded ? 'var(--resume-radius-md)' : '0'};
  break-inside: avoid;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;

const Corner = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: ${(props) => props.$color || 'var(--resume-color-accent)'};
  border-style: solid;
  border-width: 0;

  ${(props) => {
    if (props.$corner === 'top-left') {
      return `
        top: -2px;
        left: -2px;
        border-top-width: 3px;
        border-left-width: 3px;
      `;
    }
    if (props.$corner === 'top-right') {
      return `
        top: -2px;
        right: -2px;
        border-top-width: 3px;
        border-right-width: 3px;
      `;
    }
    if (props.$corner === 'bottom-left') {
      return `
        bottom: -2px;
        left: -2px;
        border-bottom-width: 3px;
        border-left-width: 3px;
      `;
    }
    if (props.$corner === 'bottom-right') {
      return `
        bottom: -2px;
        right: -2px;
        border-bottom-width: 3px;
        border-right-width: 3px;
      `;
    }
  }}

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

/**
 * @param {Object} props
 * @param {string|React.ReactNode} props.children - Content
 * @param {string} [props.position='left'] - Border position (left, right, top, bottom, all, corners)
 * @param {string} [props.color] - Border color
 * @param {boolean} [props.rounded=false] - Apply border radius
 * @param {string} [props.padding] - Custom padding
 * @param {string} [props.className] - Additional CSS classes
 */
export function BorderAccent({
  children,
  position = 'left',
  color,
  rounded = false,
  padding,
  className,
}) {
  if (position === 'corners') {
    return (
      <Container
        $padding={padding}
        className={className}
        style={{ position: 'relative' }}
      >
        <Corner $corner="top-left" $color={color} />
        <Corner $corner="top-right" $color={color} />
        <Corner $corner="bottom-left" $color={color} />
        <Corner $corner="bottom-right" $color={color} />
        {children}
      </Container>
    );
  }

  return (
    <Container
      $position={position}
      $color={color}
      $rounded={rounded}
      $padding={padding}
      className={className}
    >
      {children}
    </Container>
  );
}

export default BorderAccent;
