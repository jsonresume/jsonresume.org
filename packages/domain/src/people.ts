import { Schema } from 'effect';
import { Href, IsoDate, NonEmptyText } from './common';

/** A person credited on the team page. */
export const TeamMember = Schema.Struct({
  name: NonEmptyText,
  github: NonEmptyText,
  avatar: Href,
  twitter: Schema.optionalKey(NonEmptyText),
});
export type TeamMember = typeof TeamMember.Type;

export const Team = Schema.Struct({
  coreTeam: Schema.Array(TeamMember),
  standardsCommittee: Schema.Array(TeamMember),
});
export type Team = typeof Team.Type;

/** A dated moment in the project's history, with its source. */
export const HistoryEvent = Schema.Struct({
  date: IsoDate,
  title: NonEmptyText,
  description: NonEmptyText,
  href: Href,
  source: NonEmptyText,
});
export type HistoryEvent = typeof HistoryEvent.Type;
