import React from 'react';
import styled from 'styled-components';

/**
 * DefinitionKeyline
 * Definition list with term — description format using em-dash
 * Predictable spacing across fonts with flexible layout options
 */

const List = styled.dl`
  margin: var(--resume-space-tight) 0;
  display: grid;
  grid-template-columns: ${(props) =>
    props.$layout === 'inline' ? 'auto 1fr' : '1fr'};
  gap: ${(props) => (props.$layout === 'inline' ? '8px 16px' : '4px')};
`;

const Term = styled.dt`
  font-size: var(--resume-size-body);
  color: var(--resume-color-text);
  font-weight: var(--resume-weight-semibold);
  line-height: var(--resume-line-height-normal);

  ${(props) =>
    props.$layout === 'stacked' &&
    `
    margin-top: 8px;
    &:first-child {
      margin-top: 0;
    }
  `}

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;

const Description = styled.dd`
  margin: 0;
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);

  ${(props) =>
    props.$layout === 'inline' &&
    `
    display: flex;
    align-items: baseline;
  `}

  ${(props) =>
    props.$layout === 'stacked' &&
    `
    margin-left: 16px;
    &::before {
      content: '—'; /* Em-dash (U+2014) */
      margin-right: 8px;
      color: ${props.$color || 'var(--resume-color-accent)'};
    }
  `}

  ${(props) =>
    props.$layout === 'inline' &&
    `
    &::before {
      content: '—'; /* Em-dash (U+2014) */
      margin: 0 8px;
      color: ${props.$color || 'var(--resume-color-accent)'};
      flex-shrink: 0;
    }
  `}

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;

    &::before {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`;

/**
 * @param {Object} props
 * @param {Array<{term: string, description: string}>} props.items - Array of definition items
 * @param {string} [props.layout='inline'] - Layout style: 'inline' or 'stacked'
 * @param {string} [props.color] - Custom em-dash color
 * @param {string} [props.className] - Additional CSS classes
 */
export function DefinitionKeyline({
  items = [],
  layout = 'inline',
  color,
  className,
}) {
  if (!items || items.length === 0) return null;

  return (
    <List className={className} $layout={layout}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <Term $layout={layout}>{item.term}</Term>
          <Description $layout={layout} $color={color}>
            {item.description}
          </Description>
        </React.Fragment>
      ))}
    </List>
  );
}

export default DefinitionKeyline;
