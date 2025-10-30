import React from 'react';
/**
 * Footer
 * Resume footer with optional page numbers
 */
import styled from 'styled-components';

const StyledFooter = styled.footer`
  margin-top: var(--resume-space-section);
  padding-top: var(--resume-space-item);
  border-top: 1px solid var(--resume-color-border);
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
  text-align: ${(props) => props.$align || 'center'};

  @media print {
    border-top: 1px solid var(--resume-color-border);
    position: running(footer);
  }
`;

const PageNumber = styled.span`
  @media print {
    &::after {
      content: counter(page);
    }
  }
`;

export function Footer({
  text,
  showPageNumbers = false,
  align = 'center',
  children,
  className,
}) {
  return (
    <StyledFooter $align={align} className={className}>
      {text && <div>{text}</div>}
      {showPageNumbers && (
        <div>
          Page <PageNumber />
        </div>
      )}
      {children}
    </StyledFooter>
  );
}

export default Footer;
