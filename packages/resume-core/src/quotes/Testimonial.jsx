import React from 'react';
/**
 * Testimonial
 * Testimonial card with photo, quote, author, and position
 */
import styled from 'styled-components';

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--resume-space-tight);
  padding: var(--resume-space-item);
  background-color: var(--resume-color-background);
  border: 1px solid var(--resume-color-border);
  border-radius: var(--resume-radius-md);
  break-inside: avoid;

  @media print {
    border: 1px solid var(--resume-color-border);
    break-inside: avoid;
    page-break-inside: avoid;
  }

  @media (max-width: 768px) {
    padding: var(--resume-space-tight);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: var(--resume-space-tight);
`;

const Photo = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const AuthorInfo = styled.div`
  flex: 1;
`;

const Author = styled.div`
  font-size: var(--resume-size-body);
  font-weight: var(--resume-weight-medium);
  color: var(--resume-color-primary);
`;

const Position = styled.div`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
`;

const Quote = styled.blockquote`
  margin: 0;
  font-size: var(--resume-size-body);
  font-style: italic;
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
`;

/**
 * @param {Object} props
 * @param {string} props.quote - The testimonial text
 * @param {string} props.author - Author name
 * @param {string} [props.position] - Author position/title
 * @param {string} [props.photo] - URL to author photo
 * @param {string} [props.company] - Company name
 * @param {string} [props.className] - Additional CSS classes
 */
export function Testimonial({
  quote,
  author,
  position,
  photo,
  company,
  className,
}) {
  const displayPosition = company ? `${position} at ${company}` : position;

  return (
    <Card className={className}>
      <Header>
        {photo && <Photo src={photo} alt={author} />}
        <AuthorInfo>
          <Author>{author}</Author>
          {displayPosition && <Position>{displayPosition}</Position>}
        </AuthorInfo>
      </Header>
      <Quote>"{quote}"</Quote>
    </Card>
  );
}

export default Testimonial;
