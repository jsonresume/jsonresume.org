import { Card, CardHeader, CardContent } from './Card.jsx';
import Section from './Section.jsx';

const References = ({ references }) => {
  if (!references?.length) return null;
  return (
    <Section>
      <h2 className="text-xl font-bold">References</h2>
      {references.map((r, index) => {
        return (
          <Card key={index}>
            <CardHeader>
              <h3 className="font-semibold leading-none">{r.name}</h3>
            </CardHeader>
            {r.reference && (
              <CardContent className="mt-2 text-xs italic">
                &ldquo;{r.reference}&rdquo;
              </CardContent>
            )}
          </Card>
        );
      })}
    </Section>
  );
};

export default References;
