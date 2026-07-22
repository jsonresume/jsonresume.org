import { Card, CardHeader } from './Card.jsx';
import Section from './Section.jsx';

const Certificates = ({ certificates }) => {
  if (!certificates?.length) return null;
  return (
    <Section>
      <h2 className="text-xl font-bold">Certificates</h2>
      {certificates.map((c, index) => {
        return (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between gap-x-2 text-base">
                <h3 className="font-semibold leading-none">
                  <a className="hover:underline" href={c.url}>
                    {c.name}
                  </a>
                </h3>
                <div className="text-sm tabular-nums text-gray-500">
                  {c.date}
                </div>
              </div>
              {c.issuer && (
                <h4 className="font-mono text-sm leading-none">{c.issuer}</h4>
              )}
            </CardHeader>
          </Card>
        );
      })}
    </Section>
  );
};

export default Certificates;
