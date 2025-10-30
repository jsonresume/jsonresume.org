import React from 'react';
/**
 * PullQuote
 * Large prominent quote with author attribution
 */
import styled from 'styled-components';

const Container = styled.blockquote`
  margin: var(--resume-space-section) 0;
  padding: var(--resume-space-item);
  border-left: 4px solid var(--resume-color-accent);
  background-color: var(--resume-color-muted);
  break-inside: avoid;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border-left: 4px solid var(--resume-color-accent);
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;

const QuoteText = styled.p`
  font-size: var(--resume-size-subheading);
  font-style: italic;
  color: var(--resume-color-primary);
  line-height: var(--resume-line-height-relaxed);
  margin: 0 0 var(--resume-space-tight) 0;
`;

const Attribution = styled.footer`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
  text-align: right;
`;

const Author = styled.cite`
  font-style: normal;
  font-weight: var(--resume-weight-medium);
`;

const Context = styled.span`
  display: block;
  font-size: var(--resume-size-tiny);
  margin-top: 2px;
`;

/**
 * @param {Object} props
 * @param {string} props.quote - The quote text
 * @param {string} props.author - Author name
 * @param {string} [props.context] - Optional context (role, company, etc.)
 * @param {string} [props.className] - Additional CSS classes
 */
export function PullQuote({ quote, author, context, className }) {
  return (
    <Container className={className}>
      <QuoteText>"{quote}"</QuoteText>
      {author && (
        <Attribution>
          — <Author>{author}</Author>
          {context && <Context>{context}</Context>}
        </Attribution>
      )}
    </Container>
  );
}

export default PullQuote;
