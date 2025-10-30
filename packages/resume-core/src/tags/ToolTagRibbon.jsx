import React from 'react';
import styled from 'styled-components';

/**
 * ToolTagRibbon Component
 * Thin ribbon of tool/stack tags with wrapping support
 *
 * Displays technology tags in a compact, horizontal ribbon layout that wraps
 * naturally. Preserves baseline grid alignment for ATS compatibility.
 * Text-only design without icons for maximum parsability.
 *
 * @component
 * @example
 * <ToolTagRibbon tags={['React', 'TypeScript', 'Node.js', 'PostgreSQL']} />
 * <ToolTagRibbon tags={skills} separator="•" size="small" />
 */

const RibbonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: ${(props) => (props.$size === 'small' ? '6px' : '8px')};
  margin: ${(props) => (props.$size === 'small' ? '4px 0' : '6px 0')};
  line-height: ${(props) =>
    props.theme?.typography?.lineHeight || 'var(--resume-line-height, 1.5)'};

  @media print {
    gap: ${(props) => (props.$size === 'small' ? '4px' : '6px')};
    margin: 3pt 0;
  }
`;

const Tag = styled.span`
  display: inline-block;
  font-size: ${(props) => {
    if (props.$size === 'small') return '8.5pt';
    if (props.$size === 'large') return '10.5pt';
    return '9.5pt'; // default medium
  }};
  font-weight: 500;
  color: ${(props) =>
    props.theme?.colors?.secondary || 'var(--resume-color-secondary, #444444)'};
  white-space: nowrap;

  /* Preserve baseline grid */
  vertical-align: baseline;

  @media print {
    color: #444444;
    font-size: ${(props) => {
      if (props.$size === 'small') return '8pt';
      if (props.$size === 'large') return '10pt';
      return '9pt';
    }};
  }
`;

const Separator = styled.span`
  display: inline-block;
  font-size: ${(props) => {
    if (props.$size === 'small') return '8.5pt';
    if (props.$size === 'large') return '10.5pt';
    return '9.5pt';
  }};
  color: ${(props) =>
    props.theme?.colors?.border || 'var(--resume-color-border, #cccccc)'};
  user-select: none;
  vertical-align: baseline;

  @media print {
    color: #cccccc;
  }
`;

export function ToolTagRibbon({
  tags = [],
  separator = '·',
  size = 'medium',
  className,
  ...rest
}) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <RibbonContainer
      $size={size}
      className={`resume-tool-tag-ribbon ${className || ''}`.trim()}
      {...rest}
    >
      {tags.map((tag, index) => (
        <React.Fragment key={index}>
          <Tag $size={size}>{tag}</Tag>
          {index < tags.length - 1 && separator && (
            <Separator $size={size} aria-hidden="true">
              {separator}
            </Separator>
          )}
        </React.Fragment>
      ))}
    </RibbonContainer>
  );
}

export default ToolTagRibbon;
