'use client';

import React from 'react';
import styled from 'styled-components';
import { useResume } from '../../providers/ResumeProvider';
import ResumeDashboard from './Dashboard';

const Container = styled.div`
  font-size: 1.4rem;
`;

const Resumes = () => {
  const { resume, loading, error } = useResume();

  if (loading) {
    return <Container>Loading...</Container>;
  }

  if (error) {
    return <Container>Error: {error}</Container>;
  }

  return (
    <Container>
      <ResumeDashboard resume={resume} />
    </Container>
  );
};

export default Resumes;
