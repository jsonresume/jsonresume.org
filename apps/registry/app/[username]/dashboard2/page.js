'use client';

import React from 'react';
import styled from 'styled-components';
import { useProfileData } from '../ProfileContext';
import ResumeDashboard from './Dashboard';

const Container = styled.div`
  font-size: 1.4rem;
`;

const Resumes = () => {
  const { resume } = useProfileData();

  return (
    <Container>
      <ResumeDashboard resume={resume} />
    </Container>
  );
};

export default Resumes;
