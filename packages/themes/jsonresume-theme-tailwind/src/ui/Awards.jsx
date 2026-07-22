import { Card, CardHeader, CardContent } from './Card.jsx';
import Section from './Section.jsx';

const Awards = ({ awards }) => {
  if (!awards?.length) return null;
  return (
    <Section>
      <h2 className="text-xl font-bold">Awards</h2>
      {awards.map((a, index) => {
        return (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between gap-x-2 text-base">
                <h3 className="font-semibold leading-none">{a.title}</h3>
                <div className="text-sm tabular-nums text-gray-500">
                  {a.date}
                </div>
              </div>
              {a.awarder && (
                <h4 className="font-mono text-sm leading-none">{a.awarder}</h4>
              )}
            </CardHeader>
            {a.summary && (
              <CardContent className="mt-2 text-xs">{a.summary}</CardContent>
            )}
          </Card>
        );
      })}
    </Section>
  );
};

export default Awards;
