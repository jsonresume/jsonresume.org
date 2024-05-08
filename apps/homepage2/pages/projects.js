export default function GettingStarted() {
  const projects = [
    {
      name: 'JSON Resume Validator (PHP)',
      description:
        'Tool in PHP that validates if a Resume is according to the defined schema. It also validates if any desired properties are not empty.',
      link: 'https://github.com/lfbn/json-resume-validator',
      category: 'validator',
    },
    {
      name: 'JSON Resume Validator (Python)',
      description:
        'Python tool to validate JSON resumes to ensure that they are according to the defined schema',
      link: 'https://github.com/kelvintaywl/jsonresume-validator',
      category: 'validator',
    },
    {
      name: 'JSON Resume Validator and Parser (Java)',
      description:
        'Java library to validate and parse JSON resumes to Java objects',
      link: 'https://github.com/eaxdev/Java-JsonResume-Validator',
      category: 'validator',
    },
    {
      name: 'JSON Resume Validator (Go)',
      description: 'Go library to validate JSON resumes',
      link: 'https://github.com/cinarmert/json-resume-validator',
      category: 'validator',
    },
    {
      name: 'LinkedIn Profile to JSON Resume Browser Tool',
      description:
        'An extremely easy-to-use browser extension for exporting your full LinkedIn Profile to a JSON Resume file or string.',
      link: 'https://github.com/joshuatz/linkedin-to-jsonresume',
      category: 'transfer',
    },
    {
      name: 'LinkedIn to JSON Résumé conversion',
      description:
        'Inspired by https://github.com/mblarsen/resume-linkedin, deprecated primarily due to these changes in the LinkedIn API.',
      link: 'https://github.com/w0rd-driven/jsonresume-linkedin',
      category: 'transfer',
    },
    {
      name: 'SkillSet',
      description:
        'Intuitive job-candidate skill visualization, taking advantage of D3.js and JSONResume.',
      link: 'https://github.com/Jac21/SkillSet',
      category: 'visualization',
    },
    {
      name: 'gulp-resume',
      description:
        'gulp-resume is a gulp plugin to generate a resume using jsonresume.org.',
      link: 'https://github.com/mattberther/gulp-resume',
      category: 'generator',
    },
    {
      name: 'ng-jsonresume',
      description:
        'ng-jsonresume lets you include a resume into a webpage by using an Angular directive and providing data in the standardized jsonresume format.',
      link: 'https://github.com/marko-knoebl/ng-jsonresume',
      category: 'framework',
    },
    {
      name: 'jsonresume (haskell)',
      description:
        'This library encodes JSON Resume standard in Haskell datatypes, and provides a parser to read a CV in the JSON Resume format.',
      link: 'https://hackage.haskell.org/package/jsonresume',
      category: 'parser',
    },
    {
      name: 'hugo-mod-json-resume',
      description:
        'A Hugo module containing templates to integrate multilingual JSON Resume data into your Hugo website.',
      link: 'https://github.com/schnerring/hugo-mod-json-resume',
      category: 'framework',
    },
    {
      name: 'hugo-theme-gruvbox',
      description:
        'A retro-looking Hugo theme inspired by gruvbox to build secure, fast, and SEO-ready websites.',
      link: 'https://github.com/schnerring/hugo-theme-gruvbox',
      category: 'framework',
    },
    {
      name: 'gatsby-portfolio',
      description:
        'The whole portfolio is a React-based single page app built with Gatsby v3.',
      link: 'https://github.com/kremalicious/portfolio',
      category: 'framework',
    },
    {
      name: 'jsonresume-manager',
      description: "A Laravel framework to manage your JSON Resume's",
      link: 'https://github.com/antoniosarosi/jsonresume-manager',
      category: 'framework',
    },
    {
      name: 'react-ultimate-resume',
      description:
        'react-ultimate-resume is an open-source customizable software developer resume to highlight your skills and experiences.',
      link: 'https://github.com/welovedevs/react-ultimate-resume',
      category: 'framework',
    },
    {
      name: 'customized-registry-functions',
      description:
        'This is a slightly tweaked version of the JSON Registry. That project is using their own Firebase project and a specific JSON schema.',
      link: 'https://github.com/anthonyjdella/customized-registry-functions',
      category: 'hosting',
    },
    {
      name: 'registry-functions',
      description:
        'This repository is responsible for our free JSON Resume community hosting.',
      link: 'https://github.com/jsonresume/registry-functions',
      category: 'hosting',
    },
    {
      name: 'resumis',
      description:
        "Resumis is Esperanto for 'summarized'. It's also an API and headless CMS for your personal web presence, a CV generator, and JSON Resume provider.",
      link: 'https://github.com/maxfierke/resumis',
      category: 'framework',
    },
    {
      name: 'resume-generator',
      description:
        'This project contains my personal resume or CV. It uses jsonresume hackmyresume format to save and display the resume in PDF and HTML format.',
      link: 'https://github.com/patricioperpetua/resume',
      category: 'generator',
    },
    {
      name: 'me',
      description:
        'A next-gen JAMSTACK template for developers that leverage the use of JSON Resume Schema in creating a web based vitae and portfolio.',
      link: 'https://github.com/jkga/me',
      category: 'framework',
    },
    {
      name: 'jsonresume-types',
      description: 'TypeScript type definition for JSON Resume',
      link: 'https://github.com/kurone-kito/jsonresume-types',
      category: 'types',
    },
    {
      name: 'jsonresume-gpt3',
      description: 'This uses GPT-3 API access to generate fake resumes.',
      link: 'https://github.com/jsonresume/jsonresume-gpt3',
      category: 'ml',
    },
    {
      name: 'netifly-jsonresume',
      description:
        'An online résumé you can fork and host for free on GitHub quickly and without fuss.',
      link: 'https://github.com/lowerbarriers/resume',
      category: 'framework',
    },
    {
      name: 'CMD Resume',
      description:
        'CMD Resume is a web based command line for your resume using data from JSON Resume format.',
      link: 'https://github.com/bbody/CMD-Resume',
      category: 'visualization',
    },
    {
      name: 'JSONResume Action',
      description: 'GitHub Action for exporting JSONResume',
      link: 'https://github.com/marketplace/actions/jsonresume-export',
      category: 'github',
    },
    {
      name: 'Profile Editor',
      description: 'Editor for JSON Resume',
      link: 'https://github.com/jsnelders/profile-studio',
      category: 'editor',
    },
    {
      name: 'JSON Resume as a Service',
      description:
        'Serverless service that uses the jsonresume.org schema to generate dynamic resumes from a github gist that you can download or recieve back as a http response.',
      link: 'https://github.com/DrakeAxelrod/json-resume-service',
      category: 'hosting',
    },
    {
      name: 'resumed',
      description:
        'Lightweight JSON Resume builder, no-frills alternative to resume-cli.',
      link: 'https://github.com/rbardini/resumed',
      category: 'cli',
    },
    {
      name: 'resume-cli',
      description: 'Official CLI tool for JSON Resume',
      link: 'https://github.com/jsonresume/resume-cli',
      category: 'cli',
    },
    {
      name: 'resume-pycli',
      description:
        'Python CLI tool to build a beautiful resume from a JSON Resume file.',
      link: 'https://github.com/nikaro/resume-pycli',
      category: 'cli',
    },
    {
      name: 'ancv',
      description:
        'Renders your JSON Resume for online & pretty terminal display',
      link: 'https://github.com/alexpovel/ancv',
      category: 'visualization',
    },
  ];

  const categories = [
    'hosting',
    'transfer',
    'github',
    'editor',
    'cli',
    'framework',
    'visualization',
    'generator',
    'parser',
    'validator',
    'ml',
  ];

  const renderProjects = (category) => {
    return projects
      .filter((project) => project.category === category)
      .map((project) => (
        <li key={project.link}>
          <a href={project.link}>{project.name}</a> - {project.description}
        </li>
      ));
  };

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
              resumes. This page will showcase some of those ideas…
            </p>

            {categories.map((category) => (
              <div key={category}>
                <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                <ul>{renderProjects(category)}</ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
