import React from 'react';
/**
 * ColorBlock
 * Colored block/section for visual hierarchy
 */
import styled from 'styled-components';

const Block = styled.div`
  padding: var(--resume-space-section);
  background-color: ${(props) => props.$color || 'var(--resume-color-muted)'};
  border-radius: ${(props) =>
    props.$rounded ? 'var(--resume-radius-md)' : '0'};
  margin: ${(props) => props.$margin || 'var(--resume-space-section) 0'};
  break-inside: avoid;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  @media (max-width: 768px) {
    padding: var(--resume-space-item);
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
`;

/**
 * @param {Object} props
 * @param {string|React.ReactNode} props.children - Block content
 * @param {string} [props.color] - Background color
 * @param {boolean} [props.rounded=false] - Apply border radius
 * @param {string} [props.margin] - Custom margin
 * @param {string} [props.className] - Additional CSS classes
 */
export function ColorBlock({
  children,
  color,
  rounded = false,
  margin,
  className,
}) {
  return (
    <Block
      $color={color}
      $rounded={rounded}
      $margin={margin}
      className={className}
    >
      <Content>{children}</Content>
    </Block>
  );
}

export default ColorBlock;
