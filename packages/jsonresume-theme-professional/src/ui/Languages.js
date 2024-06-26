import OneLineList from './OneLineList';

import Section from './Section';

const Languages = ({ languages }) => {
  if (!languages) {
    return null;
  }

  return (
    <div>
      <Section title="Languages">
        {languages.map((l, key) => {
          return (
            <OneLineList key={key} name={l.language} items={[l.fluency]} />
          );
        })}
      </Section>
    </div>
  );
};

export default Languages;
