export const metadata = {
  title: 'Projects — JSON Resume',
  description: 'Community projects built around JSON Resume',
  image: 'https://jsonresume.org/images/logo.png',
  url: 'https://jsonresume.org/projects/',
};

import './projects.css';

export default function GettingStarted() {
  const PROJECTS = [
    {
      name: 'Friggeri Resume',
      description:
        'An open-source static webapp supporting JSON Resume, Markdown or gist URL and export to PDF using Browser Print dialog',
      link: 'https://yne.fr/resume/',
      category: 'integration',
      language: 'Javascript',
    },
    {
      name: 'Multilingual Resume',
      description:
        'GitHub repository with i18n support (EN/FR), automated translations via GitHub Actions, and PDF generation.',
      link: 'https://github.com/ludoo0d0a/resume',
      category: 'integration',
      language: 'Javascript',
    },
    {
      name: 'Reactive Resume',
      description:
        'An open-source resume builder supporting JSON Resume schema with multiple templates.',
      link: 'https://rxresu.me',
      category: 'integration',
      language: 'N/A',
    },
    {
      name: 'Resumeio',
      description:
        'Have you ever find yourself wanting to create a professional looking CV, but instead you handled all your personal data in exchange of a single unchangeable PDF file?',
      link: 'https://resumio.xyz/',
      category: 'integration',
      language: 'N/A',
    },
    {
      name: 'Resumake',
      description:
        'A web app that generates résumés based on JSON Resume schema.',
      link: 'https://resumake.io',
      category: 'integration',
      language: 'N/A',
    },
    {
      name: 'Standard Resume',
      description:
        'A web-based resume builder with support for importing JSON résumés.',
      link: 'https://standardresume.co',
      category: 'integration',
      language: 'N/A',
    },
    {
      name: 'ResumeSet',
      description:
        'AI tailored resume builder with support for importing JSON résumés.',
      link: 'https://resumeset.com',
      category: 'integration',
      language: 'N/A',
    },
    {
      name: 'JSON Resume Validator (PHP)',
      description:
        'Tool in PHP that validates if a Resume is according to the defined schema. It also validates if any desired properties are not empty.',
      link: 'https://github.com/lfbn/json-resume-validator',
      category: 'validator',
      language: 'PHP',
    },
    {
      name: 'JSON Resume Validator (Python)',
      description:
        'Python tool to validate JSON résumés to ensure that they are according to the defined schema',
      link: 'https://github.com/kelvintaywl/jsonresume-validator',
      category: 'validator',
      language: 'Python',
    },
    {
      name: 'JSON Resume Validator and Parser (Java)',
      description:
        'Java library to validate and parse JSON résumés to Java objects',
      link: 'https://github.com/eaxdev/Java-JsonResume-Validator',
      category: 'validator',
      language: 'Java',
    },
    {
      name: 'JSON Resume Validator (Go)',
      description: 'Go library to validate JSON résumés',
      link: 'https://github.com/cinarmert/json-resume-validator',
      category: 'validator',
      language: 'Go',
    },
    {
      name: 'LinkedIn Profile to JSON Resume Browser Tool',
      description:
        'An extremely easy-to-use browser extension for exporting your full LinkedIn Profile to a JSON Resume file or string.',
      link: 'https://github.com/joshuatz/linkedin-to-jsonresume',
      category: 'transfer',
      language: 'Javascript',
    },
    {
      name: 'LinkedIn to JSON Résumé conversion',
      description:
        'Inspired by https://github.com/mblarsen/resume-linkedin, deprecated primarily due to these changes in the LinkedIn API.',
      link: 'https://github.com/w0rd-driven/jsonresume-linkedin',
      category: 'transfer',
      language: 'Javascript',
    },
    {
      name: 'SkillSet',
      description:
        'Intuitive job-candidate skill visualization, taking advantage of D3.js and JSONResume.',
      link: 'https://github.com/Jac21/SkillSet',
      category: 'visualization',
      language: 'Javascript',
    },
    {
      name: 'gulp-resume',
      description:
        'gulp-resume is a gulp plugin to generate a resume using jsonresume.org.',
      link: 'https://github.com/mattberther/gulp-resume',
      category: 'generator',
      language: 'Javascript',
    },
    {
      name: 'ng-jsonresume',
      description:
        'ng-jsonresume lets you include a resume into a webpage by using an Angular directive and providing data in the standardized jsonresume format.',
      link: 'https://github.com/marko-knoebl/ng-jsonresume',
      category: 'framework',
      language: 'Javascript',
    },
    {
      name: 'jsonresume (haskell)',
      description:
        'This library encodes JSON Resume standard in Haskell datatypes, and provides a parser to read a CV in the JSON Resume format.',
      link: 'https://hackage.haskell.org/package/jsonresume',
      category: 'parser',
      language: 'Haskell',
    },
    {
      name: 'rendercv',
      description:
        'RenderCV is a latext CV/resume framework. It allows you to create a high-quality CV as a PDF from a YAML file with full Markdown syntax support and complete control over the latex code',
      link: 'https://github.com/sinaatalay/rendercv',
      category: 'framework',
      language: 'Python/Latex',
    },
    {
      name: 'hugo-mod-json-resume',
      description:
        'A Hugo module containing templates to integrate multilingual JSON Resume data into your Hugo website.',
      link: 'https://github.com/schnerring/hugo-mod-json-resume',
      category: 'framework',
      language: 'Go',
    },
    {
      name: 'hugo-theme-gruvbox',
      description:
        'A retro-looking Hugo theme inspired by gruvbox to build secure, fast, and SEO-ready websites.',
      link: 'https://github.com/schnerring/hugo-theme-gruvbox',
      category: 'framework',
      language: 'Go',
    },
    {
      name: 'gatsby-portfolio',
      description:
        'The whole portfolio is a React-based single page app built with Gatsby v3.',
      link: 'https://github.com/kremalicious/portfolio',
      category: 'framework',
      language: 'Javscript',
    },
    {
      name: 'jsonresume-manager',
      description: "A Laravel framework to manage your JSON Resume's",
      link: 'https://github.com/antoniosarosi/jsonresume-manager',
      category: 'framework',
      language: 'PHP',
    },
    {
      name: 'react-ultimate-resume',
      description:
        'react-ultimate-resume is an open-source customizable software developer resume to highlight your skills and experiences.',
      link: 'https://github.com/welovedevs/react-ultimate-resume',
      category: 'framework',
      language: 'Javascript',
    },
    {
      name: 'customized-registry-functions',
      description:
        'This is a slightly tweaked version of the JSON Registry. That project is using their own Firebase project and a specific JSON schema.',
      link: 'https://github.com/anthonyjdella/customized-registry-functions',
      category: 'hosting',
      language: 'Javascript',
    },
    {
      name: 'Official Registry Hosting',
      description:
        'This repository is responsible for our free JSON Resume community hosting.',
      link: 'https://github.com/jsonresume/jsonresume.org',
      category: 'hosting',
      language: 'Javascript',
    },
    {
      name: 'resumis',
      description:
        "Resumis is Esperanto for 'summarized'. It's also an API and headless CMS for your personal web presence, a CV generator, and JSON Resume provider.",
      link: 'https://github.com/maxfierke/resumis',
      category: 'framework',
      language: 'Ruby',
    },

    {
      name: 'JsonResumeBuilder',
      description:
        'This application generates PDF documents from JSON data and Jinja2-to-LaTeX templates, allowing for dynamic creation of professional-looking documents.',
      link: 'https://github.com/bartlomiej-aleksiejczyk/JsonResumeBuilder',
      category: 'framework',
      language: 'Jinja/Latex',
    },

    {
      name: 'jsonresume-component',
      description:
        '<json-resume> is a web component (using LitElement) which presents resume content stored in JSON Resume format.',
      link: 'https://github.com/scottnath/jsonresume-component',
      category: 'framework',
      language: 'Web Components',
    },
    {
      name: 'resume-generator',
      description:
        'Contains assets for creating a personal resume in JSON Resume format, allowing for the generation of PDF and HTML versions of the resume using provided scripts and configurations​ ',
      link: 'https://github.com/patricioperpetua/resume',
      category: 'generator',
      language: 'Javascript',
    },
    {
      name: 'me',
      description:
        'A next-gen JAMSTACK template for developers that leverage the use of JSON Resume Schema in creating a web based vitae and portfolio.',
      link: 'https://github.com/jkga/me',
      category: 'framework',
      language: 'Javascript',
    },
    {
      name: 'jsonresume-types',
      description: 'TypeScript type definition for JSON Resume',
      link: 'https://github.com/kurone-kito/jsonresume-types',
      category: 'types',
      language: 'Typescript',
    },
    {
      name: 'jsonresume-gpt3',
      description: 'This uses GPT-3 API access to generate fake résumés.',
      link: 'https://github.com/jsonresume/jsonresume-gpt3',
      category: 'ai',
      language: 'Python',
    },
    {
      name: 'Registry AI',
      description:
        'The official registry offers a bunch of useful AI tools for hosted résumés',
      link: 'https://registry.jsonresume.org/thomasdavis/jobs',
      category: 'ai',
      language: 'Javascript',
    },
    {
      name: 'ResuLLMe',
      description:
        'ResuLLMe is a prototype that uses Large Language Models (LLMs) to tailor résumés. Its goal is to enhance résumés to help candidates avoid common mistakes that occur while applying for jobs. It is like a smart career advisor to check your résumé.',
      link: 'https://github.com/IvanIsCoding/ResuLLMe',
      category: 'ai',
      language: 'Python',
    },
    {
      name: 'netifly-jsonresume',
      description:
        'An online résumé you can fork and host for free on GitHub quickly and without fuss.',
      link: 'https://github.com/lowerbarriers/resume',
      category: 'framework',
      language: 'Javascript',
    },
    {
      name: 'resume-ng',
      description:
        'This project is a sophisticated Resume Builder that harnesses the power of Astro to create a visually appealing website to showcase your resume and also uses Puppeteer and Chrome to generate a downloadable PDF version.',
      link: 'https://github.com/bn3t/resume-ng',
      category: 'framework',
      language: 'Javascript',
    },
    {
      name: 'jsonresume-docx',
      description:
        'Render your JSON résumé as a .docx file, hide your personality. ;)',
      link: 'https://github.com/panasenco/jsonresume-docx',
      category: 'framework',
      language: 'Python',
    },
    {
      name: 'resume-exporter',
      description: 'A tool to export JSONResume to LaTeX - with additions!',
      link: 'https://github.com/kylegrantlucas/resume-exporter',
      category: 'framework',
      language: 'Go/Latex',
    },
    {
      name: 'CMD Resume',
      description:
        'CMD Resume is a web based command line for your resume using data from JSON Resume format.',
      link: 'https://github.com/bbody/CMD-Resume',
      category: 'visualization',
      language: 'Javascript',
    },
    {
      name: 'AWASM Portfolio',
      description:
        'WebAssembly-powered interactive resume with K8s-like commands. Provides CLI and UI modes for exploring your JSON Resume.',
      link: 'https://github.com/TrianaLab/awasm-portfolio',
      category: 'visualization',
      language: 'Go/WebAssembly',
    },
    {
      name: 'JSON Resume Terminal',
      description:
        'Web component for displaying JSON Resume in a terminal-style interface. Fetches resume from GitHub gist.',
      link: 'https://github.com/kyzrfranz/jsonresume-terminal',
      category: 'visualization',
      language: 'Javascript',
    },
    {
      name: 'JSONResume Action',
      description: 'GitHub Action for exporting JSONResume',
      link: 'https://github.com/marketplace/actions/jsonresume-export',
      category: 'github',
      language: 'YAML',
    },
    {
      name: 'JSONResume Generator - Github Action',
      description:
        'Generating résumés with JSONResume! Makes use of the resumed CLI to generate résumés!',
      link: 'https://github.com/Devleaps/jsonresume-generator',
      category: 'github',
      language: 'YAML',
    },

    {
      name: 'Gist - JSON Resume Editor',
      description: 'Provides an oauth editor for Github Gists',
      link: 'https://registry.jsonresume.org',
      category: 'editor',
      language: 'Javascript',
    },
    {
      name: 'Profile Editor',
      description: 'Editor for JSON Resume',
      link: 'https://github.com/jsnelders/profile-studio',
      category: 'editor',
      language: 'Javascript',
    },
    {
      name: 'JSON Resume as a Service',
      description:
        'Serverless service that uses the jsonresume.org schema to generate dynamic résumés from a github gist that you can download or recieve back as a http response.',
      link: 'https://github.com/DrakeAxelrod/json-resume-service',
      category: 'hosting',
      language: 'Javascript',
    },
    {
      name: 'resumed',
      description:
        'Lightweight JSON Resume builder, no-frills alternative to resume-cli.',
      link: 'https://github.com/rbardini/resumed',
      category: 'cli',
      language: 'Python',
    },
    {
      name: 'goresume',
      description: 'Build HTML/PDF résumé from JSON/YAML/TOML',
      link: 'https://github.com/nikaro/goresume',
      category: 'cli',
      language: 'Go',
    },
    {
      name: 'resume-cli',
      description: 'Official CLI tool for JSON Resume',
      link: 'https://github.com/jsonresume/resume-cli',
      category: 'cli',
      language: 'Javascript',
    },
    {
      name: 'resume-pycli',
      description:
        'Python CLI tool to build a beautiful résumé from a JSON Resume file.',
      link: 'https://github.com/nikaro/resume-pycli',
      category: 'cli',
      language: 'Python',
    },

    {
      name: 'pysira',
      description:
        'CLI tool to export jsonresume files to different formats (html, tex, pdf, ...) and different languages.',
      link: 'https://github.com/hmiladhia/pysira',
      category: 'cli',
      language: 'Python',
    },
    {
      name: 'ancv',
      description:
        'Renders your JSON Resume for online & pretty terminal display',
      link: 'https://github.com/alexpovel/ancv',
      category: 'visualization',
      language: 'Python',
    },
    {
      name: 'jsonresume-nix',
      description:
        'Provides a Nix-based environment for working with JSON Resume.',
      link: 'https://github.com/TaserudConsulting/jsonresume-nix',
      category: 'tooling',
      language: 'Nix',
    },
    {
      name: 'resume.nix',
      description:
        'Reproducible personal résumé built & deployed using Nix and jsonresume. Supports a broad number of themes.',
      link: 'https://github.com/Lehmanator/resume.nix',
      category: 'images',
      language: 'Nix',
    },

    {
      name: 'resume-optimizer',
      description: 'Use AI to ensure your résumé passes ATS keyword screening.',
      link: 'https://github.com/panasenco/resume-optimizer',
      category: 'images',
      language: 'Nix',
    },
    {
      name: 'ResumeHub Theme',
      description: 'A JSON Resume theme from ResumeHub.no.',
      link: 'https://github.com/Solsem-Consulting/jsonresume-theme-ResumeHub',
      category: 'theme',
      language: 'Handlebars',
    },
    {
      name: 'Astro JSON Resume',
      description: 'Static Astro website generated from a JSON Resume file.',
      link: 'https://github.com/ambaena/json-resume',
      category: 'framework',
      language: 'Astro',
    },
    {
      name: 'Lissy93 CV',
      description: 'Auto-generates LaTeX PDF and website from JSONResume data.',
      link: 'https://github.com/Lissy93/cv',
      category: 'generator',
      language: 'TeX/JavaScript',
    },
    {
      name: 'Straightforward Theme',
      description: 'A straightforward JSON Resume theme.',
      link: 'https://github.com/slugstack/jsonresume-theme-straightforward',
      category: 'theme',
      language: 'Handlebars',
    },
  ];

  const categories = [
    'ai',
    'ats',
    'cli',
    'editor',
    'framework',
    'generator',
    'github',
    'hosting',
    'images',
    'integration',
    'parser',
    'theme',
    'tooling',
    'transfer',
    'validator',
    'visualization',
  ];

  const renderProjects = (category) => {
    const projects = PROJECTS.filter(
      (project) => project.category === category
    );

    return projects.map((project) => (
      <div className="project-item" key={project.link}>
        <div className="project-name">
          <a href={project.link}>{project.name}</a>
        </div>
        <div className="project-language">{project.language}</div>
        <div className="project-description">{project.description}</div>
      </div>
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
              résumés. Please submit new projects to the{' '}
              <a href="https://github.com/jsonresume/jsonresume.org">
                repository
              </a>
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
