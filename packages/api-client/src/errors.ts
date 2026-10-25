import { Cause, Exit, Option, Predicate } from 'effect';

const failure = (exit: Exit.Exit<unknown, unknown>): unknown =>
  Exit.isSuccess(exit)
    ? undefined
    : Option.getOrUndefined(Cause.findErrorOption(exit.cause));

/**
 * The tag of a failed request's error ("InvalidCredentials", ...), for
 * choosing a message; undefined when it succeeded. Network faults and
 * defects come back as "default".
 */
export function errorTag(
  exit: Exit.Exit<unknown, unknown>
): string | undefined {
  if (Exit.isSuccess(exit)) return undefined;
  const error = failure(exit);
  return Predicate.hasProperty(error, '_tag') && Predicate.isString(error._tag)
    ? error._tag
    : 'default';
}

/** The reason a username was refused, when that was the error. */
export function usernameReason(
  exit: Exit.Exit<unknown, unknown>
): string | undefined {
  const error = failure(exit);
  return Predicate.isTagged(error, 'UsernameUnavailable') &&
    Predicate.hasProperty(error, 'reason') &&
    Predicate.isString(error.reason)
    ? error.reason
    : undefined;
}
