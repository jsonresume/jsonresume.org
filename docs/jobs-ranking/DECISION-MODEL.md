# The job decision model

Every open job gets a decision for each person: **apply**, **stretch**, **skip** or **ruled out**, with the reasons. Built November 2026 on the matching from October (eligibility by country, the AI's fit per post, level and pay caps, marks as Rocchio feedback) and the career graph's evidence and requirements. Measured against past decisions in [DECISIONS-REPLAY-2026-11.md](./DECISIONS-REPLAY-2026-11.md).

## Why a decision, and why this shape

- **Two questions, kept apart.** "A job I'd like" and "a job I can get" are different; the welfare-best ranking is expected surplus (the job's value to the person times the chance an application succeeds), and rankings on either alone, or on clicks and applications, are worse (Le Barbanchon et al., _A Job I Like or a Job I Can Get_, arXiv 2603.21699: field experiments with France's public employment service). Folding preference and qualification into one score muddies both (JobRec, arXiv 2602.03097). The AI's fit was one such score.
- **Screen, then weigh.** People rule options out on a few attributes, then trade off what's left (consider-then-choose; Gilbride & Allenby 2004: 92% of people screened). The CLI's decisions show it: "no digital video advertising" was given for 144 jobs, "no product or executive roles" for 87, "Texas" for 46.

## The model (`@repo/jobs` `decision/`, pure functions)

1. **Screen** (`screen.ts`): dealbreakers rule a job out, with the reason: not open where they live; a workplace they won't take; stated pay under their floor; employment or level they won't take; no visa when they need one; an industry they avoid; a required skill they'd rather not use. Unknowns pass.
2. **Chance** (`chance.ts`, 0–1): the AI's fit (0.55) and the share of the role's required skills the resume shows (0.45), each requirement credited for depth (evidence strength and recency) and years; a level above theirs lowers it. A requirement naming several skills ("React/TypeScript", "Go or Rust") counts as shown when the resume shows one (`skillChoices`; the Tree does the same). Kinds of work ("Backend", "AI") and qualifications ("5+ years") aren't skills, so they aren't counted (`needsOf`, careers' `isSkillKey`). A requirement the resume's evidence missed but its own text names ("LLMs" in "LLM-as-judge", "Agent harnesses" in "agent execution harness") counts as mentioned, as a listed skill does (`resumeMentions`, `withMentions`); one-word names must be written as names (capitals kept, not a sentence's first word or part of a title), so "oracle-verified" isn't Oracle and "Senior Software Engineer" isn't software. The Tree leaves those out of the gaps too.
3. **Appeal** (`appeal.ts`, `appealFactors.ts`, `appealSignals.ts`, 0–1 from 0.5): pay against their target, their favourite workplace, industries they love, company stage, skills they want or avoid, closeness to where they want to go (a z-score of the cosine), a step down or up, and how much more like the jobs they saved (and less like the ones they passed on) this job is than the other open jobs: a z-score of the Rocchio shift, ±0.10 over two standard deviations, nothing under half of one. Marks move every job's similarity by much the same amount, so only the difference says anything (until 2026-11-17 the raw shift gave every job the same boost). Their top three priorities multiply their factors by 1.6, 1.3 and 1.15.
4. **Decide** (`decide.ts`): ruled out, else **apply** (chance ≥ 0.62, appeal ≥ 0.45), **stretch** (chance ≥ 0.35, appeal ≥ 0.5), else **skip**. The list is ordered by value, `appeal × (0.5 + 0.5 × chance)`: what they'd want, discounted by the chance of getting it. Reasons are the strongest factors, for and against.
5. **Suggest** (`suggest.ts`): marks point to preferences they haven't stated: an industry passed on three times and never saved, one saved three times, remote work when every office job was passed on. Accepted or dismissed, never asked twice.

## Data

- **Company facts** (`app.job_facts`, `FactsReader`, `refreshFacts`): each open post's industries (a fixed list of 30), stage, team size and stated signals ("profitable since 2016"), read by gpt-5-mini 20 posts a call after each pipeline run.
- **Preferences** (`app.job_preferences`, every change in `app.job_preference_changes` with its source: you, a suggestion, the first-run questions, an agent).
- **Decisions** (`app.job_decisions`): the latest decision per person and job, kept when nothing is pending.
- **Marks** (`app.job_mark_events`): every mark, with the pass reason, where it was made (jobs page, job page, swipe, Tree, copilot, MCP), its position in the list, and the verdict, chance and appeal it was made against: the labelled data the next replay and any learned model need.

## Where it shows

- **/dashboard/jobs**: what you want (with the editor), suggestions from your marks, the four verdicts with their counts, each job with chance and appeal, the reasons, and save / applied / pass (pass asks why, in one tap).
- **MCP**: `decide_jobs`, `get_job_preferences`, `set_job_preferences`; `mark_job` takes the pass reason.
- **API**: `GET /api/me/job-decisions?wait=` (answers in 4 seconds by default, naming what is still being worked on), `GET`/`PUT /api/me/job-preferences`.
- **Pathways → Tree**: jobs a dealbreaker rules out are left off, and a missing skill counts for more when the jobs that need it are ones the person would want.

## Tracking (PostHog)

Server: `jobs_decided` (verdict counts, whether preferences are stated, suggestions, what is pending, milliseconds), `job_preferences_saved` (source, which preferences are set; never the free text), `job_marked` (mark, reason, source, position, and the verdict, chance and appeal shown). Browser: `jobs_view_changed`, `job_opened` (verdict, position, chance, appeal), `job_preferences_opened`, `job_suggestion_answered`.

## Next

- Replay again once `job_mark_events` holds a few hundred marks from many people; then fit the thresholds and weights, and a per-person logistic head as the July roadmap planned.
- Pathways: the stretch jobs a person would want are where a plan helps most; the Tree's gaps are now weighted toward them, and plans could start from a stretch job.
