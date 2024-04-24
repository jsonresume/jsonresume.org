import { FaBeer as GitHub } from 'react-icons/fa';
import Section from './Section';

const Projects = ({ projects }) => {
  if (!projects) {
    return null;
  }

  return (
    <Section title="Projects">
      <ul class="projects">
        {projects.map(
          ({ url, description, highlights, name, isActive, github }) => {
            return (
              <li>
                <article>
                  <header>
                    <h3>
                      <a
                        href={url}
                        target="_blank"
                        title={`Ver el proyecto ${name}`}
                      >
                        {name}
                      </a>
                      {isActive && <span>•</span>}
                      {github && (
                        <a
                          class="github-code-link"
                          href={github}
                          target="_blank"
                          title={`Ver código fuente del proyecto ${name}`}
                        >
                          <GitHub />
                        </a>
                      )}
                    </h3>
                    <p>{description}</p>
                  </header>
                  <footer>
                    {highlights.map((highlight) => {
                      return <span>{highlight}</span>;
                    })}
                  </footer>
                </article>
              </li>
            );
          }
        )}
      </ul>
    </Section>
  );
};

export default Projects;
