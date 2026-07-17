/**
 * Unified job-states hook (read/interested/hidden).
 *
 * Barrel re-export: the implementation lives in ./jobStates/* to keep each
 * module focused and under the 200-line file policy.
 *   - localStorage: anonymous-user persistence helpers
 *   - api:          authenticated-user server sync (fetch calls)
 *   - stateHelpers: pure transforms over the states map
 *   - useJobStates: the hook shell wiring it all together
 */
export { useJobStates, default } from './jobStates/useJobStates';
