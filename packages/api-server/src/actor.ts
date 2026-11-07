import { userActor, type Actor } from '@repo/resume-versions';
import { Context } from 'effect';

/**
 * Who a request saves as, for the resume's history: the signed-in user
 * unless a Bearer middleware says otherwise (an API key or an OAuth app,
 * by id and name).
 */
export const RequestActor = Context.Reference<Actor>(
  '@repo/api-server/RequestActor',
  { defaultValue: () => userActor }
);
