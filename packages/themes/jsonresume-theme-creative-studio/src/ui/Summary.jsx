import styled from 'styled-components';
import Section from './Section.jsx';

const SummaryText = styled.p`
  font-size: 1.1rem;
  line-height: 1.9;
  color: #555;
`;

const Summary = ({ basics }) => {
  if (!basics?.summary) return null;

  return (
    <Section title="About">
      <SummaryText>{basics.summary}</SummaryText>
    </Section>
  );
};

export default Summary;
