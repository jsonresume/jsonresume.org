import React from 'react';
/**
 * CertificationRow
 * Text-only certification row optimized for ATS parsing
 * Format: Issuer · Name · ID/URL
 */
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5em;
  margin-bottom: 0.5em;
  font-size: var(--resume-size-body);
  line-height: var(--resume-line-height-normal);
  break-inside: avoid;

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  @media (max-width: 768px) {
    font-size: var(--resume-size-small);
  }
`;

const Issuer = styled.span`
  font-weight: var(--resume-weight-semibold);
  color: var(--resume-color-primary);
`;

const Name = styled.span`
  color: var(--resume-color-primary);
`;

const Credential = styled.span`
  font-family: 'Courier New', Courier, monospace;
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
  background-color: var(--resume-color-background);
  padding: 2px 6px;
  border-radius: var(--resume-radius-sm);
  border: 1px solid var(--resume-color-border);

  @media print {
    background-color: transparent;
    border: 1px solid var(--resume-color-border);
    padding: 1px 4px;
  }
`;

const Date = styled.span`
  font-size: var(--resume-size-small);
  color: var(--resume-color-tertiary);
  font-style: italic;
`;

const Link = styled.a`
  color: var(--resume-color-accent);
  text-decoration: none;
  font-size: var(--resume-size-small);

  &:hover {
    text-decoration: underline;
  }

  @media print {
    color: var(--resume-color-primary);
    text-decoration: none;

    &::after {
      content: ' [' attr(href) ']';
      font-size: var(--resume-size-tiny);
    }
  }
`;

const Separator = styled.span`
  color: var(--resume-color-tertiary);

  &::before {
    content: '·';
  }
`;

/**
 * CertificationRow Component
 *
 * Displays a certification in a compact, text-only row format.
 * Optimized for ATS parsing with monospace credential IDs for improved legibility.
 *
 * @param {Object} props - Component props
 * @param {string} props.issuer - Issuing organization name
 * @param {string} props.name - Certification name
 * @param {string} [props.credentialId] - Credential ID or certificate number
 * @param {string} [props.date] - Date obtained (ISO string or formatted)
 * @param {string} [props.url] - Link to verify certification
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * ```jsx
 * <CertificationRow
 *   issuer="AWS"
 *   name="Solutions Architect Associate"
 *   credentialId="CERT-123-456-789"
 *   date="2023-06"
 *   url="https://aws.amazon.com/verify/cert123"
 * />
 * ```
 */
export function CertificationRow({
  issuer,
  name,
  credentialId,
  date,
  url,
  className,
}) {
  return (
    <Container className={className}>
      <Issuer>{issuer}</Issuer>
      <Separator />
      <Name>{name}</Name>
      {credentialId && (
        <>
          <Separator />
          <Credential>{credentialId}</Credential>
        </>
      )}
      {date && (
        <>
          <Separator />
          <Date>{date}</Date>
        </>
      )}
      {url && (
        <>
          <Separator />
          <Link href={url} target="_blank" rel="noopener noreferrer">
            verify
          </Link>
        </>
      )}
    </Container>
  );
}

export default CertificationRow;
