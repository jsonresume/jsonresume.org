import React from 'react';
/**
 * PublicationItem
 * Publication entry with title, publisher, date, and summary
 */
import styled from 'styled-components';

const Container = styled.div`
  padding: var(--resume-space-tight) 0;
  border-bottom: 1px solid var(--resume-color-border);
  break-inside: avoid;

  &:last-child {
    border-bottom: none;
  }

  @media print {
    border-bottom: 1px solid var(--resume-color-border);
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--resume-space-tight);
  margin-bottom: 4px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 4px;
  }
`;

const Title = styled.h3`
  margin: 0;
  font-size: var(--resume-size-subheading);
  font-weight: var(--resume-weight-medium);
  color: var(--resume-color-primary);
`;

const Date = styled.time`
  font-size: var(--resume-size-small);
  color: var(--resume-color-tertiary);
  white-space: nowrap;
`;

const Publisher = styled.div`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
  font-style: italic;
  margin-bottom: 8px;
`;

const Summary = styled.p`
  margin: 0;
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
`;

const Link = styled.a`
  display: inline-block;
  margin-top: 8px;
  font-size: var(--resume-size-small);
  color: var(--resume-color-accent);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  @media print {
    color: var(--resume-color-primary);
    text-decoration: none;

    &::after {
      content: ' (' attr(href) ')';
      font-size: var(--resume-size-tiny);
    }
  }
`;

/**
 * @param {Object} props
 * @param {string} props.name - Publication name/title
 * @param {string} [props.publisher] - Publisher name
 * @param {string} [props.releaseDate] - Release date
 * @param {string} [props.summary] - Publication description
 * @param {string} [props.url] - Link to publication
 * @param {string} [props.className] - Additional CSS classes
 */
export function PublicationItem({
  name,
  publisher,
  releaseDate,
  summary,
  url,
  className,
}) {
  return (
    <Container className={className}>
      <Header>
        <Title>{name}</Title>
        {releaseDate && <Date>{releaseDate}</Date>}
      </Header>
      {publisher && <Publisher>{publisher}</Publisher>}
      {summary && <Summary>{summary}</Summary>}
      {url && (
        <Link href={url} target="_blank" rel="noopener noreferrer">
          View Publication
        </Link>
      )}
    </Container>
  );
}

export default PublicationItem;
