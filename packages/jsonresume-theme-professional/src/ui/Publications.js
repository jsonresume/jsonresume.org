import Section from './Section';
import Experience from './Experience';

const Publications = ({ publications }) => {
  if (!publications) {
    return null;
  }

  return (
    <div>
      <Section title="Publications">
        {publications.map((p, key) => {
          return (
            <Experience
              title={p.name}
              subTitle={p.publisher}
              date={p.releaseDate}
              summary={p.summary}
              key={key}
            />
          );
        })}
      </Section>
    </div>
  );
};

export default Publications;
