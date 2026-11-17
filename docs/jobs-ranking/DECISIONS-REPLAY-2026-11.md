# Replaying past decisions against the decision model (November 2026)

**What:** every job @thomasdavis marked in the jobs CLI (`public.pathways_job_feedback`, January to October 2026) that still exists in `app.jobs` with a parsed post and an embedding, scored by today's ranking and by the decision model, and measured by how well each puts the jobs they wanted (interested or applied) above the ones they passed on (not interested). "Maybe" is left out.

**How:** `apps/app/scripts/replay-decisions.ts`, against a read-only connection; the models (fits, company facts, roles) run in memory and nothing is written. Marks are not fed to the ranking (they are what is predicted). Preferences are only what the July roadmap wrote down for this candidate (`ROADMAP.md` §1): remote (anywhere or AEST-friendly), a $150k floor, a $180k target, and "senior AI and TypeScript engineering: agents, developer tools, open source" as the direction.

**Data:** 131 decisions: 43 wanted, 88 passed on (base rate 33%). The resume shows 92 skills.

## Results

AUC is the chance a wanted job ranks above a passed one (0.5 is a coin flip). The models (fits, facts, roles) vary between runs, so the baselines are given as the range over six runs; the decision model's row is the final model over its two runs.

| Ranking                                                       | AUC       | Wanted in top 10 | Wanted in top 20 |
| ------------------------------------------------------------- | --------- | ---------------- | ---------------- |
| Cosine (embeddings alone)                                     | 0.46      | 20%              | 20%              |
| Today's engine (the AI's fit, capped by level, pay and place) | 0.60–0.65 | 30–70%           | 45–65%           |
| Decision model, no preferences                                | 0.60–0.63 | 40–70%           | 45–55%           |
| Decision model, stated preferences (final)                    | **0.75**  | **70–80%**       | **65–80%**       |

The final model recomputed on the previous run's rows scored 0.77. Its verdicts sort the decisions: of the jobs it called **apply**, 44% were wanted; **stretch** 50%; **skip** 14%; **ruled out** 20% (base rate 33%).

## What changed because of it

- **Value is appeal discounted by chance, not chance × appeal.** Chance times appeal scored 0.70; `appeal × (0.5 + 0.5 × chance)` scored 0.75 (top 20: 60% → 70%). The labels say what they wanted, not what they could get, so a chance that varies with the models swamped the signal; a long shot is still worth something (the expected-surplus argument of Le Barbanchon et al.).
- **Direction is a z-score among the open jobs, weighed gently.** As a fixed cut-off on the cosine it marked 95% of wanted and 85% of passed jobs "where you want to go". Alone, the stated direction predicts little (AUC 0.55): it is the roadmap's words, not theirs. At ±0.10 over two standard deviations the decision AUC is 0.77, and stays there for nearby weights (0.77–0.78), so it is not a tuned peak.
- **Pay is the strongest stated signal:** "at or above your target" was on 51% of wanted jobs and 11% of passed ones.

## Re-run after the review fixes (2026-11-17)

Kinds of work left out of the required skills and combined requirements credited by their parts: the decision model with stated preferences scored **0.75** (top 10: 80%, top 20: 75%), today's engine 0.61 in the same run. Stretch now sorts better: 55% of stretch jobs were wanted (was 37–50%), skip 16%. The marks' z-score isn't replayed (marks are what is predicted).

## Caveats

- One person's decisions. It shows whether the structure works, not the best weights for everyone; `job_mark_events` now stores every mark with the decision it was made against, so the next replay has many people.
- Of the 5 wanted jobs ruled out, 4 were "not open to people where you live": interest in jobs they can't take. Today's engine already leaves those out.
- The resume is today's, the decisions were made over ten months.
