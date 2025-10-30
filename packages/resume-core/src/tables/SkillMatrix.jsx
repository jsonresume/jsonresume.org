import React from 'react';
/**
 * SkillMatrix
 * Matrix table for skills vs proficiency levels
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

const Thead = styled.thead`
  background-color: var(--resume-color-muted);

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const Th = styled.th`
  padding: 10px;
  text-align: left;
  font-weight: var(--resume-weight-medium);
  color: var(--resume-color-primary);
  border: 1px solid var(--resume-color-border);

  @media print {
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
  padding: 10px;
  border: 1px solid var(--resume-color-border);
  color: var(--resume-color-secondary);

  @media print {
    border: 1px solid var(--resume-color-border);
  }
`;

const Cell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Indicator = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => {
    if (props.$level === 'expert') return 'var(--resume-color-accent)';
    if (props.$level === 'advanced') return 'var(--resume-color-success)';
    if (props.$level === 'intermediate') return 'var(--resume-color-warning)';
    return 'var(--resume-color-border)';
  }};

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border: 2px solid
      ${(props) => {
        if (props.$level === 'expert') return 'var(--resume-color-accent)';
        if (props.$level === 'advanced') return 'var(--resume-color-success)';
        if (props.$level === 'intermediate')
          return 'var(--resume-color-warning)';
        return 'var(--resume-color-border)';
      }};
  }
`;

/**
 * @param {Object} props
 * @param {Array} props.skills - Array of skill objects
 * @param {string} props.skills[].name - Skill name
 * @param {Object} props.skills[].levels - Proficiency levels object
 * @param {Array<string>} [props.categories] - Category headers
 * @param {string} [props.className] - Additional CSS classes
 */
export function SkillMatrix({ skills = [], categories = [], className }) {
  if (!skills || skills.length === 0) return null;

  return (
    <Table className={className}>
      <Thead>
        <Tr>
          <Th>Skill</Th>
          {categories.map((cat, index) => (
            <Th key={index}>{cat}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {skills.map((skill, index) => (
          <Tr key={index}>
            <Td>{skill.name}</Td>
            {categories.map((cat, catIndex) => (
              <Td key={catIndex}>
                <Cell>
                  {skill.levels && skill.levels[cat] && (
                    <Indicator $level={skill.levels[cat]} />
                  )}
                </Cell>
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export default SkillMatrix;
