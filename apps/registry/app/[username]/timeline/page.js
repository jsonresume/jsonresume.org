'use client';

import React, { use } from 'react';
import styled from 'styled-components';
import { usePublicResume } from '../../providers/PublicResumeProvider';
import { PublicViewBanner } from '../../components/PublicViewBanner';
import TimelineComponent from './Timeline';

const Container = styled.div`
  font-size: 1.4rem;
`;

const Timeline = ({ params }) => {
  const { username } = use(params);
  const { resume, loading, error } = usePublicResume();

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
    <>
      <PublicViewBanner username={username} />
      <Container>
        <TimelineComponent resume={resume} />
      </Container>
    </>
  );
};

export default Timeline;
