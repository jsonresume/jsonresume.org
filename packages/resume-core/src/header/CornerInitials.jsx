import React from 'react';
/**
 * CornerInitials
 * Small monogram initials component for corner placement
 * Optimized for letterhead-style resume headers
 */
import styled from 'styled-components';

const Container = styled.div`
  position: ${(props) =>
    props.$position === 'absolute' ? 'absolute' : 'relative'};
  ${(props) => props.$corner === 'top-left' && 'top: 0; left: 0;'}
  ${(props) => props.$corner === 'top-right' && 'top: 0; right: 0;'}
  ${(props) => props.$corner === 'bottom-left' && 'bottom: 0; left: 0;'}
  ${(props) => props.$corner === 'bottom-right' && 'bottom: 0; right: 0;'}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.$size || '48px'};
  height: ${(props) => props.$size || '48px'};

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;

const Initials = styled.div`
  font-family: ${(props) =>
    props.$serif ? 'Georgia, "Times New Roman", serif' : 'inherit'};
  font-size: ${(props) =>
    props.$fontSize || 'calc(var(--resume-size-heading) * 0.8)'};
  font-weight: ${(props) =>
    props.$outline
      ? 'var(--resume-weight-normal)'
      : 'var(--resume-weight-bold)'};
  color: ${(props) => props.$color || 'var(--resume-color-primary)'};
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: ${(props) => (props.$outline ? '1px' : '0')};

  ${(props) =>
    props.$outline &&
    `
    -webkit-text-stroke: 1px ${props.$color || 'var(--resume-color-primary)'};
    -webkit-text-fill-color: transparent;
    text-stroke: 1px ${props.$color || 'var(--resume-color-primary)'};
    text-fill-color: transparent;
  `}

  ${(props) =>
    props.$bordered &&
    `
    border: 2px solid ${props.$color || 'var(--resume-color-primary)'};
    border-radius: ${props.$rounded ? '50%' : 'var(--resume-radius-sm)'};
    padding: ${props.$padding || '8px'};
    width: ${props.$size || '48px'};
    height: ${props.$size || '48px'};
    display: flex;
    align-items: center;
    justify-content: center;
  `}

  @media print {
    ${(props) =>
      props.$outline &&
      `
      color: ${props.$color || 'var(--resume-color-primary)'};
      -webkit-text-stroke: none;
      -webkit-text-fill-color: ${props.$color || 'var(--resume-color-primary)'};
      font-weight: var(--resume-weight-normal);
    `}
  }
`;

/**
 * Extract initials from name
 * @param {string} name - Full name
 * @returns {string} Initials (max 3 characters)
 */
function extractInitials(name) {
  if (!name) return '';

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    // Single name: take first 2 letters
    return parts[0].substring(0, 2).toUpperCase();
  } else if (parts.length === 2) {
    // Two names: first letter of each
    return (parts[0][0] + parts[1][0]).toUpperCase();
  } else {
    // Three or more: first, middle, last
    return (
      parts[0][0] +
      parts[1][0] +
      parts[parts.length - 1][0]
    ).toUpperCase();
  }
}

/**
 * CornerInitials Component
 *
 * Displays monogram initials for decorative corner placement in resume headers.
 * Supports outline style for thin fonts and bordered variants for emphasis.
 *
 * @param {Object} props - Component props
 * @param {string} props.name - Full name to extract initials from
 * @param {string} [props.initials] - Custom initials (overrides name extraction)
 * @param {string} [props.corner='top-left'] - Corner position (top-left, top-right, bottom-left, bottom-right)
 * @param {string} [props.position='absolute'] - CSS position (absolute, relative)
 * @param {string} [props.size='48px'] - Container size
 * @param {string} [props.fontSize] - Font size (defaults to calculated value)
 * @param {string} [props.color] - Text/border color
 * @param {boolean} [props.outline=false] - Use outline style (recommended for thin fonts)
 * @param {boolean} [props.bordered=false] - Add border around initials
 * @param {boolean} [props.rounded=false] - Make border circular (requires bordered=true)
 * @param {boolean} [props.serif=false] - Use serif font family
 * @param {string} [props.padding='8px'] - Internal padding (for bordered variant)
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * ```jsx
 * // Simple corner initials
 * <CornerInitials name="John Smith" corner="top-right" />
 *
 * // Outline style for thin fonts
 * <CornerInitials name="Jane Doe" outline serif />
 *
 * // Bordered circular monogram
 * <CornerInitials name="Alex Johnson" bordered rounded size="64px" />
 *
 * // Custom initials
 * <CornerInitials initials="JQ" color="#0066cc" />
 * ```
 */
export function CornerInitials({
  name,
  initials,
  corner = 'top-left',
  position = 'absolute',
  size = '48px',
  fontSize,
  color,
  outline = false,
  bordered = false,
  rounded = false,
  serif = false,
  padding = '8px',
  className,
}) {
  const displayInitials = initials || extractInitials(name);

  return (
    <Container
      $corner={corner}
      $position={position}
      $size={size}
      className={className}
    >
      <Initials
        $fontSize={fontSize}
        $color={color}
        $outline={outline}
        $bordered={bordered}
        $rounded={rounded}
        $serif={serif}
        $size={size}
        $padding={padding}
      >
        {displayInitials}
      </Initials>
    </Container>
  );
}

export default CornerInitials;
