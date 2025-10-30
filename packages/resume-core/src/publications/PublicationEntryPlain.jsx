import React from 'react';
/**
 * PublicationEntryPlain
 * Plain-text publication entry optimized for ATS parsing
 * Format: Author · Year · Title · Venue
 */
import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: var(--resume-space-tight);
  padding-left: 1.5em;
  text-indent: -1.5em;
  break-inside: avoid;
  line-height: var(--resume-line-height-relaxed);

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;

const Text = styled.span`
  font-size: var(--resume-size-body);
  color: var(--resume-color-primary);
`;

const Author = styled(Text)`
  font-weight: var(--resume-weight-medium);
`;

const Year = styled(Text)`
  color: var(--resume-color-secondary);
`;

const Title = styled(Text)`
  font-style: italic;
`;

const Venue = styled(Text)`
  color: var(--resume-color-secondary);
`;

const Separator = styled.span`
  margin: 0 0.5em;
  color: var(--resume-color-tertiary);
`;

const Link = styled.a`
  color: var(--resume-color-accent);
  text-decoration: none;
  margin-left: 0.5em;

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

/**
 * PublicationEntryPlain Component
 *
 * Displays a publication in a plain, ATS-friendly format with hanging indent.
 * Format: Author · Year · Title · Venue
 *
 * @param {Object} props - Component props
 * @param {string} props.author - Author name(s)
 * @param {string|number} [props.year] - Publication year
 * @param {string} props.title - Publication title (displayed in italics)
 * @param {string} [props.venue] - Publication venue (journal, conference, etc.)
 * @param {string} [props.url] - Link to publication
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * ```jsx
 * <PublicationEntryPlain
 *   author="Smith, J. & Doe, A."
 *   year={2023}
 *   title="A Novel Approach to Resume Formatting"
 *   venue="Journal of CV Design, Vol. 12"
 *   url="https://example.com/paper"
 * />
 * ```
 */
export function PublicationEntryPlain({
  author,
  year,
  title,
  venue,
  url,
  className,
}) {
  return (
    <Container className={className}>
      <Author>{author}</Author>
      {year && (
        <>
          <Separator>·</Separator>
          <Year>{year}</Year>
        </>
      )}
      <Separator>·</Separator>
      <Title>{title}</Title>
      {venue && (
        <>
          <Separator>·</Separator>
          <Venue>{venue}</Venue>
        </>
      )}
      {url && (
        <Link href={url} target="_blank" rel="noopener noreferrer">
          [link]
        </Link>
      )}
    </Container>
  );
}

export default PublicationEntryPlain;
