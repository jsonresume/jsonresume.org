import { entries, text, texts } from '@repo/resume-formats/read';
import type { Entry } from '@repo/resume-formats/read';

/** Where resumes are served; canonical links always name it. */
export const SITE = 'https://jsonresume.org';

/** The clean URL of a resume page, whatever its query string. */
export const canonicalUrl = (username: string) => `${SITE}/@${username}`;

const webUrl = (value: unknown) => {
  const url = text(value);
  return url && /^https?:\/\/[^\s"'<>]+$/i.test(url) ? url : undefined;
};

/** At most `max` characters, cut at a word. */
export const clip = (value: string, max: number) => {
  const flat = value.replace(/\s+/g, ' ').trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max / 2))}…`;
};

const unique = (values: ReadonlyArray<string>) => [...new Set(values)];

/** What a resume says about its owner, as its page shows it. */
export interface Profile {
  username: string;
  name: string;
  label?: string;
  summary?: string;
  /** An https photo, when the resume has one. */
  image?: string;
}

const basicsOf = (resume: unknown): Entry =>
  entries([entries([resume])[0]?.['basics']])[0] ?? {};

export const profileOf = (username: string, resume: unknown): Profile => {
  const basics = basicsOf(resume);
  const label = text(basics['label']);
  const summary = text(basics['summary']);
  const photo = webUrl(basics['image']);
  const image = photo?.startsWith('https:') ? photo : undefined;
  return {
    username,
    name: text(basics['name']) ?? `@${username}`,
    ...(label ? { label } : {}),
    ...(summary ? { summary } : {}),
    ...(image ? { image } : {}),
  };
};

/**
 * Schema.org ProfilePage data for a resume page, its Person built from the
 * resume's public parts only: name, headline, photo, town (never the
 * street, postcode, email or phone), links, current employers, schools and
 * skills.
 */
export const profilePage = (username: string, resume: unknown) => {
  const doc = entries([resume])[0] ?? {};
  const basics = basicsOf(resume);
  const profile = profileOf(username, resume);
  const url = canonicalUrl(username);
  const place = entries([basics['location']])[0];
  const address = place && {
    '@type': 'PostalAddress',
    ...(text(place['city']) ? { addressLocality: text(place['city']) } : {}),
    ...(text(place['region']) ? { addressRegion: text(place['region']) } : {}),
    ...(text(place['countryCode'])
      ? { addressCountry: text(place['countryCode']) }
      : {}),
  };
  const sameAs = unique(
    [
      webUrl(basics['url']),
      ...entries(basics['profiles']).map((p) => webUrl(p['url'])),
    ].flatMap((u) => u ?? [])
  );
  const worksFor = unique(
    entries(doc['work'])
      .filter((w) => !text(w['endDate']))
      .flatMap((w) => text(w['name']) ?? [])
  ).map((name) => ({ '@type': 'Organization', name }));
  const alumniOf = unique(
    entries(doc['education']).flatMap((e) => text(e['institution']) ?? [])
  ).map((name) => ({ '@type': 'EducationalOrganization', name }));
  const knowsAbout = unique(
    entries(doc['skills']).flatMap((s) =>
      [text(s['name']), ...texts(s['keywords'])].flatMap((k) => k ?? [])
    )
  ).slice(0, 30);
  const person = {
    '@type': 'Person',
    '@id': `${url}#person`,
    name: profile.name,
    url,
    alternateName: `@${username}`,
    ...(profile.label ? { jobTitle: profile.label } : {}),
    ...(profile.summary ? { description: clip(profile.summary, 500) } : {}),
    ...(profile.image ? { image: profile.image } : {}),
    ...(address && Object.keys(address).length > 1 ? { address } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(worksFor.length > 0 ? { worksFor } : {}),
    ...(alumniOf.length > 0 ? { alumniOf } : {}),
    ...(knowsAbout.length > 0 ? { knowsAbout } : {}),
  };
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url,
    name: `${profile.name} · JSON Resume`,
    mainEntity: person,
  };
};
