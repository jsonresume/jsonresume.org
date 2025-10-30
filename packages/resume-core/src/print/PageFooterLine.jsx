import React from 'react';
/**
 * PageFooterLine
 * Small footer with page number and date
 * Displays "Page X of N" format with automatic page numbering
 */
import styled from 'styled-components';

const FooterContainer = styled.div`
  display: none;

  @media print {
    display: block;
    position: running(footer);
    padding-top: var(--resume-space-xs, 0.5rem);
    border-top: 1px solid var(--resume-color-border, #e5e7eb);
    font-size: var(--resume-size-xs, 0.75rem);
    color: var(--resume-color-secondary, #6b7280);
  }
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PageNumber = styled.span`
  @media print {
    &::before {
      content: 'Page ';
    }
    &::after {
      content: ' of ' counter(pages);
    }
  }
`;

const CurrentPage = styled.span`
  @media print {
    &::before {
      content: counter(page);
    }
  }
`;

const Date = styled.span`
  font-variant-numeric: tabular-nums;
`;

/**
 * PageFooterLine component displays a footer on each printed page
 * Includes page numbers and optional date
 *
 * @param {Object} props
 * @param {boolean} [props.showDate=true] - Show current date
 * @param {string} [props.dateFormat] - Custom date string (defaults to locale date)
 * @param {React.ReactNode} [props.children] - Optional custom content
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element}
 *
 * @example
 * <PageFooterLine showDate={true} />
 * <PageFooterLine dateFormat="January 2025" />
 */
export function PageFooterLine({
  showDate = true,
  dateFormat,
  children,
  className,
}) {
  const dateText =
    dateFormat ||
    new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <FooterContainer className={className}>
      <FooterContent>
        <PageNumber>
          <CurrentPage />
        </PageNumber>
        {showDate && <Date>{dateText}</Date>}
        {children}
      </FooterContent>
    </FooterContainer>
  );
}

export default PageFooterLine;
