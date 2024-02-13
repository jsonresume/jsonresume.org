import styled from 'styled-components';

const Hero = styled.div`
  margin-bottom: 40px;
  color: #555;
  text-align: center;
  font-family: Lato;
  font-size: 22px;
`;

export default function Component({ children }) {
  return (
    <>
      <Hero>{children}</Hero>
    </>
  );
}
