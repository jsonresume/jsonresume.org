import type { Iso8601 } from './base-types';

export interface Project {
  /**
   * e.g. The World Wide Web
   */
  name?: string;
  /**
   * Short summary of project. e.g. Collated works of 2017.
   */
  description?: string;
  /**
   * Specify multiple features
   */
  highlights?: string[];
  /**
   * Specify special elements involved
   */
  keywords?: string[];
  startDate?: Iso8601;
  endDate?: Iso8601;
  /**
   * e.g. http://www.computer.org/csdl/mags/co/1996/10/rx069-abs.html
   */
  url?: string;
  /**
   * Specify your role on this project or in company
   */
  roles?: string[];
  /**
   * Specify the relevant company/entity affiliations e.g. 'greenpeace', 'corporationXYZ'
   */
  entity?: string;
  /**
   *  e.g. 'volunteering', 'presentation', 'talk', 'application', 'conference'
   */
  type?: string;
}
