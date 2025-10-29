import Section from './Section';
import { Badge } from './Badge';

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
