import styled from 'styled-components';

const Section = styled.div`
  max-width: 700px;
  margin: 0 auto 8px;

  h2 {
    font-size: 16px;

    margin: 0;
    padding: 0;
    margin-bottom: 3px;
    font-weight: 600;
  }

  @media (width <= 700px) {
    section {
      margin-bottom: 4px;
    }
  }

  hr {
    margin: 0;
    padding: 0;
  }

  p {
    margin: 0;
    padding: 0;
  }
`;

const Container = styled.div`
  margin-left: 8px;
`;

const SectionComponent = ({ children, title }) => {
  return (
    <Section>
      {title && (
        <>
          <h2>{title}</h2>
          <hr />
        </>
      )}
      <Container>{children}</Container>
    </Section>
  );
};

export default SectionComponent;
