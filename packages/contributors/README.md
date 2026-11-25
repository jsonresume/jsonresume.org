# @repo/contributors

Everyone who has contributed to JSON Resume, with every credit:
the `/contributors` page (`@repo/contributors/ui`) and the
`list_contributors` MCP tool.

- **Who is credited:** anyone who has
  - committed to, opened a pull request or issue in, or commented on any
    public repository of the jsonresume org on GitHub (archived ones too);
  - published a `jsonresume-theme-*` package on npm;
  - built a tool in the projects directory;
  - served on the core team or standards committee.

  Bots are left out (`isBot`).
- **Who a credit goes to:**
  - People are joined by GitHub login, and named as on their GitHub profile.
  - A theme goes to the GitHub owner of its repository, or else to its npm
    publisher. The org's own themes (`packages/themes` and the org's
    repositories) are credited through their commits instead.
  - A commit author without a GitHub account goes under their name, which is
    folded into the one person with that name or login (`foldByName`).
    Their credit links one of their commits. Email addresses are never kept.
- **Links:** every credit links to the work itself: the person's commits,
  pull requests, issues or comments in that repository, or the npm package
  or project.
- **Data:** `src/data/contributors.json`, written by `scripts/collect.ts` from
  public data only. Run it with a GitHub token that can read issues: a
  classic one needs no scopes, but an app or fine-grained token without
  issues permission gets only pull requests from the issues endpoint, and
  every issue drops out. The run takes a few hundred requests and about
  seven minutes:

  ```sh
  GITHUB_TOKEN=… pnpm --filter @repo/contributors collect
  ```

  The `Contributors` workflow runs it every Monday, and opens a pull request
  when the list changed (never when its credits fell by over 5%: a source
  failed).
- **Page:** everyone is in the server-rendered HTML, most involved first;
  search and the filter only hide people. A person's first six credits
  show, and the rest fold into "and N more".
