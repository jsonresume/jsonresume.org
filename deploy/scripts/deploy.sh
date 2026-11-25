#!/usr/bin/env bash
# Build and release one app on the box, with instant rollback.
#
#   sudo deploy/scripts/deploy.sh <app> [git-ref]     (default ref: origin/master)
#   sudo deploy/scripts/deploy.sh <app> --rollback
#
# Layout under /srv/jsonresume (owned by the deploy user):
#   repo.git                      mirror of github.com/jsonresume/jsonresume.org
#   <app>/releases/<sha>          one built checkout per commit
#   <app>/current -> releases/..  what jsonresume@<app> serves
#   <app>/previous -> releases/.. the release before it, for --rollback
#   <app>/assets                  every release's /assets for ASSET_DAYS, which
#                                 the app serves when its own build lacks one
#
# Static sites (STATIC_APPS: a build of plain files in apps/<app>/out) have no
# service: each build is copied to /srv/www/<app>/<sha>, which Caddy can read,
# and /srv/www/<app>/current (and previous) point at one.
#
# Builds run as `deploy` with /etc/jsonresume/<app>.env loaded by systemd, so
# NEXT_PUBLIC_* values are inlined while the env file stays root-only.
set -euo pipefail

APP=${1:?usage: deploy.sh <app> [git-ref|--rollback]}
REF=${2:-origin/master}
BASE=/srv/jsonresume
REPO=$BASE/repo.git
APPDIR=$BASE/$APP
KEEP=3
ASSET_DAYS=14
STATIC_APPS="styleguide"
WWW=/srv/www/$APP

is_static() { case " $STATIC_APPS " in *" $APP "*) return 0 ;; esac; return 1; }

log() { echo "[deploy $APP] $*"; }

as_deploy() {
  # Run a command as deploy with the app's env, outside this shell's env.
  systemd-run --quiet --wait --pipe --collect --uid=deploy --gid=deploy \
    -p EnvironmentFile=/etc/jsonresume/"$APP".env \
    -p EnvironmentFile=-/etc/jsonresume/postgres.env \
    -E HOME=$BASE -E COREPACK_ENABLE_DOWNLOAD_PROMPT=0 -E CI=1 \
    -E GIT_COMMIT_SHA="${SHA:-}" \
    -p WorkingDirectory="${WORKDIR:-$BASE}" "$@"
}

port() { grep -E '^PORT=' /etc/jsonresume/"$APP".env | cut -d= -f2 | tr -d '"'; }

healthy() {
  local url="http://127.0.0.1:$(port)/" code
  for _ in $(seq 1 60); do
    code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$url" || true)
    case $code in 2??|3??) log "healthy ($code)"; return 0 ;; esac
    sleep 2
  done
  log "unhealthy: last status ${code:-none} from $url"
  return 1
}

switch_to() {
  # Atomically repoint current; remember the old target as previous.
  local target=$1 old
  # readlink -f names a missing link too: only read one that exists.
  old=""; [ -L "$APPDIR/current" ] && old=$(readlink -f "$APPDIR/current")
  ln -sfn "$target" "$APPDIR/current.new" && mv -T "$APPDIR/current.new" "$APPDIR/current"
  # Tell the app which commit it is serving (e.g. /api/health), and where
  # earlier releases' assets are (archive_assets).
  printf 'GIT_COMMIT_SHA=%s\nASSET_ARCHIVE=%s\n' "$(basename "$target")" \
    "$APPDIR/assets" > "$APPDIR/release.env"
  if [ -n "$old" ] && [ "$old" != "$target" ]; then
    ln -sfn "$old" "$APPDIR/previous.new" && mv -T "$APPDIR/previous.new" "$APPDIR/previous"
  fi
  chown -h deploy:deploy "$APPDIR/current" "$APPDIR/previous" 2>/dev/null || true
  systemctl restart "jsonresume@$APP"
}

