import React from 'react';
/**
 * SocialLinks
 * Social media links display
 */
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  gap: var(--resume-space-tight);
  flex-wrap: wrap;
`;

const Link = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  font-size: var(--resume-size-body);
  color: var(--resume-color-primary);
  text-decoration: none;
  border: 1px solid var(--resume-color-border);
  border-radius: var(--resume-radius-sm);
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--resume-color-accent);
    color: #ffffff;
    border-color: var(--resume-color-accent);
  }

  @media print {
    border: 1px solid var(--resume-color-border);
    color: var(--resume-color-primary);
  }
`;

const Icon = styled.span`
  display: inline-flex;
`;

export function SocialLinks({ links = [], showIcon = true, className }) {
  return (
    <Container className={className}>
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          title={link.network}
        >
          {showIcon && link.icon && <Icon>{link.icon}</Icon>}
          <span>{link.username || link.network}</span>
        </Link>
      ))}
    </Container>
  );
}

export default SocialLinks;
