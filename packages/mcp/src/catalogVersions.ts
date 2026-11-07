import type { McpToolInfo } from './catalog';

/** The catalog's resume history tools (every save is a version). */
export const versionTools: ReadonlyArray<McpToolInfo> = [
  {
    name: 'list_versions',
    group: 'resume',
    description:
      'Your resume’s history, newest first: every save is a version, with when, who made it (you, an app, an assistant such as this one, or a restore) and what changed since the one before ("work[0].highlights changed"). 20 at a time; pass next as before for older ones.',
    writes: false,
  },
  {
    name: 'get_version',
    group: 'resume',
    description:
      'One version of your resume from list_versions, as the JSON Resume it was then.',
    writes: false,
  },
  {
    name: 'restore_version',
    group: 'resume',
    description:
      'Bring back an old version of your resume: its JSON is saved again as the newest version (to your gist when your page reads from it). It replaces what your page shows now, so ask the user first; the version it replaces stays in the history.',
    writes: true,
  },
];
