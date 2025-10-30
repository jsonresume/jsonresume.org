import React from 'react';
import styled from 'styled-components';
import { DateRange } from '@resume/core';

const WorkItem = styled.div`
  margin-bottom: 32px;
  position: relative;
  padding-left: 120px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 640px) {
    padding-left: 0;
  }
`;

const DateText = styled.div`
  position: absolute;
  left: 0;
  top: 2px;
  font-size: 13px;
  color: #666666;
  font-weight: 400;
  width: 100px;
  text-align: left;
  font-family: 'Courier Prime', monospace;

  @media (max-width: 640px) {
    position: static;
    margin-bottom: 8px;
  }
`;

const Position = styled.h3`
  font-family: 'Work Sans', sans-serif;
  font-size: 17px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 6px 0;
`;

const Company = styled.div`
  font-size: 15px;
  color: #555555;
  font-weight: 400;
  margin-bottom: 8px;
  font-family: 'Courier Prime', monospace;
`;

const WorkSummary = styled.p`
  margin: 12px 0;
  color: #444444;
  line-height: 1.8;
  font-size: 14px;
  font-family: 'Courier Prime', monospace;
`;

const Highlights = styled.ul`
  margin: 12px 0 0 0;
  padding-left: 20px;
  list-style-type: square;

  li {
    margin: 8px 0;
    color: #444444;
    line-height: 1.8;
    padding-left: 4px;
    font-family: 'Courier Prime', monospace;
    font-size: 14px;
  }
`;

export function WorkExperience({ work = [] }) {
  if (!work?.length) return null;

  return (
    <>
      {work.map((job, index) => (
        <WorkItem key={index}>
          <DateText>
            <DateRange startDate={job.startDate} endDate={job.endDate} />
          </DateText>
          <Position>{job.position}</Position>
          {job.name && <Company>{job.name}</Company>}
          {job.summary && <WorkSummary>{job.summary}</WorkSummary>}
          {job.highlights?.length > 0 && (
            <Highlights>
              {job.highlights.map((highlight, i) => (
                <li key={i}>{highlight}</li>
              ))}
            </Highlights>
          )}
        </WorkItem>
      ))}
    </>
  );
}
