import Section from './Section';
import Experience from './Experience';

const Awards = ({ awards }) => {
  if (!awards) {
    return null;
  }

  return (
    <div>
      <Section title="Awards">
        {awards.map((a, key) => {
          return (
            <Experience
              title={a.title}
              subTitle={a.awarder}
              date={a.date}
              summary={a.summary}
              key={key}
            />
          );
        })}
      </Section>
    </div>
  );
};

export default Awards;
