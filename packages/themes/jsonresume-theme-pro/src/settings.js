// Presentation settings and controlled labels. Settings come from the
// optional, Pro-specific `meta.pro` object; they never render as content.

import { isObject } from './text.js';

export const DEFAULT_ORDER = [
  'work',
  'projects',
  'education',
  'certificates',
  'awards',
  'publications',
  'volunteer',
  'skills',
  'languages',
  'interests',
  'references',
];

export const LABELS_EN = {
  months: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  present: 'Present',
  from: 'From',
  until: 'Until',
  resume: 'Résumé',
  contact: 'Contact',
  profiles: 'Links',
  score: 'Score',
  courses: 'Courses',
  expires: 'Expires',
  credential: 'Credential',
  volume: 'Vol.',
  issue: 'No.',
  pages: 'pp.',
  onRequest: 'Available on request',
  sections: {
    work: 'Experience',
    projects: 'Projects',
    education: 'Education',
    certificates: 'Certifications',
    awards: 'Awards',
    publications: 'Publications',
    volunteer: 'Volunteer Experience',
    skills: 'Skills',
    languages: 'Languages',
    interests: 'Interests',
    references: 'References',
  },
};

/**
 * Resolves settings without touching the input:
 * - sectionOrder: supported section keys listed first, in the given order;
 *   unlisted sections follow in default order (listing is not hiding).
 * - showPortrait / showFullAddress: false unless explicitly true.
 */
export function resolveSettings(resume, diagnostics) {
  const raw = isObject(resume?.meta?.pro) ? resume.meta.pro : {};
  const order = [];
  if (Array.isArray(raw.sectionOrder)) {
    for (const key of raw.sectionOrder) {
      if (DEFAULT_ORDER.includes(key) && !order.includes(key)) order.push(key);
      else
        diagnostics.push(`Ignored sectionOrder entry ${JSON.stringify(key)}`);
    }
  }
  for (const key of DEFAULT_ORDER) if (!order.includes(key)) order.push(key);
  return {
    sectionOrder: order,
    showPortrait: raw.showPortrait === true,
    showFullAddress: raw.showFullAddress === true,
  };
}

/** BCP 47 tag from meta.language (#288) when well formed, else "en". */
export function documentLanguage(resume) {
  const tag = resume?.meta?.language;
  return typeof tag === 'string' &&
    /^[a-z]{2,3}(-[a-z0-9]{1,8})*$/i.test(tag.trim())
    ? tag.trim()
    : 'en';
}
