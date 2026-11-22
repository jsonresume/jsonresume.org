import { Schema } from 'effect';

/** Why a job was passed on. */
export const PassReason = Schema.Literals([
  'pay',
  'place',
  'sector',
  'stack',
  'level',
  'company',
  'role',
  'other',
]);
export type PassReason = typeof PassReason.Type;

/** Where a mark was made. */
export const MarkSource = Schema.Literals([
  'jobs',
  'job_page',
  'swipe',
  'tree',
  'copilot',
  'mcp',
]);
export type MarkSource = typeof MarkSource.Type;

/** Why a job was passed on, as the person says it. */
export const passReasonLabels: Record<PassReason, string> = {
  pay: 'Pay',
  place: 'Location',
  sector: 'Industry',
  stack: 'Tech stack',
  level: 'Level',
  company: 'Company',
  role: 'Kind of role',
  other: 'Something else',
};
