'use client';

import React from 'react';
import Editor from '@monaco-editor/react';
import styled from 'styled-components';
import { useProfileData } from '../ProfileContext';

const Container = styled.div`
  font-size: 1.4rem;
`;

const Resumes = () => {
  const { resume } = useProfileData();

  return (
    <Container>
      <Editor
        height="90vh"
        width="100%"
        defaultLanguage="json"
        readOnly
        defaultValue={JSON.stringify(resume, undefined, 2)}
        options={{ wordWrap: 'on' }}
        value={JSON.stringify(resume, undefined, 2)}
        onChange={() => {}}
      />
    </Container>
  );
};

export default Resumes;