archive_assets() {
  # A page loaded before a deploy still asks for its own build's chunks
  # (fingerprinted, so names never clash): keep every kept release's
  # /assets in one place, and each file ASSET_DAYS after its last release.
  local archive=$APPDIR/assets src f
  install -d -o deploy -g deploy "$archive"
  for src in "$APPDIR"/releases/*/apps/"$APP"/dist/client/assets; do
    [ -d "$src" ] || continue
    (cd "$src" && find . -type f -printf '%P\n') | while read -r f; do
      if [ -e "$archive/$f" ]; then touch "$archive/$f"; else
        install -D -o deploy -g deploy -m 644 "$src/$f" "$archive/$f.new" &&
          mv "$archive/$f.new" "$archive/$f"
      fi
    done
  done
  find "$archive" -type f -mtime +"$ASSET_DAYS" -delete
}

repoint() {
  # Atomically point $1 at $2.
  ln -sfn "$2" "$1.new" && mv -T "$1.new" "$1"
}

publish_static() {
  # Copy a static build where Caddy reads it, then switch to it.
  local out=$1 sha=$2 old
  [ -f "$out/index.html" ] || { log "no $out/index.html"; exit 1; }
  install -d -m 755 "$WWW"
  rm -rf "${WWW:?}/$sha.new" && cp -r "$out" "$WWW/$sha.new"
  chmod -R a+rX "$WWW/$sha.new"
  rm -rf "${WWW:?}/${sha:?}" && mv "$WWW/$sha.new" "$WWW/$sha"
  # readlink -f names a missing link too: only read one that exists.
  old=""; [ -L "$WWW/current" ] && old=$(readlink -f "$WWW/current")
  repoint "$WWW/current" "$WWW/$sha"
  [ -n "$old" ] && [ "$old" != "$WWW/$sha" ] && repoint "$WWW/previous" "$old"
  live=$(readlink -f "$WWW/current"); prev=$(readlink -f "$WWW/previous" 2>/dev/null || true)
  ls -1t "$WWW" | grep -vx -e current -e previous | tail -n +$((KEEP + 1)) | while read -r gone; do
    [ "$WWW/$gone" = "$live" ] || [ "$WWW/$gone" = "$prev" ] && continue
    rm -rf "${WWW:?}/${gone:?}"
  done
  log "live: $sha"
}

[ "$(id -u)" = 0 ] || { echo "run as root" >&2; exit 1; }
[ -f /etc/jsonresume/"$APP".env ] || { echo "missing /etc/jsonresume/$APP.env" >&2; exit 1; }
install -d -o deploy -g deploy "$APPDIR/releases"

if [ "$REF" = --rollback ] && is_static; then
  prev=$(readlink -f "$WWW/previous") || { log "no previous release"; exit 1; }
  log "rolling back to $(basename "$prev")"
  old=$(readlink -f "$WWW/current")
  repoint "$WWW/current" "$prev" && repoint "$WWW/previous" "$old"
  exit
fi

if [ "$REF" = --rollback ]; then
  prev=$(readlink -f "$APPDIR/previous") || { log "no previous release"; exit 1; }
  log "rolling back to $(basename "$prev")"
  switch_to "$prev"
  healthy
  exit
fi

if [ ! -d "$REPO" ]; then
  as_deploy git clone --quiet --mirror https://github.com/jsonresume/jsonresume.org.git "$REPO"
fi
WORKDIR=$REPO as_deploy git fetch --quiet --prune origin '+refs/heads/*:refs/remotes/origin/*'
SHA=$(git --git-dir="$REPO" rev-parse --verify "$REF^{commit}")
REL=$APPDIR/releases/$SHA
log "ref $REF -> $SHA"

if [ ! -f "$REL/.built" ]; then
  install -d -o deploy -g deploy "$REL"
  WORKDIR=$REL as_deploy bash -c "git --git-dir=$REPO archive $SHA | tar -x"
  log "installing dependencies"
  WORKDIR=$REL as_deploy pnpm install --frozen-lockfile --reporter=silent
  log "building"
  WORKDIR=$REL as_deploy pnpm turbo build --filter="$APP" --output-logs=errors-only
  # /@username.pdf prints with Chromium (@repo/resume-pdf), kept in the
  # deploy user's cache; a no-op once this Playwright's build is there.
  # Playwright doesn't list Ubuntu 26.04 yet, so it takes the 24.04 build.
  if [ -d "$REL/apps/$APP/node_modules/playwright-core" ]; then
    WORKDIR=$REL/apps/$APP as_deploy env PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64 \
      pnpm exec playwright-core install chromium-headless-shell >/dev/null 2>&1 \
      || log "warning: Chromium was not installed; check /@username.pdf"
  fi
  touch "$REL/.built" && chown deploy:deploy "$REL/.built"
fi

if is_static; then
  publish_static "$REL/apps/$APP/out" "$SHA"
  # Only the copy is served; the checkout is kept for the next build.
  ls -1t "$APPDIR/releases" | tail -n +$((KEEP + 1)) | while read -r old; do
    rm -rf "${APPDIR:?}/releases/${old:?}"
  done
  exit
fi

# Before the switch, so no page loaded from the old release misses a chunk.
archive_assets
if [ "$(readlink -f "$APPDIR/current" 2>/dev/null)" = "$REL" ]; then
  log "already live; restarting"
  systemctl restart "jsonresume@$APP"
else
  switch_to "$REL"
fi

if ! healthy; then
  if [ -L "$APPDIR/previous" ]; then
    log "rolling back"
    switch_to "$(readlink -f "$APPDIR/previous")"
  fi
  exit 1
fi

# Prune old releases, never the live or previous one.
live=$(readlink -f "$APPDIR/current"); prev=$(readlink -f "$APPDIR/previous" 2>/dev/null || true)
ls -1t "$APPDIR/releases" | tail -n +$((KEEP + 1)) | while read -r old; do
  [ "$APPDIR/releases/$old" = "$live" ] || [ "$APPDIR/releases/$old" = "$prev" ] && continue
  rm -rf "${APPDIR:?}/releases/${old:?}"
done
log "live: $SHA"
