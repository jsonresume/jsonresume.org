import OneLineList from './OneLineList';
import Section from './Section';

const Interests = ({ interests }) => {
  // check if interests is null, empty, empty string or empty array

  if (!interests) {
    return null;
  }

  return (
    <div>
      <Section title="Interests">
        {interests.map((w, key) => {
          return <OneLineList key={key} name={w.name} items={w.keywords} />;
        })}
      </Section>
    </div>
  );
};

export default Interests;
