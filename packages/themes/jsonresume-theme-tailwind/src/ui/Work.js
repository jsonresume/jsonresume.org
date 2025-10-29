import { Card, CardHeader, CardContent } from './Card';
import Section from './Section';

const Work = ({ work }) => {
  return (
    <Section>
      <h2 className="text-xl font-bold">Work Experience</h2>
      {work.map((w, index) => {
        return (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between gap-x-2 text-base">
                <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold leading-none">
                  <a className="hover:underline" href={w.url}>
                    {w.name}
                  </a>

                  {/* <span className="inline-flex gap-x-1">
                    {w?.badges?.map((badge) => (
                      <Badge
                        variant="secondary"
                        className="align-middle text-xs"
                        key={badge}
                      >
                        {badge}
                      </Badge>
                    ))}
                  </span> */}
                </h3>
                <div className="text-sm tabular-nums text-gray-500">
                  {w.startDate} - {w.endDate ?? 'Present'}
                </div>
              </div>

              <h4 className="font-mono text-sm leading-none">{w.title}</h4>
            </CardHeader>
            <CardContent className="mt-2 text-xs">
              {w.summary}
              <br />
              <br />
              <ul>
                {w.highlights?.map((h, index) => {
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

export default Work;
