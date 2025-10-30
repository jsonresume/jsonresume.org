import React from 'react';
/**
 * PrintOnly
 * Show content only when printing
 */
import styled from 'styled-components';

const Container = styled.div`
  display: ${(props) => (props.$hideScreen ? 'none' : 'block')};

  @media print {
    display: block !important;
  }

  @media screen {
    display: ${(props) => (props.$hideScreen ? 'none !important' : 'block')};
  }
`;

const ScreenContainer = styled.div`
  @media print {
    display: none !important;
  }
`;

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to show only when printing
 * @param {boolean} [props.hideScreen=true] - Hide on screen (default true)
 * @param {string} [props.className] - Additional CSS classes
 */
export function PrintOnly({ children, hideScreen = true, className }) {
  return (
    <Container $hideScreen={hideScreen} className={className}>
      {children}
    </Container>
  );
}

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to show only on screen
 * @param {string} [props.className] - Additional CSS classes
 */
export function ScreenOnly({ children, className }) {
  return <ScreenContainer className={className}>{children}</ScreenContainer>;
}

export default PrintOnly;
