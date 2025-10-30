import React from 'react';
/**
 * KeepTogether
 * Prevent page break within content
 */
import styled from 'styled-components';

const Container = styled.div`
  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to keep together
 * @param {string} [props.className] - Additional CSS classes
 */
export function KeepTogether({ children, className }) {
  return <Container className={className}>{children}</Container>;
}

export default KeepTogether;
