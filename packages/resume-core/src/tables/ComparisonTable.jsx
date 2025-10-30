import React from 'react';
/**
 * ComparisonTable
 * Comparison table for side-by-side data presentation
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
  }
`;

const Thead = styled.thead``;

const Th = styled.th`
  padding: 12px;
  text-align: ${(props) => props.$align || 'left'};
  font-weight: var(--resume-weight-medium);
  color: var(--resume-color-primary);
  background-color: var(--resume-color-muted);
  border: 1px solid var(--resume-color-border);

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border: 1px solid var(--resume-color-border);
  }
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: var(--resume-color-background);
  }

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
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

const Label = styled.td`
  padding: 10px 12px;
  border: 1px solid var(--resume-color-border);
  color: var(--resume-color-primary);
  font-weight: var(--resume-weight-medium);
  background-color: var(--resume-color-muted);

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border: 1px solid var(--resume-color-border);
  }
`;

/**
 * @param {Object} props
 * @param {Array<string>} props.headers - Table headers
 * @param {Array} props.rows - Array of row data
 * @param {boolean} [props.firstColumnLabel=false] - Style first column as label
 * @param {string} [props.align='left'] - Text alignment
 * @param {string} [props.className] - Additional CSS classes
 */
export function ComparisonTable({
  headers = [],
  rows = [],
  firstColumnLabel = false,
  align = 'left',
  className,
}) {
  if (!rows || rows.length === 0) return null;

  return (
    <Table className={className}>
      {headers.length > 0 && (
        <Thead>
          <Tr>
            {headers.map((header, index) => (
              <Th key={index} $align={align}>
                {header}
              </Th>
            ))}
          </Tr>
        </Thead>
      )}
      <Tbody>
        {rows.map((row, rowIndex) => (
          <Tr key={rowIndex}>
            {row.map((cell, cellIndex) => {
              const CellComponent =
                firstColumnLabel && cellIndex === 0 ? Label : Td;
              return (
                <CellComponent key={cellIndex} $align={align}>
                  {cell}
                </CellComponent>
              );
            })}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export default ComparisonTable;
