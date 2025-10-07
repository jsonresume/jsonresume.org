import { PROJECTS, CATEGORIES } from './data/projectsData';
import { ProjectsSection } from './components/ProjectsSection';

export const metadata = {
  title: 'Projects — JSON Resume',
  description: 'Community projects built around JSON Resume',
  image: 'https://jsonresume.org/images/logo.png',
  url: 'https://jsonresume.org/projects/',
};

export default function Projects() {
  return (
    <div>
      <header id="header">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <h1>Community Projects</h1>
            </div>
          </div>
        </div>
      </header>
      <div id="team" className="container">
        <div className="row">
          <div className="col-sm-12 contributing">
            <p>
              JSON Resume was built to inspire a new creative movement around
              resumes. Please submit new projects to the{' '}
              <a href="https://github.com/jsonresume/jsonresume.org">repo</a>
            </p>

            {CATEGORIES.map((category) => (
              <ProjectsSection
                key={category}
                category={category}
                projects={PROJECTS}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
