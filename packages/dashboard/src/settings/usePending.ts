import { Exit } from 'effect';
import { useEffect, useState } from 'react';

/**
 * A setting as the person just set it, until the server agrees: a switch
 * moves at once instead of after the round trip (people clicked again,
 * thinking it hadn't taken). A failed save puts it back.
 */
export const usePending = <T>(server: T) => {
  const [pending, setPending] = useState<{ value: T }>();
  useEffect(() => {
    if (pending && Object.is(pending.value, server)) setPending(undefined);
  }, [pending, server]);
  const change = async (
    value: T,
    save: () => Promise<Exit.Exit<unknown, unknown>>
  ) => {
    setPending({ value });
    if (Exit.isFailure(await save())) setPending(undefined);
  };
  return [pending ? pending.value : server, change] as const;
};
