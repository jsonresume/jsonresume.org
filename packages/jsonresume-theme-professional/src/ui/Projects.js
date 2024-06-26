import Section from './Section';
import Experience from './Experience';

const Work = ({ projects }) => {
  if (!projects) {
    return null;
  }

  return (
    <div>
      <Section title="Projects">
        {projects.map((w, key) => {
          return (
            <Experience
              title={w.name}
              startDate={w.startDate}
              endDate={w.endDate}
              summary={w.description}
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
