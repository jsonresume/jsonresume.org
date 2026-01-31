import Section from './Section.jsx';
import { Card, CardHeader, CardContent } from './Card.jsx';

const Education = ({ education }) => {
  return (
    <Section>
      <h2 className="text-xl font-bold">Education</h2>
      {education.map((e) => {
        return (
          <Card key={e.institution}>
            <CardHeader>
              <div className="flex items-center justify-between gap-x-2 text-base">
                <h3 className="font-semibold leading-none">{e.institution}</h3>
                <div className="text-sm tabular-nums text-gray-500">
                  {e.startDate} - {e.endDate}
                </div>
              </div>
            </CardHeader>
            <CardContent className="mt-2">{e.area}</CardContent>
          </Card>
        );
      })}
    </Section>
  );
};

export default Education;
