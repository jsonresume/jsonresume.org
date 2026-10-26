import type { McpToolInfo } from './catalog';

/** The catalog's apps tools: connected apps, and OAuth apps of your own. */
export const appTools: ReadonlyArray<McpToolInfo> = [
  {
    name: 'list_connected_apps',
    group: 'apps',
    description:
      'The apps and agents you have let use your resume with OAuth (ChatGPT, Claude, an HR tool…): what each may do (its scopes), when you connected it and when it was last used.',
    writes: false,
  },
  {
    name: 'disconnect_app',
    group: 'apps',
    description:
      'Disconnect an app from list_connected_apps by its client_id: its tokens stop working at once. Ask the user first; it can’t be undone, though they can connect it again.',
    writes: true,
  },
  {
    name: 'list_oauth_apps',
    group: 'apps',
    description:
      'The OAuth apps you have registered for your own product (“Sign in with JSON Resume”), with client IDs, redirect URIs and how many people connected each.',
    writes: false,
  },
  {
    name: 'create_oauth_app',
    group: 'apps',
    description:
      'Register an OAuth app so your product (an ATS, job board or HR tool) can offer “Sign in with JSON Resume”. Returns its client_id and client_secret; the secret is shown only this once, so give it to the user to keep on their server. Guide: https://jsonresume.org/developers',
    writes: true,
  },
  {
    name: 'new_oauth_app_secret',
    group: 'apps',
    description:
      'Make a new client secret for one of your OAuth apps; the old one stops working at once. Ask the user first.',
    writes: true,
  },
  {
    name: 'delete_oauth_app',
    group: 'apps',
    description:
      'Delete one of your OAuth apps: everyone who connected it is disconnected. Ask the user first; it can’t be undone.',
    writes: true,
  },
];
