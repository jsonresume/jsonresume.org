import type { McpToolInfo } from './catalog';

/** The catalog's privacy tools: contact details kept off the public page, or the whole page. */
export const privacyTools: ReadonlyArray<McpToolInfo> = [
  {
    name: 'get_hidden_fields',
    group: 'account',
    description:
      'Which contact details stay off your public page and its formats (.json, .pdf, .docx and the rest): any of email, phone and address (the street and postcode; the town stays). You still see them in your own resume. Also says whether the whole page is private.',
    writes: false,
  },
  {
    name: 'set_hidden_fields',
    group: 'account',
    description:
      'Choose the contact details to keep off your public page: pass every one to hide (email, phone, address), or an empty list to show them all. Your resume itself keeps them.',
    writes: true,
  },
  {
    name: 'set_page_private',
    group: 'account',
    description:
      'Keep your whole page to yourself, or show it again. Private: /@username and its formats answer only to you, signed in, and it leaves Explore and search. Your account, editor, jobs and these tools keep working.',
    writes: true,
  },
];
