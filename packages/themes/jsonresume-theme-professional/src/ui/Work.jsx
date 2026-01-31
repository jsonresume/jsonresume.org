import Section from './Section.jsx';
import Experience from './Experience.jsx';

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
