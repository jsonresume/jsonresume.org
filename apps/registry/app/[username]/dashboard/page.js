'use client';

import React from 'react';
import styled from 'styled-components';

// create a two column layout
const Container = styled.div`
  width: 400px;
  margin: auto;
`;

const Resumes = () => {
  return (
    <Container>
      <p>Coming soon...</p>
      <p>
        This will show meta information about the user. And a preview of their
        resume.
      </p>
      <p>For now use the tooling in the top menu</p>
    </Container>
  );
};

export default Resumes;
