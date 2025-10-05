import { ProjectCard } from './ProjectCard';

interface Project {
  name: string;
  description: string;
  link: string;
  category: string;
  language: string;
}

interface ProjectsSectionProps {
  category: string;
  projects: Project[];
}

export function ProjectsSection({ category, projects }: ProjectsSectionProps) {
  const categoryProjects = projects.filter(
    (project) => project.category === category
  );

  if (categoryProjects.length === 0) {
    return null;
  }

  return (
    <div>
      <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
      <ul>
        {categoryProjects.map((project) => (
          <ProjectCard
            key={project.link}
            name={project.name}
            description={project.description}
            link={project.link}
            language={project.language}
          />
        ))}
      </ul>
    </div>
  );
}
