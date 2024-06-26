import styled from 'styled-components';
import Section from './Section';

const Summary = styled.p``;

const SummaryComponent = ({ basics }) => {
  const { summary } = basics;
  return (
    <Section>
      <div className="secondary">
        <Summary>{summary}</Summary>
      </div>
    </Section>
  );
};

export default SummaryComponent;
