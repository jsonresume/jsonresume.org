import React from 'react';
import styled from 'styled-components';

/**
 * ContactRowLine Component
 * Single-line contact information strip with middle dots as separators
 *
 * @component
 * @example
 * <ContactRowLine items={[
 *   { text: "jane@example.com", href: "mailto:jane@example.com" },
 *   { text: "(555) 123-4567" },
 *   { text: "San Francisco, CA" }
 * ]} />
 *
 * @param {Object} props
 * @param {Array<{text: string, href?: string}>} props.items - Contact items to display
 * @param {string} [props.separator='·'] - Separator character between items
 * @param {string} [props.className] - Additional CSS classes
 */

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: var(--resume-size-body, 11px);
  color: var(--resume-color-secondary, #4a4a4a);
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  /* Prevent wrapping to maintain single-line layout */
  flex-wrap: nowrap;

  @media print {
    color: #333333; /* Ensure 4.5:1 contrast for print */
  }

  /* Handle overflow gracefully on very narrow screens */
  @media (max-width: 480px) {
    font-size: 10px;
    gap: 8px;
  }
`;

const ContactItem = styled.span`
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
`;

const ContactLink = styled.a`
  color: inherit;
  text-decoration: none;

  &:hover {
    color: var(--resume-color-accent, #2563eb);
    text-decoration: underline;
  }

  @media print {
    color: #333333;
    text-decoration: none;
  }
`;

const Separator = styled.span`
  color: var(--resume-color-border, #e5e7eb);
  user-select: none;
  font-weight: var(--resume-weight-normal, 400);

  @media print {
    color: #999999;
  }
`;

export function ContactRowLine({
  items = [],
  separator = '·',
  className,
  ...rest
}) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Container
      className={`resume-contact-row ${className || ''}`.trim()}
      {...rest}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ContactItem className="resume-contact-item">
            {item.href ? (
              <ContactLink
                href={item.href}
                className="resume-contact-link"
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={
                  item.href.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
              >
                {item.text}
              </ContactLink>
            ) : (
              item.text
            )}
          </ContactItem>
          {index < items.length - 1 && (
            <Separator aria-hidden="true" className="resume-contact-separator">
              {separator}
            </Separator>
          )}
        </React.Fragment>
      ))}
    </Container>
  );
}

export default ContactRowLine;
