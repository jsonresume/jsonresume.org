/** Shared shapes for page content. Text fields may contain Markdown links. */

export interface Link {
  label: string;
  href: string;
}

export interface Step {
  title: string;
  /** Markdown, one or two sentences. */
  body: string;
  code?: string;
}

export interface Card {
  title: string;
  description: string;
  href: string;
  eyebrow?: string;
}

/** A URL on the registry built from a GitHub username, e.g. 'thomasdavis.json'. */
export type UserPath = (username: string) => string;
