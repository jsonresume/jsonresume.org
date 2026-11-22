import styled from 'styled-components';
import Section from './Section.jsx';

import { InlineMarkdown } from '@jsonresume/core';
const SummaryText = styled.p`
  font-size: 1.1rem;
  line-height: 1.9;
  color: #555;
`;

const Summary = ({ basics }) => {
  if (!basics?.summary) return null;

  return (
    <Section title="About">
      <InlineMarkdown as={SummaryText} text={basics.summary} />
    </Section>
  );
};

export default Summary;
