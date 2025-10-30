import React from 'react';
/**
 * ContactGrid
 * Grid layout for contact information
 */
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--resume-space-tight);
  margin-bottom: var(--resume-space-section);

  @media print {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
`;

const Icon = styled.span`
  color: var(--resume-color-accent);
`;

const Link = styled.a`
  color: inherit;
  text-decoration: none;

  &:hover {
    color: var(--resume-color-accent);
  }

  @media print {
    color: var(--resume-color-secondary);
  }
`;

export function ContactGrid({ contacts = [], className }) {
  return (
    <Grid className={className}>
      {contacts.map((contact, index) => (
        <Item key={index}>
          {contact.icon && <Icon>{contact.icon}</Icon>}
          {contact.url ? (
            <Link href={contact.url} target="_blank" rel="noopener noreferrer">
              {contact.value}
            </Link>
          ) : (
            <span>{contact.value}</span>
          )}
        </Item>
      ))}
    </Grid>
  );
}

export default ContactGrid;
