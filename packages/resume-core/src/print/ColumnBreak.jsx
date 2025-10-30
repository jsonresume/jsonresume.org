import React from 'react';
/**
 * ColumnBreak
 * Force column or page break for print layouts
 */
import styled from 'styled-components';

const Break = styled.div`
  @media print {
    ${(props) => {
      if (props.$type === 'page') {
        return `
          page-break-after: always;
          break-after: page;
        `;
      }
      if (props.$type === 'column') {
        return `
          column-break-after: always;
          break-after: column;
        `;
      }
      return `
        page-break-after: always;
        break-after: page;
      `;
    }}
  }

  @media screen {
    display: none;
  }
`;

/**
 * @param {Object} props
 * @param {string} [props.type='page'] - Break type (page, column)
 * @param {string} [props.className] - Additional CSS classes
 */
export function ColumnBreak({ type = 'page', className }) {
  return <Break $type={type} className={className} />;
}

export default ColumnBreak;
