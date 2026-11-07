import type { SectionId } from './types.js';

export const order: SectionId[] = [
  'work',
  'projects',
  'education',
  'skills',
  'certificates',
  'volunteer',
  'awards',
  'publications',
  'languages',
  'interests',
  'references',
];
const en = [
  'Experience',
  'Projects',
  'Education',
  'Skills',
  'Certifications',
  'Volunteer experience',
  'Awards',
  'Publications',
  'Languages',
  'Interests',
  'References',
];
const translations: Record<string, { sections: string[]; present: string }> = {
  en: { sections: en, present: 'Present' },
  fr: {
    sections: [
      'Expérience',
      'Projets',
      'Formation',
      'Compétences',
      'Certifications',
      'Bénévolat',
      'Distinctions',
      'Publications',
      'Langues',
      'Centres d’intérêt',
      'Références',
    ],
    present: 'Aujourd’hui',
  },
  de: {
    sections: [
      'Berufserfahrung',
      'Projekte',
      'Ausbildung',
      'Kenntnisse',
      'Zertifikate',
      'Ehrenamt',
      'Auszeichnungen',
      'Publikationen',
      'Sprachen',
      'Interessen',
      'Referenzen',
    ],
    present: 'Heute',
  },
  es: {
    sections: [
      'Experiencia',
      'Proyectos',
      'Educación',
      'Competencias',
      'Certificaciones',
      'Voluntariado',
      'Premios',
      'Publicaciones',
      'Idiomas',
      'Intereses',
      'Referencias',
    ],
    present: 'Actualidad',
  },
};

export function labels(language: string) {
  const chosen =
    translations[language.split('-')[0] ?? 'en'] ?? translations.en;
  return {
    language: translations[language.split('-')[0] ?? 'en'] ? language : 'en',
    present: chosen?.present ?? 'Present',
    section: (id: SectionId) => chosen?.sections[order.indexOf(id)] ?? id,
  };
}
