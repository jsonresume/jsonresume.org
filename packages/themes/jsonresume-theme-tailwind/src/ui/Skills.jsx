import Section from './Section.jsx';
import { Badge } from './Badge.jsx';

const Skills = ({ skills }) => {
  if (!skills?.length) return null;
  return (
    <Section>
      <h2 className="text-xl font-bold">Skills</h2>
      <div className="flex flex-col gap-2">
        {skills.map((skill) => (
          <div key={skill.name} className="flex flex-wrap gap-1 items-center">
            <span className="font-semibold mr-1">
              {skill.name}
              {skill.keywords?.length ? ':' : ''}
            </span>
            {(skill.keywords || []).map((keyword) => (
              <Badge key={keyword}>{keyword}</Badge>
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Skills;
