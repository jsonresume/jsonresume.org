'use client';

import React from 'react';
import styled from 'styled-components';
import { useResume } from '../../providers/ResumeProvider';
import TimelineComponent from './Timeline';

const Container = styled.div`
  font-size: 1.4rem;
`;

const Timeline = () => {
  const { resume, loading, error } = useResume();

  if (loading) {
    return <Container>Loading timeline...</Container>;
  }

  if (error) {
    return <Container>Error loading timeline: {error}</Container>;
  }

  if (!resume) {
    return <Container>No resume found</Container>;
  }

  return (
    <Container>
      <TimelineComponent resume={resume} />
    </Container>
  );
};

export default Timeline;
