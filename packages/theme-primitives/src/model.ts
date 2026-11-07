import { Option, Schema } from 'effect';
import { formatUrlForDisplay, normalizeDates } from '@jsonresume/utils';
import { entry, hasContent } from './entries.js';
import {
  join,
  link,
  location,
  record,
  records,
  strings,
  text,
} from './data.js';
import { labels, order } from './labels.js';
import type { Data, DocumentModel, SectionId, ThemeOptions } from './types.js';

const DocumentInput = Schema.Record(Schema.String, Schema.Unknown);
const canonicalLocales = Option.liftThrowable(Intl.getCanonicalLocales);

export function documentModel(
  input: unknown,
  options: ThemeOptions
): DocumentModel {
  const resume: Data = normalizeDates(
    Option.getOrElse(
      Schema.decodeUnknownOption(DocumentInput)(input),
      () => ({})
    )
  );
  const basics = record(resume.basics);
  const meta = record(resume.meta);
  const preferences = record(meta.researchThemes);
  const requestedLanguage =
    text(meta.language) || options.defaultLanguage || 'en';
  const language =
    Option.getOrElse(canonicalLocales(requestedLanguage), () => ['en'])[0] ??
    'en';
  const copy = labels(language);
  const requested = strings(preferences.sectionOrder).filter(
    (id): id is SectionId => order.includes(id as SectionId)
  );
  const sections = [
    ...new Set([...requested, ...(options.sectionOrder ?? order), ...order]),
  ]
    .map((id) => ({
      id,
      title: copy.section(id),
      entries: records(resume[id])
        .map((item) => entry(id, item, language, copy.present))
        .filter(hasContent),
    }))
    .filter((section) => section.entries.length);
  const address = record(basics.location);
  const email = text(basics.email);
  const phone = text(basics.phone);
  const contacts = [
    {
      text:
        preferences.showFullAddress === true
          ? join(address.address, address.postalCode, location(basics.location))
          : location(basics.location),
      href: '',
    },
    {
      text: email,
      href: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? link(`mailto:${email}`)
        : '',
    },
    {
      text: phone,
      href: /\d/.test(phone) ? link(`tel:${phone.replace(/[^+\d]/g, '')}`) : '',
    },
    { text: formatUrlForDisplay(text(basics.url)), href: link(basics.url) },
    ...records(basics.profiles).map((profile) => ({
      text: join(
        profile.network,
        profile.username || formatUrlForDisplay(text(profile.url))
      ),
      href: link(profile.url),
    })),
  ].filter((contact) => contact.text);
  return {
    name: text(basics.name) || 'Resume',
    label: text(basics.label),
    summary: text(basics.summary),
    image: /^https?:\/\//i.test(text(basics.image)) ? link(basics.image) : '',
    contacts,
    sections,
    language,
    headingLanguage: copy.language,
    direction: /^(ar|fa|he|ur)(-|$)/.test(language) ? 'rtl' : 'ltr',
    settings: {
      singleColumn: preferences.layout === 'single',
      showPhoto: preferences.showPhoto === true,
      compact: preferences.density === 'compact',
      monochrome: preferences.monochrome === true,
    },
  };
}
