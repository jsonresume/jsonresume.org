import Section from './Section.jsx';
import Experience from './Experience.jsx';

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
