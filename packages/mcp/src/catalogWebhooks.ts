import type { McpToolInfo } from './catalog';

/** The catalog's webhook tools (@repo/webhooks). */
export const webhookTools: ReadonlyArray<McpToolInfo> = [
  {
    name: 'set_app_webhook',
    group: 'apps',
    description:
      'Have one of your OAuth apps (from list_oauth_apps) told when a person who connected it changes their resume: resume.updated is POSTed to an https URL, signed with the secret this returns (JSONResume-Signature: t=…,v1=HMAC-SHA256 of "t.body"), and retried for a day. Pass url null to stop.',
    writes: true,
  },
];
