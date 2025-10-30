import React from 'react';
import styled from 'styled-components';

/**
 * Badge Component
 * Display skills, keywords, tags in a badge format
 *
 * @component
 * @example
 * <Badge variant="accent">JavaScript</Badge>
 * <Badge size="sm">React</Badge>
 */

const StyledBadge = styled.span`
  display: inline-block;
  padding: ${(props) => {
    if (props.$size === 'sm') return '2px 8px';
    if (props.$size === 'lg') return '6px 16px';
    return '4px 12px'; // default md
  }};
  border-radius: ${(props) =>
    props.theme?.radius?.sm || 'var(--resume-radius-sm, 4px)'};
  font-size: ${(props) => {
    if (props.$size === 'sm') return '9pt';
    if (props.$size === 'lg') return '11pt';
    return '10pt'; // default md
  }};
  font-weight: 500;
  background: ${(props) => {
    if (props.$variant === 'accent') {
      return (
        props.theme?.colors?.accentLight ||
        'var(--resume-color-accent-light, #e6f2ff)'
      );
    }
    if (props.$variant === 'secondary') {
      return props.theme?.colors?.muted || 'var(--resume-color-muted, #f5f5f5)';
    }
    return props.theme?.colors?.muted || 'var(--resume-color-muted, #f5f5f5)'; // default
  }};
  color: ${(props) => {
    if (props.$variant === 'accent') {
      return (
        props.theme?.colors?.accent || 'var(--resume-color-accent, #0066cc)'
      );
    }
    return props.theme?.colors?.primary || 'var(--resume-color-primary, #000)';
  }};

  @media print {
    background: ${(props) =>
      props.$variant === 'accent' ? '#e6f2ff' : '#f5f5f5'};
    color: ${(props) => (props.$variant === 'accent' ? '#0066cc' : '#000')};
  }
`;

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...rest
}) {
  return (
    <StyledBadge
      $variant={variant}
      $size={size}
      className={`resume-badge resume-badge-${variant} ${
        className || ''
      }`.trim()}
      {...rest}
    >
      {children}
    </StyledBadge>
  );
}

/**
 * BadgeList Component
 * Render multiple badges in a flex container
 *
 * @component
 * @example
 * <BadgeList items={['React', 'TypeScript', 'Node.js']} variant="accent" />
 * <BadgeList>
 *   <Badge>React</Badge>
 *   <Badge variant="accent">TypeScript</Badge>
 * </BadgeList>
 */

const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 8px 0;
`;

export function BadgeList({
  children,
  items,
  variant = 'default',
  size = 'md',
  className,
  ...rest
}) {
  // Support both children (for manual composition) and items array (for convenience)
  const content = items
    ? items.map((item, index) => (
        <Badge key={index} variant={variant} size={size}>
          {item}
        </Badge>
      ))
    : children;

  return (
    <BadgeContainer
      className={`resume-badge-list ${className || ''}`.trim()}
      {...rest}
    >
      {content}
    </BadgeContainer>
  );
}

export default Badge;
