import { SkillCatalog } from '@repo/careers';
import { Effect, Layer } from 'effect';

/**
 * TEMPORARY, until @repo/careers's SkillCatalogLive (the shared skill
 * vocabulary) is merged: replace this export with that layer. Until then it
 * fails to build, so the job-roles step after the pipeline is skipped (and
 * logged) rather than writing skills without the real vocabulary.
 */
export const CareerSkills = Layer.effect(
  SkillCatalog,
  Effect.die('SkillCatalogLive is not merged yet')
);
