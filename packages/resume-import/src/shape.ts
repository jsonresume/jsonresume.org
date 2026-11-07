import { Schema } from 'effect';

/**
 * What the model fills: JSON Resume's sections and fields, every one
 * present (null or empty when the resume doesn't say), as OpenAI's strict
 * structured output needs. `compact` turns it into a plain resume.
 */
const Text = Schema.NullOr(Schema.String);
const Texts = Schema.Array(Schema.String);

const Location = Schema.Struct({
  address: Text,
  postalCode: Text,
  city: Text,
  countryCode: Text,
  region: Text,
});

const Basics = Schema.Struct({
  name: Text,
  label: Text,
  email: Text,
  phone: Text,
  url: Text,
  summary: Text,
  location: Location,
  profiles: Schema.Array(
    Schema.Struct({ network: Text, username: Text, url: Text })
  ),
});

const Dated = { startDate: Text, endDate: Text };

const Work = Schema.Struct({
  name: Text,
  position: Text,
  location: Text,
  url: Text,
  ...Dated,
  summary: Text,
  highlights: Texts,
});

const Volunteer = Schema.Struct({
  organization: Text,
  position: Text,
  url: Text,
  ...Dated,
  summary: Text,
  highlights: Texts,
});

const Education = Schema.Struct({
  institution: Text,
  url: Text,
  area: Text,
  studyType: Text,
  ...Dated,
  score: Text,
  courses: Texts,
});

const Project = Schema.Struct({
  name: Text,
  description: Text,
  url: Text,
  ...Dated,
  highlights: Texts,
  keywords: Texts,
  roles: Texts,
});

export const ReadResume = Schema.Struct({
  basics: Basics,
  work: Schema.Array(Work),
  volunteer: Schema.Array(Volunteer),
  education: Schema.Array(Education),
  awards: Schema.Array(
    Schema.Struct({ title: Text, date: Text, awarder: Text, summary: Text })
  ),
  certificates: Schema.Array(
    Schema.Struct({ name: Text, date: Text, issuer: Text, url: Text })
  ),
  publications: Schema.Array(
    Schema.Struct({
      name: Text,
      publisher: Text,
      releaseDate: Text,
      url: Text,
      summary: Text,
    })
  ),
  skills: Schema.Array(
    Schema.Struct({ name: Text, level: Text, keywords: Texts })
  ),
  languages: Schema.Array(Schema.Struct({ language: Text, fluency: Text })),
  interests: Schema.Array(Schema.Struct({ name: Text, keywords: Texts })),
  references: Schema.Array(Schema.Struct({ name: Text, reference: Text })),
  projects: Schema.Array(Project),
});

/** The model's reply: the resume, and the fields it is less than sure of. */
export const ModelReply = Schema.Struct({
  resume: ReadResume,
  unsure: Schema.Array(
    Schema.Struct({
      /** A JSON pointer into resume, e.g. /work/0/startDate. */
      path: Schema.String,
      confidence: Schema.Literals(['medium', 'low']),
    })
  ),
});
export type ModelReply = typeof ModelReply.Type;
