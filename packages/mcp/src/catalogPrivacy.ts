import type { McpToolInfo } from './catalog';

/** The catalog's privacy tools: contact details kept off the public page. */
export const privacyTools: ReadonlyArray<McpToolInfo> = [
  {
    name: 'get_hidden_fields',
    group: 'account',
    description:
      'Which contact details stay off your public page and its formats (.json, .pdf, .docx and the rest): any of email, phone and address (the street and postcode; the town stays). You still see them in your own resume.',
    writes: false,
  },
  {
    name: 'set_hidden_fields',
    group: 'account',
    description:
      'Choose the contact details to keep off your public page: pass every one to hide (email, phone, address), or an empty list to show them all. Your resume itself keeps them.',
    writes: true,
  },
];
