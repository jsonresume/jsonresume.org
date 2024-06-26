import styled from 'styled-components';
import Section from './Section';

const Summary = styled.p``;

const SummaryComponent = ({ basics }) => {
  const { summary } = basics;
  return (
    <Section>
      <Summary>{summary}</Summary>
    </Section>
  );
};

export default SummaryComponent;
