'use client';

import React from 'react';
import styled from 'styled-components';
import { useResume } from '../../providers/ResumeProvider';
import { Editor } from '@monaco-editor/react';

const Container = styled.div`
  font-size: 1.4rem;
`;

const JsonView = () => {
  const { resume, loading, error } = useResume();

  if (loading) {
    return <Container>Loading JSON view...</Container>;
  }

  if (error) {
    return <Container>Error loading resume: {error}</Container>;
  }

  if (!resume) {
    return <Container>No resume found</Container>;
  }

  return (
    <Container>
      <Editor
        height="70vh"
        defaultLanguage="json"
        defaultValue={JSON.stringify(resume, null, 2)}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
        }}
      />
    </Container>
  );
};

export default JsonView;
