import type { McpToolInfo } from './catalog';

/** The catalog's apps directory tools (jsonresume.org/apps). */
export const directoryTools: ReadonlyArray<McpToolInfo> = [
  {
    name: 'list_app_directory',
    group: 'apps',
    description:
      'The apps directory at jsonresume.org/apps: apps people can connect their resume to, each with what it does, its homepage and how many people connected it, most used first.',
    writes: false,
  },
  {
    name: 'set_app_listing',
    group: 'apps',
    description:
      'List one of your OAuth apps (from list_oauth_apps) in the apps directory, or take it out. A listed app needs a homepage and a line saying what it does.',
    writes: true,
  },
];
