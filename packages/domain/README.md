# @repo/domain

Effect Schema models shared by the jsonresume.org apps and packages:
projects, team, history, blog posts, documents and theme summaries. Each export
is both a runtime schema and a type (`Project`, `typeof Project.Type`).

No React and no IO: anything that reads or renders these lives elsewhere
(`@repo/content`, `@repo/site`).
