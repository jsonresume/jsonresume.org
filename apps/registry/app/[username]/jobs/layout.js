'use client';

import styled from 'styled-components';

const Container = styled.div`
  width: 800px;
  margin: auto;
  padding-top: 40px;
`;

export default function Home({ children }) {
  return <Container>{children}</Container>;
}
