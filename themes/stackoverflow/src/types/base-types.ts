export type Iso8601 = string;

export interface Location {
  /**
   * To add multiple address lines, use
   * . For example, 1234 Glücklichkeit Straße
   * Hinterhaus 5. Etage li.
   */
  address?: string;
  postalCode?: string;
  city?: string;
  /**
   * code as per ISO-3166-1 ALPHA-2, e.g. US, AU, IN
   */
  countryCode?: string;
  /**
   * The general region where you live. Can be a US state, or a province, for instance.
   */
  region?: string;
}

export interface Profile {
  /**
   * e.g. Facebook or Twitter
   */
  network?: string;
  /**
   * e.g. neutralthoughts
   */
  username?: string;
  /**
   * e.g. http://twitter.example.com/neutralthoughts
   */
  url?: string;
}

export interface Skill {
  /**
   * e.g. Web Development
   */
  name?: string;
  /**
   * e.g. Master
   */
  level?: string;
  /**
   * List some keywords pertaining to this skill
   */
  keywords?: string[];
}

export interface Language {
  /**
   * e.g. English, Spanish
   */
  language?: string;
  /**
   * e.g. Fluent, Beginner
   */
  fluency?: string;
}

export interface Interest {
  /**
   * e.g. Philosophy
   */
  name?: string;
  keywords?: string[];
}

export interface Meta {
  /**
   * URL (as per RFC 3986) to latest version of this document
   */
  canonical?: string;
  /**
   * A version field which follows semver - e.g. v1.0.0
   */
  version?: string;
  /**
   * Using ISO 8601 with YYYY-MM-DDThh:mm:ss
   */
  lastModified?: string;
}

export interface Reference {
  /**
   * e.g. Timothy Cook
   */
  name?: string;
  /**
   * e.g. Joe blogs was a great employee, who turned up to work at least once a week. He exceeded my expectations when it came to doing nothing.
   */
  reference?: string;
}

export interface Basics {
  name?: string;
  /**
   * e.g. Web Developer
   */
  label?: string;
  /**
   * URL (as per RFC 3986) to a image in JPEG or PNG format
   */
  image?: string;
  /**
   * e.g. thomas@gmail.com
   */
  email?: string;
  /**
   * Phone numbers are stored as strings so use any format you like, e.g. 712-117-2923
   */
  phone?: string;
  /**
   * URL (as per RFC 3986) to your website, e.g. personal homepage
   */
  url?: string;
  /**
   * Write a short 2-3 sentence biography about yourself
   */
  summary?: string;
  location?: Location;
  /**
   * Specify any number of social networks that you participate in
   */
  profiles?: Profile[];
}
