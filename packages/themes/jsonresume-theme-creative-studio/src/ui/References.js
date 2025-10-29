import styled from 'styled-components';
import Section from './Section';

const ReferenceItem = styled.div`
  margin-bottom: 1.5rem;
  background: #ffe8e8;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #ff6363;

  &:last-child {
    margin-bottom: 0;
  }
`;

const RefName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Quote = styled.p`
  color: #555;
  font-style: italic;
  line-height: 1.9;
`;

const References = ({ references }) => {
  if (!references || references.length === 0) return null;

  return (
    <Section title="References">
      {references.map((ref, i) => (
        <ReferenceItem key={i}>
          <RefName>{ref.name}</RefName>
          {ref.reference && <Quote>"{ref.reference}"</Quote>}
        </ReferenceItem>
      ))}
    </Section>
  );
};

export default References;
