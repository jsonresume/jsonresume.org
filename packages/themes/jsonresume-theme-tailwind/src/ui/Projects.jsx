import Section from './Section.jsx';
import ProjectCard from './ProjectCard.jsx';

const Projects = ({ projects }) => {
  if (!projects?.length) return null;
  return (
    <Section className="print-force-new-page scroll-mb-16">
      <h2 className="text-xl font-bold">Projects</h2>
      <div className="-mx-3 grid grid-cols-1 gap-3 print:grid-cols-3 print:gap-2 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project, index) => {
          return (
            <ProjectCard
              key={project.name ?? project.title ?? index}
              title={project.name ?? project.title}
              description={project.description}
              tags={project.keywords ?? project.techStack}
              link={project.url ?? project.link?.href}
            />
          );
        })}
      </div>
    </Section>
  );
};

export default Projects;
