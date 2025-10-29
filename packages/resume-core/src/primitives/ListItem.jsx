import styled from 'styled-components';

/**
 * ListItem Component
 * Experience/Education item with consistent structure
 * Perfect for work experience, education, projects, etc.
 *
 * @component
 * @example
 * <ListItem
 *   title="Senior Software Engineer"
 *   subtitle="Acme Corp"
 *   dateRange="Jan 2020 - Present"
 *   location="San Francisco, CA"
 *   description="Led development of microservices architecture"
 *   highlights={['Led team of 5', 'Increased performance by 40%']}
 * />
 */

const ItemContainer = styled.div`
  margin-bottom: ${(props) =>
    props.theme?.spacing?.item || 'var(--resume-space-item, 1rem)'};

  @media print {
    page-break-inside: avoid;
  }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
`;

const ItemTitle = styled.div`
  font-weight: 600;
  color: ${(props) =>
    props.theme?.colors?.primary || 'var(--resume-color-primary, #000)'};
  font-size: ${(props) =>
    props.theme?.typography?.body || 'var(--resume-size-body, 11pt)'};
`;

const ItemSubtitle = styled.div`
  color: ${(props) =>
    props.theme?.colors?.secondary || 'var(--resume-color-secondary, #333)'};
  margin-bottom: 4px;
`;

const ItemMeta = styled.div`
  display: flex;
  gap: 12px;
  font-size: ${(props) =>
    props.theme?.typography?.small || 'var(--resume-size-small, 10pt)'};
  color: ${(props) =>
    props.theme?.colors?.tertiary || 'var(--resume-color-tertiary, #666)'};
  margin-bottom: 8px;
`;

const Description = styled.p`
  margin: 8px 0;
  line-height: 1.6;
`;

const Highlights = styled.ul`
  margin: 8px 0;
  padding-left: 20px;
  list-style-type: disc;

  li {
    margin: 4px 0;
    line-height: 1.5;
  }
`;

export function ListItem({
  title,
  subtitle,
  dateRange,
  location,
  description,
  highlights = [],
  className,
  ...rest
}) {
  if (!title) return null;

  const metaItems = [dateRange, location].filter(Boolean);

  return (
    <ItemContainer
      className={`resume-item ${className || ''}`.trim()}
      {...rest}
    >
      <ItemHeader className="resume-item-header">
        <ItemTitle className="resume-item-title">{title}</ItemTitle>
      </ItemHeader>

      {subtitle && (
        <ItemSubtitle className="resume-item-subtitle">{subtitle}</ItemSubtitle>
      )}

      {metaItems.length > 0 && (
        <ItemMeta className="resume-item-meta">
          {dateRange && <span className="resume-date">{dateRange}</span>}
          {dateRange && location && <span>•</span>}
          {location && <span className="resume-location">{location}</span>}
        </ItemMeta>
      )}

      {description && (
        <Description className="resume-description">{description}</Description>
      )}

      {highlights.length > 0 && (
        <Highlights className="resume-highlights">
          {highlights.map((highlight, index) => (
            <li key={index}>{highlight}</li>
          ))}
        </Highlights>
      )}
    </ItemContainer>
  );
}

export default ListItem;
