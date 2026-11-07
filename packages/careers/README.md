# @repo/careers

The career graph behind Pathways → Tree, and the data it stands on:

- **Skills** (`app.skills`, `app.skill_aliases`): one vocabulary; names as
  resumes and posts write them resolve to one skill: by key (`skillKey`
  from `@repo/jobs`: case, punctuation and known aliases folded, so "ML"
  is "Machine Learning"), then a learned alias, then meaning. Each shows
  its known name (`skillName`, from the one list in
  `@repo/jobs/src/skillAliases.ts`), else the name as first written. Known
  and very short names ("C", "R", "Go") are never matched by meaning.
  `mergeSkills` (run by the jobs pipeline) folds skills stored under keys
  that now read as one, moving their evidence and requirements, so a
  change to the folding or the list needs no re-reading by a model.
- **Resume insights** (`app.resume_insights`, `app.resume_evidence`): a model
  reads each resume version once: the evidence for each skill (with the
  resume's words), strengths, each entry's role family.
- **Job roles** (`app.job_roles`, `app.job_requirements`, `app.role_archetypes`):
  the roles in each post, what each requires, and role families as the open
  jobs show them.
- **Career moves** (`app.title_families`, `app.career_moves`): where people go
  next, from every public resume.
- **Plans** (`app.pathway_plans`, `app.plan_steps`) and **snapshots**
  (`app.tree_snapshots`).

`families.ts` is the one role-family vocabulary everything above shares.
Contracts are in `services.ts`; each live layer is in its own file.

**Speed.** Two model steps stand behind a graph: the resume's reading and
the jobs' fits (`@repo/jobs`, judged per resume version). Each runs once per
content hash at a time (`sharedRuns`): a graph, an MCP call and a prepare
asking for the same version share one run. `CareerGraphs.prepare` starts
them before anyone asks, at most one run per user: a save (`ResumeSaved` in
`@repo/accounts`, any route) waits 25s for a burst of saves to settle and
replaces the user's work for an older version, stopping its model calls;
the dashboard opening starts at once unless work is pending. A graph runs
both steps at once and waits up to its `wait` (the dashboard 5s, MCP 40s);
what isn't ready comes back `pending`, with `waitingFor` naming it, and the
rest from the skills list and embeddings. Building the graph takes ~3ms.
