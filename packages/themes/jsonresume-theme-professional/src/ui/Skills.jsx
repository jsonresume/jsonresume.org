import OneLineList from './OneLineList.jsx';

import Section from './Section.jsx';

const Skills = ({ skills }) => {
  if (!skills) {
    return null;
  }

  return (
    <div>
      <Section title="Skills">
        {skills.map((w, key) => {
          return <OneLineList key={key} name={w.name} items={w.keywords} />;
        })}
      </Section>
    </div>
  );
};

export default Skills;
