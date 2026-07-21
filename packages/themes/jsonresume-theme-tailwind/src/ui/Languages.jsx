import Section from './Section.jsx';
import { Badge } from './Badge.jsx';

const Languages = ({ languages }) => {
  if (!languages?.length) return null;
  return (
    <Section>
      <h2 className="text-xl font-bold">Languages</h2>
      <div className="flex flex-wrap gap-1">
        {languages.map((l, index) => (
          <Badge key={index}>
            {l.language}
            {l.fluency ? ` — ${l.fluency}` : ''}
          </Badge>
        ))}
      </div>
    </Section>
  );
};

export default Languages;
