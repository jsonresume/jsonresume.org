import type { Iso8601 } from './base-types';

export interface EducationProps {
  /**
   * e.g. Massachusetts Institute of Technology
   */
  institution?: string;
  /**
   * e.g. http://facebook.example.com
   */
  url?: string;
  /**
   * e.g. Arts
   */
  area?: string;
  /**
   * e.g. Bachelor
   */
  studyType?: string;
  startDate?: Iso8601;
  endDate?: Iso8601;
  /**
   * grade point average, e.g. 3.67/4.0
   */
  score?: string;
  /**
   * List notable courses/subjects
   */
  courses?: string[];
  [k: string]: unknown;
}

export interface Certificate {
  /**
   * e.g. Certified Kubernetes Administrator
   */
  name?: string;
  /**
   * e.g. 1989-06-12
   */
  date?: string;
  /**
   * e.g. http://example.com
   */
  url?: string;
  /**
   * e.g. CNCF
   */
  issuer?: string;
}

export interface Award {
  /**
   * e.g. One of the 100 greatest minds of the century
   */
  title?: string;
  date?: Iso8601;
  /**
   * e.g. Time Magazine
   */
  awarder?: string;
  /**
   * e.g. Received for my work with Quantum Physics
   */
  summary?: string;
}

export interface Publication {
  /**
   * e.g. The World Wide Web
   */
  name?: string;
  /**
   * e.g. IEEE, Computer Magazine
   */
  publisher?: string;
  releaseDate?: Iso8601;
  /**
   * e.g. http://www.computer.org.example.com/csdl/mags/co/1996/10/rx069-abs.html
   */
  url?: string;
  /**
   * Short summary of publication. e.g. Discussion of the World Wide Web, HTTP, HTML.
   */
  summary?: string;
}
