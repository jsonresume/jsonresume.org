import styled from 'styled-components';
import Section from './Section.jsx';

const ReferenceItem = styled.div`
  margin-bottom: 1.25rem;
`;

const Name = styled.h3`
  font-size: 1rem;
  color: #0b1f3a;
  margin-bottom: 0.25rem;
`;

const Reference = styled.div`
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
  font-style: italic;
`;

const References = ({ references }) => {
  if (!references || references.length === 0) return null;

  return (
    <Section title="References">
      {references.map((ref, i) => (
        <ReferenceItem key={i}>
          <Name>{ref.name}</Name>
          {ref.reference && <Reference>"{ref.reference}"</Reference>}
        </ReferenceItem>
      ))}
    </Section>
  );
};

export default References;
