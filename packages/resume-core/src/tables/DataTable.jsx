import React from 'react';
/**
 * DataTable
 * Generic data table with sorting and styling options
 */
import styled from 'styled-components';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: var(--resume-size-body);
  margin: var(--resume-space-item) 0;

  @media print {
    break-inside: avoid;
  }

  @media (max-width: 768px) {
    font-size: var(--resume-size-small);
    display: block;
    overflow-x: auto;
  }
`;

const Thead = styled.thead`
  background-color: var(--resume-color-muted);

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const Th = styled.th`
  padding: 12px;
  text-align: ${(props) => props.$align || 'left'};
  font-weight: var(--resume-weight-medium);
  color: var(--resume-color-primary);
  border: 1px solid var(--resume-color-border);
  white-space: nowrap;

  @media print {
    border: 1px solid var(--resume-color-border);
  }
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: ${(props) =>
      props.$striped ? 'var(--resume-color-background)' : 'transparent'};
  }

  &:hover {
    background-color: var(--resume-color-muted);
  }

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;

    &:hover {
      background-color: transparent;
    }
  }
`;

const Td = styled.td`
  padding: 10px 12px;
  border: 1px solid var(--resume-color-border);
  color: var(--resume-color-secondary);
  text-align: ${(props) => props.$align || 'left'};
  vertical-align: top;

  @media print {
    border: 1px solid var(--resume-color-border);
  }
`;

const Tfoot = styled.tfoot`
  background-color: var(--resume-color-muted);
  font-weight: var(--resume-weight-medium);

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

/**
 * @param {Object} props
 * @param {Array} props.columns - Column definitions
 * @param {string} props.columns[].key - Column key
 * @param {string} props.columns[].header - Column header text
 * @param {string} [props.columns[].align] - Text alignment
 * @param {Array} props.data - Array of data objects
 * @param {boolean} [props.striped=true] - Alternate row colors
 * @param {Array} [props.footer] - Footer row data
 * @param {string} [props.className] - Additional CSS classes
 */
export function DataTable({
  columns = [],
  data = [],
  striped = true,
  footer,
  className,
}) {
  if (!columns || columns.length === 0 || !data || data.length === 0)
    return null;

  return (
    <Table className={className}>
      <Thead>
        <Tr>
          {columns.map((col) => (
            <Th key={col.key} $align={col.align}>
              {col.header}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {data.map((row, rowIndex) => (
          <Tr key={rowIndex} $striped={striped}>
            {columns.map((col) => (
              <Td key={col.key} $align={col.align}>
                {row[col.key]}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
      {footer && (
        <Tfoot>
          <Tr>
            {footer.map((cell, index) => (
              <Td key={index} $align={columns[index]?.align}>
                {cell}
              </Td>
            ))}
          </Tr>
        </Tfoot>
      )}
    </Table>
  );
}

export default DataTable;
