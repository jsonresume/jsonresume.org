import { Card, CardHeader, CardContent } from './Card.jsx';
import Section from './Section.jsx';

const Volunteer = ({ volunteer }) => {
  if (!volunteer?.length) return null;
  return (
    <Section>
      <h2 className="text-xl font-bold">Volunteer</h2>
      {volunteer.map((v, index) => {
        return (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between gap-x-2 text-base">
                <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold leading-none">
                  {v.url ? (
                    <a className="hover:underline" href={v.url}>
                      {v.organization}
                    </a>
                  ) : (
                    v.organization
                  )}
                </h3>
                {(v.startDate || v.endDate) && (
                  <div className="text-sm tabular-nums text-gray-500">
                    {v.startDate} - {v.endDate ?? 'Present'}
                  </div>
                )}
              </div>
              <h4 className="font-mono text-sm leading-none">{v.position}</h4>
            </CardHeader>
            <CardContent className="mt-2 text-xs">
              {v.summary}
              <ul>
                {v.highlights?.map((h, index) => {
                  return <li key={index}>- {h}</li>;
                })}
              </ul>
            </CardContent>
          </Card>
        );
      })}
    </Section>
  );
};

export default Volunteer;
