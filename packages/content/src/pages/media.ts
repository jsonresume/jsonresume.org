/**
 * Media kit copy. Counts and versions are computed (see ../facts.ts); the
 * rest was checked 21 October 2026 against the sources linked beside it.
 */

const repo = 'https://github.com/jsonresume/jsonresume.org';

export const boilerplate = {
  short:
    'JSON Resume is a community-developed, open-source schema for expressing a résumé as JSON. Started in 2014 by Thomas Davis and Roland Sharp, it separates career information from presentation so compatible tools can use the same data to build documents and portfolio websites.',
  founder:
    "Thomas Davis co-founded JSON Resume with Roland Sharp in 2014. His contributions include work on the project's schema, command-line tools and hosted registry.",
  limitations:
    'The schema, tools and hosted registry are distinct parts of the project; you can use the format without publishing anything to the registry. A common file format does not guarantee acceptance by an employer or applicant tracking system: supported fields and output depend on the tool and theme.',
};

/** Facts with where to check them. Values with {{placeholders}} are filled from code. */
export const sourcedFacts: {
  label: string;
  value: string;
  source: { label: string; href: string };
}[] = [
  {
    label: 'Started',
    value: '2014',
    source: {
      label: 'Public discussion, 7 July 2014',
      href: 'https://news.ycombinator.com/item?id=7996464',
    },
  },
  {
    label: 'Co-founders',
    value: 'Thomas Davis and Roland Sharp',
    source: {
      label: '2014 release announcement',
      href: '/blog/first-official-release',
    },
  },
  {
    label: 'Schema version',
    value: '{{schemaVersion}}',
    source: {
      label: 'Package source',
      href: `${repo}/blob/master/packages/schema/package.json`,
    },
  },
  {
    label: 'Resume sections',
    value: '{{schemaSectionCount}}',
    source: {
      label: 'Schema source',
      href: `${repo}/blob/master/packages/schema/schema.json`,
    },
  },
  {
    label: 'Themes in the gallery',
    value: '{{themeCount}}',
    source: { label: 'Theme gallery', href: '/themes' },
  },
  {
    label: 'License',
    value: 'MIT',
    source: {
      label: 'License text',
      href: `${repo}/blob/master/packages/schema/LICENSE.md`,
    },
  },
];

export interface MediaAsset {
  title: string;
  description: string;
  href: string;
  /** Shown as the card image when present. */
  preview?: string;
  format: string;
}

export const assets: MediaAsset[] = [
  {
    title: 'Example résumé (screenshot)',
    description: 'Alex Example, a fictional profile safe to publish.',
    href: '/media/example-resume.png',
    preview: '/media/example-resume.png',
    format: 'PNG · 1200×900',
  },
  {
    title: 'Project overview (screenshot)',
    description: 'How the schema, tools and themes fit together.',
    href: '/media/project-overview.png',
    preview: '/media/project-overview.png',
    format: 'PNG · 1200×900',
  },
  {
    title: 'Example résumé (HTML)',
    description: 'The rendered example, ready to open.',
    href: '/media/example-resume.html',
    format: 'HTML',
  },
  {
    title: 'Example résumé (JSON)',
    description: 'The data behind it, to try in any tool.',
    href: '/media/example-resume.json',
    format: 'JSON',
  },
  {
    title: 'Factsheet',
    description: 'Description, founder bio and sources as plain text.',
    href: '/media/facts.txt',
    format: 'TXT',
  },
];

export const usage =
  'The fictional example, screenshots and factsheet may be reproduced with attribution to JSON Resume (jsonresume.org). Please caption the résumé as a fictional example.';

export const implementations = [
  {
    title: 'TechFolios, University of Hawaiʻi',
    description:
      'A technical-portfolio system that uses JSON Resume for biographical information.',
    href: 'https://techfolios.github.io/',
  },
  {
    title: 'jsonresume on CTAN',
    description:
      "Lukas Wolfsteiner's LuaLaTeX package renders JSON Resume data into documents.",
    href: 'https://ctan.org/pkg/jsonresume',
  },
];

export const contact = {
  name: 'Thomas Davis',
  role: 'Co-founder, JSON Resume',
  about:
    "Available to discuss the project's history, résumé data portability and maintaining open-source tools.",
  email: 'thomasalwyndavis@gmail.com',
  mailto:
    'mailto:thomasalwyndavis@gmail.com?subject=JSON%20Resume%20media%20enquiry',
  github: 'https://github.com/thomasdavis',
  resume: 'https://jsonresume.org/@thomasdavis',
  ask: 'Include your publication, topic, deadline and time zone. Questions about a third-party tool are best sent to its maintainers.',
};

export const roadmap = `${repo}/issues/329`;
