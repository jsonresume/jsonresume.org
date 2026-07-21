import Section from './Section.jsx';
import { Badge } from './Badge.jsx';

const Interests = ({ interests }) => {
  if (!interests?.length) return null;
  return (
    <Section>
      <h2 className="text-xl font-bold">Interests</h2>
      <div className="flex flex-col gap-2">
        {interests.map((interest, index) => (
          <div key={index} className="flex flex-wrap gap-1 items-center">
            <span className="font-semibold mr-1">{interest.name}</span>
            {(interest.keywords || []).map((keyword) => (
              <Badge key={keyword}>{keyword}</Badge>
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Interests;
