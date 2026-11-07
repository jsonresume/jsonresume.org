export type Data = Readonly<Record<string, unknown>>;
export type SectionId =
  | 'work'
  | 'projects'
  | 'education'
  | 'volunteer'
  | 'awards'
  | 'certificates'
  | 'publications'
  | 'skills'
  | 'languages'
  | 'interests'
  | 'references';

export interface Entry {
  title: string;
  context: string;
  date: string;
  url: string;
  location: string;
  paragraphs: string[];
  highlights: string[];
  details: string[];
}

export interface DocumentModel {
  name: string;
  label: string;
  summary: string;
  image: string;
  contacts: { text: string; href: string }[];
  sections: { id: SectionId; title: string; entries: Entry[] }[];
  language: string;
  headingLanguage: string;
  direction: 'ltr' | 'rtl';
  settings: {
    singleColumn: boolean;
    showPhoto: boolean;
    compact: boolean;
    monochrome: boolean;
  };
}

export interface ThemeOptions {
  slug: string;
  className: string;
  layout:
    | 'single'
    | 'right'
    | 'left'
    | 'deedy'
    | 'achievement'
    | 'timeline'
    | 'academic'
    | 'european';
  fonts: string[];
  css: string;
  sectionOrder?: SectionId[];
  sidebarSections?: SectionId[];
}
