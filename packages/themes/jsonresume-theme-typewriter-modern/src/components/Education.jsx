import React from 'react';
import styled from 'styled-components';
import { DateRange } from '@resume/core';

const EducationItem = styled.div`
  margin-bottom: 24px;
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

const Institution = styled.h3`
  font-family: 'Work Sans', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 6px 0;
`;

const Degree = styled.div`
  font-size: 14px;
  color: #555555;
  margin-bottom: 4px;
  font-family: 'Courier Prime', monospace;
`;

export function Education({ education = [] }) {
  if (!education?.length) return null;

  return (
    <>
      {education.map((edu, index) => (
        <EducationItem key={index}>
          <DateText>
            <DateRange startDate={edu.startDate} endDate={edu.endDate} />
          </DateText>
          <Institution>{edu.institution}</Institution>
          <Degree>
            {edu.studyType} in {edu.area}
            {edu.score && ` • ${edu.score}`}
          </Degree>
        </EducationItem>
      ))}
    </>
  );
}
