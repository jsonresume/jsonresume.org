// Base types
export type {
  Iso8601,
  Location,
  Profile,
  Skill,
  Language,
  Interest,
  Meta,
  Reference,
  Basics,
} from './types/base-types';

// Work types
export type { Volunteer, Work } from './types/work-types';

// Education types
export type {
  EducationProps,
  Certificate,
  Award,
  Publication,
} from './types/education-types';

// Project types
export type { Project } from './types/project-types';

// Main Resume type
import type { Basics } from './types/base-types';
import type { Work, Volunteer } from './types/work-types';
import type {
  EducationProps,
  Certificate,
  Award,
  Publication,
} from './types/education-types';
import type { Project } from './types/project-types';
import type {
  Skill,
  Language,
  Interest,
  Reference,
  Meta,
} from './types/base-types';

export interface Resume {
  /**
   * link to the version of the schema that can validate the resume
   */
  $schema?: string;
  basics?: Basics;
  work?: Work[];
  volunteer?: Volunteer[];
  education?: EducationProps[];
  /**
   * Specify any awards you have received throughout your professional career
   */
  awards?: Award[];
  /**
   * Specify any certificates you have received throughout your professional career
   */
  certificates?: Certificate[];
  /**
   * Specify your publications through your career
   */
  publications?: Publication[];
  /**
   * List out your professional skill-set
   */
  skills?: Skill[];
  /**
   * List any other languages you speak
   */
  languages?: Language[];
  interests?: Interest[];
  /**
   * List references you have received
   */
  references?: Reference[];
  /**
   * Specify career projects
   */
  projects?: Project[];
  /**
   * The schema version and any other tooling configuration lives here
   */
  meta?: Meta;
}
