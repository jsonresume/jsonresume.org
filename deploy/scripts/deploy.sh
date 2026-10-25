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
  old=$(readlink -f "$APPDIR/current" 2>/dev/null || true)
  ln -sfn "$target" "$APPDIR/current.new" && mv -T "$APPDIR/current.new" "$APPDIR/current"
  # Tell the app which commit it is serving (e.g. /api/health).
  printf 'GIT_COMMIT_SHA=%s\n' "$(basename "$target")" > "$APPDIR/release.env"
  if [ -n "$old" ] && [ "$old" != "$target" ]; then
    ln -sfn "$old" "$APPDIR/previous.new" && mv -T "$APPDIR/previous.new" "$APPDIR/previous"
  fi
  chown -h deploy:deploy "$APPDIR/current" "$APPDIR/previous" 2>/dev/null || true
  systemctl restart "jsonresume@$APP"
}

[ "$(id -u)" = 0 ] || { echo "run as root" >&2; exit 1; }
[ -f /etc/jsonresume/"$APP".env ] || { echo "missing /etc/jsonresume/$APP.env" >&2; exit 1; }
install -d -o deploy -g deploy "$APPDIR/releases"

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
  if [ -d "$REL/apps/$APP/node_modules/playwright-core" ]; then
    WORKDIR=$REL/apps/$APP as_deploy pnpm exec playwright-core install chromium-headless-shell >/dev/null
  fi
  touch "$REL/.built" && chown deploy:deploy "$REL/.built"
fi

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
