import { HistoryEvent, Project, ProjectCategory, Team } from '@repo/domain';
import { Schema } from 'effect';
import { decodeContent } from './decode';
import historyJson from './data/history.json';
import projectsJson from './data/projects.json';
import teamJson from './data/team.json';

/** Community projects built on JSON Resume, in directory order. */
export const projects: ReadonlyArray<Project> = decodeContent(
  Schema.Array(Project)
)(projectsJson);

/** Categories in the order the directory shows them. */
export const projectCategories: ReadonlyArray<ProjectCategory> =
  ProjectCategory.literals;

export const team: Team = decodeContent(Team)(teamJson);

/** The project's documented history, oldest first. */
export const history: ReadonlyArray<HistoryEvent> = [
  ...decodeContent(Schema.Array(HistoryEvent))(historyJson),
].sort((a, b) => a.date.localeCompare(b.date));
