# build-cache

Turborepo's remote cache for CI, served from the jsonresume.org box instead
of Vercel's. CI's builds run on GitHub's machines; turbo uploads each task's
outputs here and replays them when the same task comes up again, so a PR
only rebuilds the packages it changed.

- The API is turbo's v8 artifacts API (`/v8/artifacts/:hash`, `status`,
  `events`), one team, one Bearer token (`BUILD_CACHE_TOKEN` on the box, `TURBO_TOKEN` in CI). Without the token
  nothing is served, so fork PRs, which get no secrets, build everything.
- Artifacts are files in `CACHE_DIRECTORY` (systemd's
  `/var/cache/jsonresume/build-cache`). Reading one touches it; every hour
  those unused for 14 days go, then the least recently used past
  `BUILD_CACHE_MAX_GB` (default 10).
- On the box it is `jsonresume@build-cache` on port 3011, released with
  `sudo deploy/scripts/deploy.sh build-cache`. Caddy serves it at
  `https://jsonresume.org/_turbo`. See `deploy/README.md`.

```sh
pnpm --filter build-cache test
PORT=3011 BUILD_CACHE_TOKEN=dev CACHE_DIRECTORY=/tmp/turbo pnpm --filter build-cache start
TURBO_API=http://127.0.0.1:3011 TURBO_TEAM=jsonresume TURBO_TOKEN=dev pnpm turbo build
```
