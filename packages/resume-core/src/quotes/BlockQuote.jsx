import React from 'react';
/**
 * BlockQuote
 * Simple blockquote styling for quotes and references
 */
import styled from 'styled-components';

const Quote = styled.blockquote`
  margin: var(--resume-space-item) 0;
  padding: var(--resume-space-tight) var(--resume-space-item);
  border-left: 3px solid var(--resume-color-border);
  font-style: italic;
  color: var(--resume-color-secondary);
  background-color: ${(props) =>
    props.$highlight ? 'var(--resume-color-muted)' : 'transparent'};
  break-inside: avoid;

  @media print {
    border-left: 3px solid var(--resume-color-border);
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;

const Text = styled.p`
  margin: 0;
  font-size: var(--resume-size-body);
  line-height: var(--resume-line-height-normal);
`;

const Cite = styled.cite`
  display: block;
  margin-top: var(--resume-space-tight);
  font-size: var(--resume-size-small);
  font-style: normal;
  color: var(--resume-color-tertiary);
`;

/**
 * @param {Object} props
 * @param {string|React.ReactNode} props.children - Quote content
 * @param {string} [props.cite] - Citation source
 * @param {boolean} [props.highlight] - Apply background highlight
 * @param {string} [props.className] - Additional CSS classes
 */
export function BlockQuote({ children, cite, highlight = false, className }) {
  return (
    <Quote $highlight={highlight} className={className}>
      <Text>{children}</Text>
      {cite && <Cite>— {cite}</Cite>}
    </Quote>
  );
}

export default BlockQuote;
