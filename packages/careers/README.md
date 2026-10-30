# @repo/careers

The career graph behind Pathways → Tree, and the data it stands on:

- **Skills** (`app.skills`, `app.skill_aliases`): one vocabulary; names as
  resumes and posts write them resolve to one skill (alias, then meaning).
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
