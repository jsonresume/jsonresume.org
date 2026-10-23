# @repo/api-client

`@repo/api` from the browser. `ApiClient` is an `AtomHttpApi` service over
the same origin; `sessionAtom`, `accountAtom`, `overviewAtom(range)` and the
other atoms are its queries, and `signInAtom`, `saveResumeAtom` and so on
its mutations (they refresh queries through `keys`). `errorTag` and
`usernameReason` read a failed request. `useIsClient` keeps API calls out
of server rendering; `@repo/api-client/hints` has `useSignedInHint`, which
reads the readable cookie set beside the session and pulls in no Effect.
