import React from 'react';
/**
 * PortfolioGrid
 * Grid of portfolio items with thumbnails and descriptions
 */
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--resume-space-item);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  @media print {
    break-inside: avoid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--resume-space-tight);
  }
`;

const Item = styled.div`
  background-color: var(--resume-color-background);
  border: 1px solid var(--resume-color-border);
  border-radius: var(--resume-radius-md);
  overflow: hidden;
  break-inside: avoid;

  @media print {
    border: 1px solid var(--resume-color-border);
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  display: block;

  @media print {
    height: 100px;
  }
`;

const Content = styled.div`
  padding: var(--resume-space-tight);
`;

const Title = styled.h3`
  margin: 0 0 4px 0;
  font-size: var(--resume-size-subheading);
  font-weight: var(--resume-weight-medium);
  color: var(--resume-color-primary);
`;

const Description = styled.p`
  margin: 0 0 8px 0;
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Tag = styled.span`
  padding: 2px 8px;
  font-size: var(--resume-size-tiny);
  background-color: var(--resume-color-muted);
  color: var(--resume-color-secondary);
  border-radius: var(--resume-radius-sm);

  @media print {
    border: 1px solid var(--resume-color-border);
    background-color: transparent;
  }
`;

/**
 * @param {Object} props
 * @param {Array} props.items - Array of portfolio items
 * @param {string} props.items[].title - Item title
 * @param {string} [props.items[].description] - Item description
 * @param {string} [props.items[].thumbnail] - Thumbnail image URL
 * @param {Array<string>} [props.items[].tags] - Item tags
 * @param {string} [props.className] - Additional CSS classes
 */
export function PortfolioGrid({ items = [], className }) {
  if (!items || items.length === 0) return null;

  return (
    <Grid className={className}>
      {items.map((item, index) => (
        <Item key={index}>
          {item.thumbnail && (
            <Thumbnail src={item.thumbnail} alt={item.title} />
          )}
          <Content>
            <Title>{item.title}</Title>
            {item.description && <Description>{item.description}</Description>}
            {item.tags && item.tags.length > 0 && (
              <Tags>
                {item.tags.map((tag, tagIndex) => (
                  <Tag key={tagIndex}>{tag}</Tag>
                ))}
              </Tags>
            )}
          </Content>
        </Item>
      ))}
    </Grid>
  );
}

export default PortfolioGrid;
