import { Badge, Card, Container, PageHeader, Section } from '@jsonresume/ui';
import type { Project, ProjectCategory } from '@repo/domain';
import { external } from '../links';
import * as s from './pages.css';

const categoryLabel: Record<ProjectCategory, string> = {
  integration: 'Integrations',
  framework: 'Libraries and frameworks',
  validator: 'Validators',
  hosting: 'Hosting',
  ai: 'AI',
  transfer: 'Import and export',
  github: 'GitHub',
  editor: 'Editors',
  cli: 'Command-line tools',
  visualization: 'Visualisation',
  generator: 'Generators',
  parser: 'Parsers',
  ats: 'Applicant tracking',
};

export interface ProjectsPageProps {
  projects: ReadonlyArray<Project>;
  categories: ReadonlyArray<ProjectCategory>;
}

/** The community directory, grouped by category, with jump links. */
export function ProjectsPage({ projects, categories }: ProjectsPageProps) {
  const groups = categories
    .map((category) => ({
      category,
      items: projects.filter((p) => p.category === category),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <PageHeader
        title="Projects"
        description={`${projects.length} tools, libraries and services the community has built on JSON Resume.`}
      />
      <Section spacing="lg">
        <Container>
          <nav aria-label="Categories">
            <ul className={s.categoryNav}>
              {groups.map(({ category, items }) => (
                <li key={category}>
                  <a className={s.categoryLink} href={`#${category}`}>
                    {categoryLabel[category]} ({items.length})
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {groups.map(({ category, items }) => (
            <section
              key={category}
              id={category}
              className={s.category}
              aria-labelledby={`${category}-title`}
            >
              <h2 id={`${category}-title`} className={s.categoryTitle}>
                {categoryLabel[category]}
              </h2>
              <ul className={s.projectGrid}>
                {items.map((project) => (
                  <li key={project.link + project.name}>
                    <Card asChild interactive>
                      <a className={s.projectLink} href={project.link}>
                        <span className={s.projectName}>{project.name}</span>
                        <span className={s.projectText}>
                          {project.description}
                        </span>
                        {project.language !== 'N/A' ? (
                          <span>
                            <Badge>{project.language}</Badge>
                          </span>
                        ) : null}
                      </a>
                    </Card>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <p>
            Built something?{' '}
            <a href={external.contributing}>Add it to this list</a>.
          </p>
        </Container>
      </Section>
    </>
  );
}
