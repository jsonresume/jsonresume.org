import Section from './Section';

const SummaryComponent = ({ basics }) => {
  const { summary } = basics;
  return (
    <Section title="About me">
      <p>{summary}</p>
    </Section>
  );
};

export default SummaryComponent;
