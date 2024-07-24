'use client';

import React from 'react';
import styled from 'styled-components';
import { useProfileData } from '../ProfileContext';
import TimelineComponent from './Timeline';

const Container = styled.div`
  font-size: 1.4rem;
`;

const Timeline = () => {
  const { resume } = useProfileData();

  return (
    <Container>
      <TimelineComponent resume={resume} />
    </Container>
  );
};

export default Timeline;
