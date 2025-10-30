import React from 'react';
/**
 * InfoBox
 * Information box with icon and text
 */
import styled from 'styled-components';

const Box = styled.div`
  display: flex;
  gap: var(--resume-space-tight);
  padding: var(--resume-space-tight);
  background-color: var(--resume-color-background);
  border: 1px solid var(--resume-color-border);
  border-radius: var(--resume-radius-md);
  margin: var(--resume-space-tight) 0;
  break-inside: avoid;

  @media print {
    border: 1px solid var(--resume-color-border);
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;

const Icon = styled.div`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${(props) => props.$color || 'var(--resume-color-accent)'};
  color: white;
  font-size: 14px;
  font-weight: var(--resume-weight-bold);

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border: 2px solid ${(props) => props.$color || 'var(--resume-color-accent)'};
  }
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.div`
  font-size: var(--resume-size-body);
  font-weight: var(--resume-weight-medium);
  color: var(--resume-color-primary);
  margin-bottom: 4px;
`;

const Text = styled.div`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
`;

/**
 * @param {Object} props
 * @param {string|React.ReactNode} props.children - Box content
 * @param {string} [props.title] - Optional title
 * @param {string|React.ReactNode} [props.icon] - Icon or emoji
 * @param {string} [props.iconColor] - Custom icon color
 * @param {string} [props.className] - Additional CSS classes
 */
export function InfoBox({ children, title, icon = 'i', iconColor, className }) {
  return (
    <Box className={className}>
      <Icon $color={iconColor}>{icon}</Icon>
      <Content>
        {title && <Title>{title}</Title>}
        <Text>{children}</Text>
      </Content>
    </Box>
  );
}

export default InfoBox;
