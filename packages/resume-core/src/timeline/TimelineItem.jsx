import React from 'react';
/**
 * TimelineItem
 * Individual timeline entry with connector line
 */
import styled from 'styled-components';

const Item = styled.div`
  position: relative;
  padding-left: ${(props) => (props.$showLine ? '32px' : '0')};
  margin-bottom: var(--resume-space-item);

  ${(props) =>
    props.$showLine &&
    `
    &::before {
      content: '';
      position: absolute;
      left: 8px;
      top: 8px;
      bottom: -16px;
      width: 2px;
      background-color: var(--resume-color-border);
    }

    &:last-child::before {
      display: none;
    }
  `}

  @media print {
    break-inside: avoid;
  }
`;

const Marker = styled.div`
  position: absolute;
  left: 0;
  top: 6px;
  width: ${(props) => props.$size || '16px'};
  height: ${(props) => props.$size || '16px'};
  border-radius: 50%;
  background-color: ${(props) => props.$color || 'var(--resume-color-accent)'};
  border: 2px solid var(--resume-color-background);

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
  flex-wrap: wrap;
`;

const Title = styled.h3`
  font-size: var(--resume-size-subheading);
  font-weight: var(--resume-weight-semibold);
  color: var(--resume-color-primary);
  margin: 0;
`;

const Meta = styled.div`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
`;

const Description = styled.div`
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
`;

export function TimelineItem({
  title,
  meta,
  showLine = true,
  markerColor,
  markerSize,
  children,
  className,
}) {
  return (
    <Item $showLine={showLine} className={className}>
      {showLine && <Marker $color={markerColor} $size={markerSize} />}
      <Content>
        <Header>
          <Title>{title}</Title>
          {meta && <Meta>{meta}</Meta>}
        </Header>
        {children && <Description>{children}</Description>}
      </Content>
    </Item>
  );
}

export default TimelineItem;
