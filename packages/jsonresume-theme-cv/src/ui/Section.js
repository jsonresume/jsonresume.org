import styled from 'styled-components';

const Section = styled.div`
  max-width: 700px;
  margin: 0 auto 48px;

  &h2 {
    margin-bottom: 8px;
    font-weight: 700;
    line-height: 1.5;
    font-size: 1.5rem;
  }

  @media (width <= 700px) {
    section {
      margin-bottom: 38px;
    }
  }
`;

const SectionComponent = ({ children, title }) => {
  return (
    <Section>
      {title && <h2>{title}</h2>}
      {children}
    </Section>
  );
};

export default SectionComponent;
