import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { validate } = require('../packages/schema/validator.js');
const directory = fileURLToPath(
  new URL('../apps/homepage2/public/media/', import.meta.url)
);
const resume = {
  $schema:
    'https://raw.githubusercontent.com/jsonresume/jsonresume.org/master/packages/schema/schema.json',
  basics: {
    name: 'Alex Example',
    label: 'Software Developer',
    email: 'alex@example.com',
    url: 'https://example.com',
    summary:
      'I build useful, accessible tools for the web. This fictional profile demonstrates how structured career information can become a readable résumé.',
  },
  work: [
    {
      name: 'Example Studio',
      position: 'Software Developer',
      startDate: '2023-02-01',
      endDate: '2026-09-30',
      highlights: [
        'Built accessible interfaces for a community events platform.',
        'Maintained automated checks and documented reusable components.',
      ],
    },
  ],
  education: [
    {
      institution: 'Example University',
      area: 'Computer Science',
      studyType: 'Bachelor of Science',
      startDate: '2019-09-01',
      endDate: '2022-06-30',
    },
  ],
  skills: [
    {
      name: 'Web development',
      keywords: ['JavaScript', 'HTML', 'CSS', 'Accessibility'],
    },
  ],
  projects: [
    {
      name: 'Community Events',
      description: 'A fictional open-source project for finding local events.',
      url: 'https://example.com/projects/community-events',
    },
  ],
};

validate(resume, (errors) => {
  if (errors)
    throw new Error(`Invalid media example: ${JSON.stringify(errors)}`);
});
mkdirSync(directory, { recursive: true });
writeFileSync(
  `${directory}example-resume.json`,
  `${JSON.stringify(resume, null, 2)}\n`
);

const escape = (value) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[
        char
      ])
  );
const {
  basics,
  work: [job],
  education: [education],
  skills: [skills],
  projects: [project],
} = resume;
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Alex Example — fictional JSON Resume demo</title>
<meta name="robots" content="noindex">
<style>
*{box-sizing:border-box}body{margin:0;background:#f0f2f4;color:#222;font:17px/1.65 Arial,sans-serif}
main{max-width:960px;margin:44px auto;background:#fff;padding:48px 60px}
.note{font-size:14px;color:#555;margin:0 0 30px}.name{font-size:42px;line-height:1.15;margin:0 0 8px;letter-spacing:-.02em}
.role{font-size:21px;margin:0 0 12px}.contacts{font-size:15px;margin:0 0 26px}a{color:#9f2424;text-underline-offset:3px}
h2{font-size:19px;margin:24px 0 12px;padding-bottom:8px;border-bottom:1px solid #ddd}h3{font-size:17px;margin:0}
p{margin:6px 0 16px}ul{padding-left:22px;margin:8px 0}.date{color:#555;font-size:14px}.columns{display:grid;grid-template-columns:1.7fr 1fr;gap:40px}
footer{border-top:1px solid #ddd;margin-top:26px;padding-top:16px;font-size:13px;color:#555}
a:focus-visible{outline:3px solid #1b579b;outline-offset:3px}
@media(max-width:700px){main{margin:0;padding:28px 24px}.columns{grid-template-columns:1fr;gap:0}.name{font-size:34px}}
@media print{body{background:#fff}main{margin:0;padding:24px;max-width:none}.note,footer{display:none}}
</style></head><body><main>
<p class="note">JSON Resume · Fictional profile for demonstrations</p>
<header><h1 class="name">${escape(basics.name)}</h1><p class="role">${escape(
  basics.label
)}</p>
<p class="contacts"><a href="mailto:${escape(basics.email)}">${escape(
  basics.email
)}</a> · <a href="${basics.url}">example.com</a></p></header>
<p>${escape(basics.summary)}</p><div class="columns"><div>
<section><h2>Work experience</h2><h3>${escape(job.position)} · ${escape(
  job.name
)}</h3><p class="date">February 2023 – September 2026</p>
<ul>${job.highlights
  .map((item) => `<li>${escape(item)}</li>`)
  .join('')}</ul></section>
<section><h2>Projects</h2><h3>${escape(project.name)}</h3><p>${escape(
  project.description
)}</p><a href="${project.url}">Project website</a></section>
</div><div><section><h2>Education</h2><h3>${escape(
  education.institution
)}</h3><p>${escape(education.studyType)}<br>${escape(
  education.area
)}</p><p class="date">2019 – 2022</p></section>
<section><h2>Skills</h2><p>${skills.keywords
  .map(escape)
  .join(' · ')}</p></section></div></div>
<footer>Rendered from <a href="/media/example-resume.json">example-resume.json</a> · <a href="/media/">JSON Resume media kit</a><br>
Demonstration layout. All people, employers and institutions in this résumé are fictional.</footer>
</main></body></html>`;
writeFileSync(`${directory}example-resume.html`, html);
writeFileSync(
  `${directory}facts.txt`,
  `JSON Resume — media factsheet
Checked: 21 October 2026

SHORT DESCRIPTION
JSON Resume is a community-developed, open-source schema for expressing a résumé as JSON. Started in 2014 by Thomas Davis and Roland Sharp, it separates career information from presentation so compatible tools can use the same data to build documents and portfolio websites.

FOUNDER BIO
Thomas Davis co-founded JSON Resume with Roland Sharp in 2014. His contributions include work on the project's schema, command-line tools and hosted registry.

CONTACT
Thomas Davis — thomasalwyndavis@gmail.com
Please include your publication, topic, deadline and time zone.

SOURCES AND EXAMPLES
Media kit: https://jsonresume.org/media/
Documented history: https://jsonresume.org/team/#history
2014 announcement: https://jsonresume.org/blog/first-official-release/
Schema: https://jsonresume.org/schema/
Source: https://github.com/jsonresume/jsonresume.org
TechFolios: https://techfolios.github.io/
LuaLaTeX implementation: https://ctan.org/pkg/jsonresume

LIMITATIONS
The schema, tools and hosted registry are distinct. Using the format does not guarantee acceptance by an employer or applicant tracking system. Supported fields and output depend on the tool and theme.

MEDIA ASSETS
The fictional example, demo HTML, screenshots and factsheet in this media kit may be reproduced with attribution to JSON Resume (jsonresume.org). Caption the résumé as a fictional example.
`
);
console.log(
  'Generated and schema-validated media example, HTML and factsheet.'
);
