import Section from './Section';
import Experience from './Experience';

const Certificates = ({ certificates }) => {
  if (!certificates) {
    return null;
  }

  return (
    <div>
      <Section title="Certificates">
        {certificates.map((c, key) => {
          return (
            <Experience
              title={c.name}
              subTitle={c.issuer}
              date={c.date}
              key={key}
            />
          );
        })}
      </Section>
    </div>
  );
};

export default Certificates;
