# Releasing npm Packages

The monorepo's publishable packages are released with [Changesets](https://github.com/changesets/changesets) via the **Release Packages** workflow (`.github/workflows/release-packages.yml`).

## How a release works

1. **Add a changeset** with your PR: run `pnpm changeset`, pick the bumped packages and semver level, and commit the generated file in `.changeset/`.
2. **Merge to `master`.** The workflow sees the pending changeset and opens (or updates) a **"Version Packages"** PR that bumps versions and updates changelogs (`pnpm changeset version`).
3. **Merge the Version Packages PR.** With no pending changesets left, the next run publishes the new versions to npm (`pnpm changeset publish`).

The "Version Packages" PR is created with a GitHub App token (`APP_ID` / `APP_PRIVATE_KEY`) so that CI checks run on it — the default `GITHUB_TOKEN` cannot trigger workflows on its own PRs.

## Manual dispatch

The workflow also runs on demand:

```bash
gh workflow run release-packages.yml
```

Use this to retry a publish after fixing auth, or to publish versions that were merged while the workflow was misconfigured.

## Auth: token vs. Trusted Publishing (OIDC)

Publishing currently authenticates with the `NPM_TOKEN` repo secret (an npm automation token from the `thomasdavis` account). We are migrating packages to **Trusted Publishing**, where npm trades the workflow's short-lived OIDC token (`id-token: write`) for publish auth — no long-lived token required.

> **Note:** OIDC requires **npm >= 11.5.0**. `actions/setup-node` (node 20) ships npm 10, so the workflow has an `npm install -g npm@latest` step that activates OIDC. This is harmless for token-based publishes.

### Legacy-package gotcha (first version bump)

Packages first published years ago default to **publishing access: "Require two-factor authentication or an automation token"**, which still works. But some legacy packages are set to **disallow tokens** (`Require two-factor authentication and disallow tokens`). The automation token cannot publish those, and the first bump fails with `403`.

Fix it one of two ways:

- **Quick flip (manual):** npmjs.com → the package → **Settings** → **Publishing access** → set to **"Require two-factor authentication or an automation token"** → publish → (optionally re-tighten after migrating to OIDC).
- **Proper fix:** register the package for Trusted Publishing (below), which removes the token dependency entirely.

### Trusted Publishing migration recipe (per package)

For each package you want to move off the token:

1. Go to **npmjs.com → the package → Settings → Trusted Publisher**.
2. Choose **GitHub Actions** as the publisher.
3. Set:
   - **Repository:** `jsonresume/jsonresume.org`
   - **Workflow filename:** `release-packages.yml`
   - (Leave environment blank — the workflow does not use a GitHub Environment.)
4. Save.

Once registered, that package publishes via OIDC and no longer needs `NPM_TOKEN`. Migrate every package, then the token can be retired. Unregistered packages keep using the token, so migration can be incremental.

## Files

- Workflow: [`.github/workflows/release-packages.yml`](../.github/workflows/release-packages.yml)
- Changesets config: [`.changeset/`](../.changeset/)
- Tracking issue: [#275](https://github.com/jsonresume/jsonresume.org/issues/275)
