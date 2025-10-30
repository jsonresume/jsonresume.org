import React from 'react';
import styled from 'styled-components';
import { DateRange } from '@resume/core';

const Item = styled.div`
  margin-bottom: 28px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 6px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Title = styled.h3`
  font-family: 'Lora', Georgia, serif;
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.div`
  font-size: 15px;
  color: #475569;
  margin-bottom: 6px;
`;

const DateText = styled.div`
  font-size: 13px;
  font-weight: 300;
  color: #64748b;
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

export function SimpleItem({ item, type }) {
  return (
    <Item>
      <Title>
        {type === 'project' && item.name}
        {type === 'volunteer' && item.position}
        {type === 'award' && item.title}
        {type === 'publication' && item.name}
        {type === 'reference' && item.name}
      </Title>
      {type === 'volunteer' && item.organization && (
        <Subtitle>{item.organization}</Subtitle>
      )}
      {type === 'award' && item.awarder && (
        <Subtitle>Awarded by {item.awarder}</Subtitle>
      )}
      {type === 'publication' && item.publisher && (
        <Subtitle>Published by {item.publisher}</Subtitle>
      )}
      {type === 'volunteer' && (item.startDate || item.endDate) && (
        <DateText>
          <DateRange startDate={item.startDate} endDate={item.endDate} />
        </DateText>
      )}
      {type === 'award' && item.date && <DateText>{item.date}</DateText>}
      {type === 'publication' && item.releaseDate && (
        <DateText>{item.releaseDate}</DateText>
      )}
      {item.summary && <Summary>{item.summary}</Summary>}
      {item.description && <Summary>{item.description}</Summary>}
      {item.reference && <Summary>{item.reference}</Summary>}
      {item.highlights?.length > 0 && (
        <Highlights>
          {item.highlights.map((highlight, i) => (
            <li key={i}>{highlight}</li>
          ))}
        </Highlights>
      )}
    </Item>
  );
}
