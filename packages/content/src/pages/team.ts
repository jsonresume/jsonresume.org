/** Team page copy. The history narrative was written for the old site's team page. */

export const contributing = {
  intro: 'JSON Resume is developed in the open on GitHub. Anyone can help.',
  ways: [
    'Create and maintain resume themes',
    'Discuss schema changes and interoperability',
    'Improve tools, documentation and examples',
  ],
  href: 'https://github.com/jsonresume/jsonresume.org',
  guide:
    'https://github.com/jsonresume/jsonresume.org/blob/master/CONTRIBUTING.md',
};

export const roles = {
  coreTeam: 'Maintain the schema, tools, registry and this site.',
  standardsCommittee: 'Review and decide changes to the schema.',
};

export interface StoryChapter {
  title: string;
  /** Markdown paragraphs. */
  body: string;
}

export const story: StoryChapter[] = [
  {
    title: 'A shared format for a familiar document',
    body: `JSON Resume began in 2014 with Thomas Davis and Roland Sharp and a practical idea: give résumé information a shared, structured format so people could reuse it across tools and designs. Experience, education and skills live in a JSON file, and themes handle how that information appears on the page. The project was already being discussed on [Hacker News in July 2014](https://news.ycombinator.com/item?id=7996464).

The public introduction came earlier than the maintainers expected. In their [first release post](/blog/first-official-release), Davis and Sharp described turning that attention into a usable specification. On 31 July they released version 0.0.0, with a command-line validator, an npm-based theme system and a standards committee, and a stated priority of helping people manage their own job-seeking profiles.`,
  },
  {
    title: 'From a schema to an ecosystem',
    body: `Portability depended on other tools reading and writing the format. In September 2014 the team [announced its first service integration](/blog/first-service-integration): Represent had added JSON Resume export.

Themes gave contributors another way to put the schema to work. By November the project was showcasing designs including Elegant, Kendall and Paper, and [announced a monthly theme competition](/blog/monthly-theme-competition-sponsored-by-hired) sponsored by Hired.com.`,
  },
  {
    title: 'Keeping the project running',
    body: `The [2019 fifth-birthday update](/blog/5th-birthday-new-features) looked back on slower development and a community contributing themes, parsers, converters, tools and services, a measured pace that suited a standard. It was candid about the cost of free hosting, and introduced a rewrite that renders résumé files kept in people's own GitHub Gists.`,
  },
  {
    title: 'A format people build on',
    body: `The separation of data and presentation is still the core of the project: the [schema](/schema) describes résumé content, the [themes](/themes) display it, and the [projects directory](/projects) collects the tools built around it.`,
  },
];
