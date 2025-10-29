import Section from './Section';
import Experience from './Experience';

const Work = ({ work }) => {
  if (!work) {
    return null;
  }

  return (
    <div>
      <Section title="Experience">
        {work.map((w, key) => {
          return (
            <Experience
              title={w.position}
              subTitle={w.name}
              startDate={w.startDate}
              endDate={w.endDate}
              summary={w.summary}
              highlights={w.highlights}
              key={key}
            />
          );
        })}
      </Section>
    </div>
  );
};

export default Work;
