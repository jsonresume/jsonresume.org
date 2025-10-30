import React from 'react';
/**
 * ProjectCard
 * Card for projects with title, description, technologies, and links
 */
import styled from 'styled-components';

const Card = styled.div`
  padding: var(--resume-space-item);
  background-color: var(--resume-color-background);
  border: 1px solid var(--resume-color-border);
  border-radius: var(--resume-radius-md);
  margin-bottom: var(--resume-space-tight);
  break-inside: avoid;

  @media print {
    border: 1px solid var(--resume-color-border);
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--resume-space-tight);
  margin-bottom: 8px;
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

const Description = styled.p`
  margin: 0 0 var(--resume-space-tight) 0;
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
`;

const Technologies = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: var(--resume-space-tight);
`;

const Tech = styled.span`
  padding: 4px 10px;
  font-size: var(--resume-size-small);
  background-color: var(--resume-color-muted);
  color: var(--resume-color-secondary);
  border-radius: var(--resume-radius-sm);

  @media print {
    border: 1px solid var(--resume-color-border);
    background-color: transparent;
  }
`;

const Links = styled.div`
  display: flex;
  gap: var(--resume-space-tight);
`;

const Link = styled.a`
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
 * @param {string} props.name - Project name
 * @param {string} [props.description] - Project description
 * @param {Array<string>} [props.technologies] - Technologies used
 * @param {string} [props.startDate] - Start date
 * @param {string} [props.endDate] - End date
 * @param {string} [props.url] - Project URL
 * @param {string} [props.repository] - Repository URL
 * @param {string} [props.className] - Additional CSS classes
 */
export function ProjectCard({
  name,
  description,
  technologies = [],
  startDate,
  endDate,
  url,
  repository,
  className,
}) {
  const dateRange = [startDate, endDate].filter(Boolean).join(' - ');

  return (
    <Card className={className}>
      <Header>
        <Title>{name}</Title>
        {dateRange && <Date>{dateRange}</Date>}
      </Header>
      {description && <Description>{description}</Description>}
      {technologies.length > 0 && (
        <Technologies>
          {technologies.map((tech, index) => (
            <Tech key={index}>{tech}</Tech>
          ))}
        </Technologies>
      )}
      {(url || repository) && (
        <Links>
          {url && (
            <Link href={url} target="_blank" rel="noopener noreferrer">
              View Project
            </Link>
          )}
          {repository && (
            <Link href={repository} target="_blank" rel="noopener noreferrer">
              Source Code
            </Link>
          )}
        </Links>
      )}
    </Card>
  );
}

export default ProjectCard;
