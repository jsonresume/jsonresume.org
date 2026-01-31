import Section from './Section.jsx';
import Experience from './Experience.jsx';

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
