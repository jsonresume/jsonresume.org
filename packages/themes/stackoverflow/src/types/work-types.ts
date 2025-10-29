import type { Iso8601 } from './base-types';

export interface Volunteer {
  /**
   * e.g. Facebook
   */
  organization?: string;
  /**
   * e.g. Software Engineer
   */
  position?: string;
  /**
   * e.g. http://facebook.example.com
   */
  url?: string;
  startDate?: Iso8601;
  endDate?: Iso8601;
  /**
   * Give an overview of your responsibilities at the company
   */
  summary?: string;
  /**
   * Specify accomplishments and achievements
   */
  highlights?: string[];
}

export interface Work {
  /**
   * e.g. Facebook
   */
  name?: string;
  /**
   * e.g. Menlo Park, CA
   */
  location?: string;
  /**
   * e.g. Social Media Company
   */
  description?: string;
  /**
   * e.g. Software Engineer
   */
  position?: string;
  /**
   * e.g. http://facebook.example.com
   */
  url?: string;
  startDate?: Iso8601;
  endDate?: Iso8601;
  /**
   * Give an overview of your responsibilities at the company
   */
  summary?: string;
  /**
   * Specify multiple accomplishments
   */
  highlights?: string[];

  /**
   * List some keywords pertaining to this work experience
   */
  keywords?: string[];
}
