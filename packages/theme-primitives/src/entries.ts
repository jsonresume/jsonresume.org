import { date, period } from './dates.js';
import { join, link, location, paragraphs, strings, text } from './data.js';
import type { Data, Entry, SectionId } from './types.js';

export function entry(
  id: SectionId,
  item: Data,
  locale: string,
  present: string
): Entry {
  const result: Entry = {
    title: text(item.name),
    context: '',
    date: '',
    url: link(item.url),
    location: location(item.location),
    paragraphs: paragraphs(item.summary, item.description),
    highlights: strings(item.highlights).map((s) => s.replace(/^[•*-]\s+/, '')),
    details: strings(item.keywords),
  };
  if (id === 'work' || id === 'volunteer') {
    const organisation = text(id === 'work' ? item.name : item.organization);
    result.title = text(item.position) || organisation;
    result.context = text(item.position) ? organisation : '';
    result.date = period(item, locale, present, true);
  } else if (id === 'education') {
    result.title = text(item.institution);
    result.context = join(item.studyType, item.area);
    result.date = period(item, locale, present, false);
    result.details = [
      ...(text(item.score) ? [text(item.score)] : []),
      ...strings(item.courses),
    ];
  } else if (id === 'projects') {
    result.context = join(
      item.entity,
      strings(item.roles).join(', '),
      item.type
    );
    result.date = period(item, locale, present, false);
  } else if (id === 'awards') {
    result.title = text(item.title);
    result.context = text(item.awarder);
    result.date = date(item.date, locale);
  } else if (id === 'certificates') {
    result.context = text(item.issuer);
    result.date = date(item.date, locale);
  } else if (id === 'publications') {
    result.context = join(item.publisher, strings(item.authors).join(', '));
    result.date = date(item.releaseDate, locale);
    result.details = [
      join(item.volume, item.issue, item.pages),
      text(item.doi),
    ].filter(Boolean);
  } else if (id === 'skills') {
    result.context = text(item.level);
  } else if (id === 'languages') {
    result.title = text(item.language);
    result.context = text(item.fluency);
  } else if (id === 'references') {
    result.context = join(item.relationship, item.organization);
    result.paragraphs = paragraphs(item.reference);
  }
  return result;
}

export const hasContent = (item: Entry) =>
  Boolean(
    item.title ||
      item.context ||
      item.date ||
      item.paragraphs.length ||
      item.highlights.length ||
      item.details.length
  );
