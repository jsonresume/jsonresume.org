import Section from './Section.jsx';
import { Badge } from './Badge.jsx';

const Skills = ({ skills }) => {
  return (
    <Section>
      <h2 className="text-xl font-bold">Skills</h2>
      <div className="flex flex-wrap gap-1">
        {skills.map((skill) => {
          return <Badge key={skill.name}>{skill.name}</Badge>;
        })}
      </div>
    </Section>
  );
};

export default Skills;
