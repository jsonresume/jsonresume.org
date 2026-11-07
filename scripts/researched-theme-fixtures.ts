import { readFile } from 'node:fs/promises';
import { Schema } from 'effect';

export const researchedSlugs = [
  'harvard-classic',
  'jake-technical',
  'awesome-professional',
  'stockholm',
  'dublin',
  'deedy',
  'alta',
  'new-york-corporate',
  'academic-classic',
  'europass-inspired',
];
type Data = Readonly<Record<string, unknown>>;
const decode = Schema.decodeUnknownSync(
  Schema.Record(Schema.String, Schema.Unknown)
);

export async function themeFixtures(): Promise<Record<string, Data>> {
  const raw: unknown = JSON.parse(
    await readFile(
      new URL('../packages/sample-data/complete-resume.json', import.meta.url),
      'utf8'
    )
  );
  const complete = decode(raw);
  return {
    complete,
    sparse: {
      basics: { name: 'Ada Lovelace', label: 'Mathematician & researcher' },
    },
    wrapping: {
      ...complete,
      basics: {
        name: 'Alexandria-Nkemdilim María van der Westhuizen',
        label: 'Principal engineer · Distributed systems & accessibility',
        email: 'alexandria.nkemdilim.vanderwesthuizen@example.com',
        url: `https://example.com/${'long-portfolio-address-'.repeat(10)}`,
        summary:
          'Building dependable software for people, across teams, languages and time zones.',
        location: { city: 'São Paulo', region: 'São Paulo', countryCode: 'BR' },
      },
      projects: [
        {
          name: 'DistributedInternationalAccessibilityInfrastructure'.repeat(4),
          summary: 'A project with an intentionally long title and URL.',
          url: 'https://example.com/project',
          highlights: [
            'Long content must wrap inside its column without truncation.',
          ],
        },
      ],
    },
    international: {
      basics: {
        name: 'ليلى حسن · Léa Hassan',
        label: 'Ingénieure de recherche',
        summary:
          'Recherche appliquée, systèmes distribués et conception accessible.',
        email: 'lea@example.com',
        location: { city: 'Montréal', countryCode: 'CA' },
      },
      work: [
        {
          name: 'Institut de recherche',
          position: 'Chercheuse',
          startDate: '2020-03',
          summary: 'Collaboration avec des équipes internationales.',
          highlights: ['日本語の研究プロジェクト · العربية · Ελληνικά'],
        },
      ],
      skills: [{ name: 'Recherche', keywords: ['Python', 'Statistiques'] }],
      languages: [{ language: 'Français', fluency: 'Courant' }],
      meta: { language: 'fr-CA' },
    },
    dense: {
      ...complete,
      work: Array.from({ length: 12 }, (_, index) => ({
        name: `Organisation ${index + 1}`,
        position: `Principal engineer ${index + 1}`,
        startDate: String(2025 - index),
        endDate: String(2026 - index),
        summary:
          index === 0
            ? Array.from(
                { length: 14 },
                () =>
                  'Led an international engineering team building reliable public infrastructure. The programme improved access and reduced operational cost while maintaining service availability.'
              ).join('\n\n')
            : 'Led product and infrastructure delivery across several teams.',
        highlights: [
          'Delivered measurable improvements in reliability and accessibility.',
          `DENSE-SENTINEL-${index + 1}`,
        ],
      })),
    },
    preferences: {
      ...complete,
      meta: {
        language: 'de',
        researchThemes: {
          layout: 'single',
          sectionOrder: ['skills', 'education'],
          density: 'compact',
          monochrome: true,
        },
      },
    },
  };
}
