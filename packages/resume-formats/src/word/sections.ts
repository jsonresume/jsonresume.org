import { Paragraph, TextRun } from 'docx';
import { date, entries, place, span, text, texts, type Entry } from '../read';
import {
  body,
  bullets,
  details,
  item,
  joined,
  link,
  direction,
  section,
  subheading,
} from './blocks';

/** A URL as a link labelled without its scheme, or absent. */
export const web = (value: unknown) => {
  const url = text(value);
  if (!url) return undefined;
  return link(url, url.replace(/^https?:\/\//, '').replace(/\/$/, ''));
};

/** A role: title, dates and place, summary, then highlights as bullets. */
const role = (title: string | undefined, at: string | undefined, e: Entry) => [
  ...subheading(joined([title, at], ', ')),
  ...details([span(e), place(e['location']), web(e['url'])]),
  ...body(text(e['summary'])),
  ...bullets(texts(e['highlights'])),
];

const keywords = (e: Entry) => joined(texts(e['keywords']), ', ');

/** Every section after the summary, in the plain text format's order. */
export const sections = (resume: Entry): Paragraph[] => {
  const list = (key: string) => entries(resume[key]);
  return [
    ...section(
      'Work experience',
      list('work').flatMap((w) => role(text(w['position']), text(w['name']), w))
    ),
    ...section(
      'Volunteering',
      list('volunteer').flatMap((v) =>
        role(text(v['position']), text(v['organization']), v)
      )
    ),
    ...section(
      'Projects',
      list('projects').flatMap((p) => [
        ...subheading(text(p['name'])),
        ...details([
          span(p),
          text(p['entity']),
          joined(texts(p['roles']), ', '),
          web(p['url']),
        ]),
        ...body(text(p['description'])),
        ...bullets(texts(p['highlights'])),
      ])
    ),
    ...section(
      'Education',
      list('education').flatMap((e) => [
        ...subheading(text(e['institution'])),
        ...details([
          joined([text(e['studyType']), text(e['area'])], ', '),
          span(e),
          text(e['score']) && `Score: ${text(e['score'])}`,
          web(e['url']),
        ]),
        ...bullets(texts(e['courses'])),
      ])
    ),
    ...section(
      'Awards',
      list('awards').flatMap((a) => [
        ...subheading(text(a['title'])),
        ...details([text(a['awarder']), date(a['date'])]),
        ...body(text(a['summary'])),
      ])
    ),
    ...section(
      'Certificates',
      list('certificates').flatMap((c) =>
        item(text(c['name']), [
          text(c['issuer']),
          date(c['date']),
          web(c['url']),
        ])
      )
    ),
    ...section(
      'Publications',
      list('publications').flatMap((p) => [
        ...subheading(text(p['name'])),
        ...details([
          text(p['publisher']),
          date(p['releaseDate']),
          web(p['url']),
        ]),
        ...body(text(p['summary'])),
      ])
    ),
    ...section(
      'Skills',
      list('skills').flatMap((s) =>
        item(
          joined(
            [text(s['name']), text(s['level']) && `(${text(s['level'])})`],
            ' '
          ),
          [keywords(s)]
        )
      )
    ),
    ...section(
      'Languages',
      list('languages').flatMap((l) =>
        item(text(l['language']), [text(l['fluency'])])
      )
    ),
    ...section(
      'Interests',
      list('interests').flatMap((i) => item(text(i['name']), [keywords(i)]))
    ),
    ...section(
      'References',
      list('references').flatMap((r) => {
        const quote = text(r['reference']);
        const name = text(r['name']);
        return [
          ...(quote
            ? [
                new Paragraph({
                  children: [
                    new TextRun({ text: `“${quote}”`, italics: true }),
                  ],
                  ...direction(quote),
                }),
              ]
            : []),
          ...(name
            ? [
                new Paragraph({
                  style: 'Details',
                  text: `— ${name}`,
                  ...direction(name),
                }),
              ]
            : []),
        ];
      })
    ),
  ];
};
