'use client';

import React from 'react';
import styled from 'styled-components';
import { useProfileData } from '../ProfileContext';

const Container = styled.div`
  font-size: 1.4rem;
`;

function calculateYears(startDate, endDate) {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const years = (end - start) / (1000 * 60 * 60 * 24 * 365.25);
  return years;
}

function totalYears(entries) {
  return entries.reduce((total, entry) => {
    return total + calculateYears(entry.startDate, entry.endDate);
  }, 0);
}

const Resumes = () => {
  const { resume } = useProfileData();

  const totalWorkYears = totalYears(resume.work);
  const totalEducationYears = totalYears(resume.education);
  const totalYearsOverall = totalWorkYears + totalEducationYears;

  return (
    <Container>
      <p>{resume.basics.summary}</p>
      <p>
        {resume.basics.location.city}, {resume.basics.location.region}
      </p>
      <p>
        <strong>Work Experience:</strong> {totalWorkYears.toFixed(1)} years
      </p>
      <p>
        <strong>Education:</strong> {totalEducationYears.toFixed(1)} years
      </p>
      <p>
        <strong>Total:</strong> {totalYearsOverall.toFixed(1)} years
      </p>
    </Container>
  );
};

export default Resumes;
