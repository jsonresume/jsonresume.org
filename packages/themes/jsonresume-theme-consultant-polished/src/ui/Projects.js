import styled from 'styled-components';
import Section from './Section';
import { marked } from 'marked';

const ProjectItem = styled.div`
  margin-bottom: 1.75rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ProjectName = styled.h3`
  font-size: 1.0625rem;
  color: #0b1f3a;
  margin: 0;
`;

const DateRange = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const Entity = styled.div`
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 0.5rem;
`;

const Description = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: #444;
  margin-bottom: 0.5rem;

  p {
    margin-bottom: 0.5rem;
  }
`;

const Highlights = styled.ul`
  margin-top: 0.5rem;
  padding-left: 1.5rem;
  list-style: disc;

  li {
    margin-bottom: 0.4rem;
    line-height: 1.6;
    color: #444;
  }
`;

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const Projects = ({ projects }) => {
  if (!projects || projects.length === 0) return null;

  return (
    <Section title="Projects">
      {projects.map((project, i) => (
        <ProjectItem key={i}>
          <Header>
            <ProjectName>
              {project.url ? (
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  {project.name}
                </a>
              ) : (
                project.name
              )}
            </ProjectName>
            {(project.startDate || project.endDate) && (
              <DateRange>
                {formatDate(project.startDate)}
                {project.endDate && ` - ${formatDate(project.endDate)}`}
              </DateRange>
            )}
          </Header>
          {project.entity && <Entity>{project.entity}</Entity>}
          {project.description && (
            <Description
              dangerouslySetInnerHTML={{ __html: marked(project.description) }}
            />
          )}
          {project.highlights && project.highlights.length > 0 && (
            <Highlights>
              {project.highlights.map((highlight, j) => (
                <li key={j}>{highlight}</li>
              ))}
            </Highlights>
          )}
        </ProjectItem>
      ))}
    </Section>
  );
};

export default Projects;
