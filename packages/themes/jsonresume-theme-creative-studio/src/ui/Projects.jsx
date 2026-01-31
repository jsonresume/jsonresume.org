import styled from 'styled-components';
import Section from './Section.jsx';
import DateRange from './DateRange.jsx';

const ProjectItem = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ProjectName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
`;

const ProjectLink = styled.a`
  color: #ff6363;
  font-weight: 600;
  margin-left: 0.5rem;
  font-size: 0.95rem;
`;

const Description = styled.p`
  margin-top: 0.75rem;
  color: #555;
`;

const Keywords = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 0.75rem;
`;

const Keyword = styled.span`
  background: #ffe8e8;
  color: #ff6363;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 600;
`;

const Projects = ({ projects }) => {
  if (!projects || projects.length === 0) return null;

  return (
    <Section title="Projects">
      {projects.map((project, i) => (
        <ProjectItem key={i}>
          <ProjectName>
            {project.name}
            {project.url && (
              <ProjectLink
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Project →
              </ProjectLink>
            )}
          </ProjectName>
          <DateRange startDate={project.startDate} endDate={project.endDate} />
          {project.description && (
            <Description>{project.description}</Description>
          )}
          {project.keywords && project.keywords.length > 0 && (
            <Keywords>
              {project.keywords.map((keyword, j) => (
                <Keyword key={j}>{keyword}</Keyword>
              ))}
            </Keywords>
          )}
        </ProjectItem>
      ))}
    </Section>
  );
};

export default Projects;
