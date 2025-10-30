import React from 'react';
import styled from 'styled-components';
import { DateRange } from '@resume/core';

const Item = styled.div`
  position: relative;
  margin-bottom: 60px;
  display: flex;
  justify-content: ${(props) => (props.$isLeft ? 'flex-start' : 'flex-end')};

  /* Timeline dot */
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    width: 16px;
    height: 16px;
    background: #334155;
    border: 4px solid white;
    border-radius: 50%;
    transform: translateX(-50%);
    z-index: 2;
    box-shadow: 0 0 0 2px #334155;
  }

  /* Connector line from dot to content */
  &::after {
    content: '';
    position: absolute;
    top: 8px;
    width: calc(50% - 40px);
    height: 2px;
    background: #64748b;
    ${(props) =>
      props.$isLeft
        ? `
      left: 32px;
    `
        : `
      right: 32px;
    `}
  }

  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-left: 40px;

    &::before {
      left: 0;
      transform: none;
    }

    &::after {
      left: 16px;
      width: 24px;
    }
  }
`;

const Content = styled.div`
  width: calc(50% - 60px);
  padding: 24px 32px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #64748b;

  @media (max-width: 768px) {
    width: 100%;
    padding: 20px 24px;
  }
`;

const Position = styled.h3`
  font-family: 'Lora', Georgia, serif;
  font-size: 22px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 8px 0;
  line-height: 1.3;
`;

const Company = styled.div`
  font-size: 16px;
  color: #334155;
  font-weight: 500;
  margin-bottom: 8px;
`;

const DateText = styled.div`
  font-size: 13px;
  font-weight: 300;
  color: #64748b;
  margin-bottom: 16px;
  letter-spacing: 0.3px;
`;

const Summary = styled.p`
  margin: 12px 0;
  color: #475569;
  line-height: 1.7;
  font-size: 15px;
  font-weight: 300;
`;

const Highlights = styled.ul`
  margin: 12px 0 0 0;
  padding-left: 20px;
  list-style-type: disc;

  li {
    margin: 8px 0;
    color: #475569;
    line-height: 1.7;
    padding-left: 4px;
    font-weight: 300;
  }
`;

export function TimelineItem({ item, isLeft, type = 'work' }) {
  return (
    <Item $isLeft={isLeft}>
      <Content>
        <Position>
          {type === 'work' ? item.position : item.institution}
        </Position>
        {type === 'work' && item.name && <Company>{item.name}</Company>}
        {type === 'education' && (
          <Company>
            {item.studyType} in {item.area}
            {item.score && ` • ${item.score}`}
          </Company>
        )}
        <DateText>
          <DateRange startDate={item.startDate} endDate={item.endDate} />
        </DateText>
        {item.summary && <Summary>{item.summary}</Summary>}
        {item.highlights?.length > 0 && (
          <Highlights>
            {item.highlights.map((highlight, i) => (
              <li key={i}>{highlight}</li>
            ))}
          </Highlights>
        )}
      </Content>
    </Item>
  );
}
