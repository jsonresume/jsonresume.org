import { Card, CardHeader, CardContent } from './Card.jsx';
import Section from './Section.jsx';

const Publications = ({ publications }) => {
  if (!publications?.length) return null;
  return (
    <Section>
      <h2 className="text-xl font-bold">Publications</h2>
      {publications.map((p, index) => {
        return (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between gap-x-2 text-base">
                <h3 className="font-semibold leading-none">
                  <a className="hover:underline" href={p.url}>
                    {p.name}
                  </a>
                </h3>
                <div className="text-sm tabular-nums text-gray-500">
                  {p.releaseDate}
                </div>
              </div>
              {p.publisher && (
                <h4 className="font-mono text-sm leading-none">
                  {p.publisher}
                </h4>
              )}
            </CardHeader>
            {p.summary && (
              <CardContent className="mt-2 text-xs">{p.summary}</CardContent>
            )}
          </Card>
        );
      })}
    </Section>
  );
};

export default Publications;
