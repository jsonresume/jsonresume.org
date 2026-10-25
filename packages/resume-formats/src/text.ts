import { place, period, text, texts, entries, type Entry } from './read';

type Lines = ReadonlyArray<string | undefined>;

const joined = (parts: Lines, separator = ' · ') => {
  const present = parts.filter((part) => part !== undefined);
  return present.length > 0 ? present.join(separator) : undefined;
};

const section = (
  title: string,
  items: ReadonlyArray<Lines>
): string | undefined => {
  const blocks = items
    .map((lines) => lines.filter((line) => line !== undefined).join('\n'))
    .filter((block) => block !== '');
  if (blocks.length === 0) return undefined;
  return [
    title.toUpperCase(),
    '='.repeat(title.length),
    '',
    blocks.join('\n\n'),
  ].join('\n');
};

const bullets = (values: ReadonlyArray<string>) =>
  values.map((value) => `  - ${value}`);

/** An entry with a heading line, dates, a summary and bullet points. */
const entry = (heading: Lines, item: Entry, summaryKey = 'summary'): Lines => [
  joined(heading, ', '),
  joined([period(item), place(item['location'])]),
  text(item['url']),
  text(item[summaryKey]),
  ...bullets([...texts(item['highlights']), ...texts(item['courses'])]),
];

const header = (basics: Entry): Lines => [
  text(basics['name']),
  text(basics['label']),
  joined([text(basics['email']), text(basics['phone']), text(basics['url'])]),
  place(basics['location']),
  ...entries(basics['profiles']).map((p) =>
    joined([text(p['network']), text(p['url']) ?? text(p['username'])], ': ')
  ),
];

/**
 * A resume as plain text: readable in a terminal or an email, every
 * standard section in order, absent fields left out.
 */
export function toText(resume: Entry): string {
  const basics = entries([resume['basics']])[0] ?? {};
  const list = (key: string) => entries(resume[key]);
  const summary = text(basics['summary']);
  return [
    header(basics)
      .filter((line) => line !== undefined)
      .join('\n'),
    summary ? section('Summary', [[summary]]) : undefined,
    section(
      'Work',
      list('work').map((w) => entry([text(w['position']), text(w['name'])], w))
    ),
    section(
      'Volunteer',
      list('volunteer').map((v) =>
        entry([text(v['position']), text(v['organization'])], v)
      )
    ),
    section(
      'Projects',
      list('projects').map((p) => entry([text(p['name'])], p, 'description'))
    ),
    section(
      'Education',
      list('education').map((e) =>
        entry(
          [
            joined([text(e['studyType']), text(e['area'])], ', '),
            text(e['institution']),
          ],
          e
        )
      )
    ),
    section(
      'Awards',
      list('awards').map((a) => [
        joined([text(a['title']), text(a['awarder']), text(a['date'])]),
        text(a['summary']),
      ])
    ),
    section(
      'Certificates',
      list('certificates').map((c) => [
        joined([text(c['name']), text(c['issuer']), text(c['date'])]),
        text(c['url']),
      ])
    ),
    section(
      'Publications',
      list('publications').map((p) => [
        joined([text(p['name']), text(p['publisher']), text(p['releaseDate'])]),
        text(p['url']),
        text(p['summary']),
      ])
    ),
    section(
      'Skills',
      list('skills').map((s) => [
        joined([text(s['name']), text(s['level'])], ': '),
        joined(texts(s['keywords']), ', '),
      ])
    ),
    section(
      'Languages',
      list('languages').map((l) => [
        joined([text(l['language']), text(l['fluency'])], ': '),
      ])
    ),
    section(
      'Interests',
      list('interests').map((i) => [
        joined([text(i['name']), joined(texts(i['keywords']), ', ')], ': '),
      ])
    ),
    section(
      'References',
      list('references').map((r) => [
        text(r['reference']) && `“${text(r['reference'])}”`,
        text(r['name']) && `— ${text(r['name'])}`,
      ])
    ),
  ]
    .filter((part) => part !== undefined && part !== '')
    .join('\n\n')
    .concat('\n');
}
