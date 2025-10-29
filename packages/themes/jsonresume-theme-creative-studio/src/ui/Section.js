import styled from 'styled-components';

const SectionContainer = styled.section`
  background: #fff5f5;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #ff6363;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #ff6363;
`;

const Section = ({ title, children }) => {
  if (!children) return null;

  return (
    <SectionContainer>
      <SectionTitle>{title}</SectionTitle>
      {children}
    </SectionContainer>
  );
};

export default Section;
