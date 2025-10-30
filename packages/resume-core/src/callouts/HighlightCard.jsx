import React from 'react';
/**
 * HighlightCard
 * Highlighted card for featured content
 */
import styled from 'styled-components';

const Card = styled.div`
  padding: var(--resume-space-item);
  background-color: ${(props) => props.$color || 'var(--resume-color-accent)'};
  color: white;
  border-radius: var(--resume-radius-md);
  margin: var(--resume-space-item) 0;
  break-inside: avoid;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border: 2px solid ${(props) => props.$color || 'var(--resume-color-accent)'};
    background-color: transparent;
    color: var(--resume-color-primary);
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--resume-space-tight);
  margin-bottom: var(--resume-space-tight);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const Title = styled.h3`
  margin: 0;
  font-size: var(--resume-size-heading);
  font-weight: var(--resume-weight-bold);
  color: inherit;

  @media print {
    color: var(--resume-color-primary);
  }
`;

const Badge = styled.div`
  padding: 4px 12px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: var(--resume-radius-full);
  font-size: var(--resume-size-small);
  white-space: nowrap;

  @media print {
    background-color: transparent;
    border: 1px solid currentColor;
  }
`;

const Content = styled.div`
  font-size: var(--resume-size-body);
  line-height: var(--resume-line-height-normal);

  @media print {
    color: var(--resume-color-secondary);
  }
`;

const Footer = styled.div`
  margin-top: var(--resume-space-tight);
  padding-top: var(--resume-space-tight);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  font-size: var(--resume-size-small);

  @media print {
    border-top: 1px solid var(--resume-color-border);
    color: var(--resume-color-tertiary);
  }
`;

/**
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {string|React.ReactNode} props.children - Card content
 * @param {string} [props.badge] - Badge text
 * @param {string} [props.footer] - Footer text
 * @param {string} [props.color] - Custom background color
 * @param {string} [props.className] - Additional CSS classes
 */
export function HighlightCard({
  title,
  children,
  badge,
  footer,
  color,
  className,
}) {
  return (
    <Card $color={color} className={className}>
      <Header>
        <Title>{title}</Title>
        {badge && <Badge>{badge}</Badge>}
      </Header>
      <Content>{children}</Content>
      {footer && <Footer>{footer}</Footer>}
    </Card>
  );
}

export default HighlightCard;
