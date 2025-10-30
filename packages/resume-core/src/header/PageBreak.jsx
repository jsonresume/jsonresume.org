import React from 'react';
/**
 * PageBreak
 * Force page break for printing
 */
import styled from 'styled-components';

const Break = styled.div`
  @media print {
    page-break-before: ${(props) => (props.$before ? 'always' : 'auto')};
    page-break-after: ${(props) => (props.$after ? 'always' : 'auto')};
    break-before: ${(props) => (props.$before ? 'page' : 'auto')};
    break-after: ${(props) => (props.$after ? 'page' : 'auto')};
  }

  @media screen {
    display: none;
  }
`;

export function PageBreak({ before = false, after = true, className }) {
  return <Break $before={before} $after={after} className={className} />;
}

export default PageBreak;
