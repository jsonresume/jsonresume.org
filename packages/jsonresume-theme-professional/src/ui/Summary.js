import styled from 'styled-components';
import Section from './Section';

const Summary = styled.p`
  font-size: 13px;
  line-height: 16px;
`;

const SummaryComponent = ({ basics }) => {
  const { summary } = basics;
  return (
    <Section>
      <Summary>{summary}</Summary>
    </Section>
  );
};

export default SummaryComponent;
