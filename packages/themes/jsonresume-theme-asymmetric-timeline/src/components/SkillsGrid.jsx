import React from 'react';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const Category = styled.div`
  padding: 20px;
  background: #f8fafc;
  border-radius: 6px;
  border-left: 3px solid #334155;
`;

const Name = styled.h4`
  font-size: 16px;
  font-weight: 500;
  color: #0f172a;
  margin: 0 0 10px 0;
`;

const Tags = styled.div`
  font-size: 14px;
  font-weight: 300;
  color: #64748b;
  line-height: 1.6;
`;

export function SkillsGrid({ items, type = 'skills' }) {
  return (
    <Grid>
      {items.map((item, index) => (
        <Category key={index}>
          <Name>
            {type === 'skills' && item.name}
            {type === 'languages' && item.language}
            {type === 'interests' && item.name}
          </Name>
          {type === 'skills' && item.keywords?.length > 0 && (
            <Tags>{item.keywords.join(', ')}</Tags>
          )}
          {type === 'languages' && item.fluency && <Tags>{item.fluency}</Tags>}
          {type === 'interests' && item.keywords?.length > 0 && (
            <Tags>{item.keywords.join(', ')}</Tags>
          )}
        </Category>
      ))}
    </Grid>
  );
}
