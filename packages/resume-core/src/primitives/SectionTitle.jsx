import styled from 'styled-components';

/**
 * SectionTitle Component
 * Styled heading for resume sections with optional icon and accent border
 *
 * @component
 * @example
 * <SectionTitle icon="💼">Work Experience</SectionTitle>
 * <SectionTitle level="h3">Projects</SectionTitle>
 */

const StyledTitle = styled.h2`
  font-size: ${(props) =>
    props.theme?.typography?.heading || 'var(--resume-size-heading, 16pt)'};
  font-weight: 600;
  color: ${(props) =>
    props.theme?.colors?.primary || 'var(--resume-color-primary, #000)'};
  margin: 0 0
    ${(props) => props.theme?.spacing?.item || 'var(--resume-space-item, 1rem)'}
    0;
  padding-bottom: 4px;
  border-bottom: 2px solid
    ${(props) =>
      props.theme?.colors?.accent || 'var(--resume-color-accent, #0066cc)'};

  @media print {
    page-break-after: avoid;
  }
`;

const Icon = styled.span`
  margin-right: 8px;
  font-size: 1.2em;
`;

export function SectionTitle({
  children,
  icon,
  level = 2,
  className,
  ...rest
}) {
  // Use dynamic component based on level (h1, h2, h3, etc.)
  const Component = StyledTitle.withComponent(`h${level}`);

  return (
    <Component
      className={`resume-section-title ${className || ''}`.trim()}
      {...rest}
    >
      {icon && (
        <Icon aria-hidden="true" className="resume-icon">
          {icon}
        </Icon>
      )}
      {children}
    </Component>
  );
}

export default SectionTitle;
