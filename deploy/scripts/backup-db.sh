#!/usr/bin/env bash
# Nightly database backup: dump, prove the dump restores, ship it to R2.
# Run as root (jsonresume-backup.timer). Credentials: /etc/jsonresume/backup.env.
#
# Restore a backup:
#   rclone copy r2:jsonresume-db-backups/daily/<file> .   (same env as below)
#   sudo -u postgres createdb -O jsonresume jsonresume_restored
#   sudo -u postgres pg_restore -d jsonresume_restored --no-owner --role=jsonresume <file>
#   sudo -u postgres psql -c 'ALTER DATABASE jsonresume_restored SET search_path = "$user", public, extensions'
# The dump already holds the auth and extensions schemas; the compat SQL is
# only for the first import from Supabase.
set -euo pipefail

DB=jsonresume
DIR=/var/backups/jsonresume
KEEP_LOCAL_DAYS=7
TS=$(date -u +%Y%m%dT%H%M%SZ)
FILE=$DIR/$DB-$TS.dump
CHECK_DB=${DB}_restore_check

set -a; . /etc/jsonresume/backup.env; set +a
export RCLONE_CONFIG_R2_TYPE=s3 RCLONE_CONFIG_R2_PROVIDER=Cloudflare \
  RCLONE_CONFIG_R2_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
  RCLONE_CONFIG_R2_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
  RCLONE_CONFIG_R2_ENDPOINT=$R2_ENDPOINT RCLONE_CONFIG_R2_NO_CHECK_BUCKET=true

pg() { sudo -u postgres "$@"; }
counts() {
  pg psql -XAt -d "$1" -c "select
    (select count(*) from public.resumes), (select count(*) from public.jobs),
    (select count(*) from auth.users), (select count(*) from public.companies)"
}

install -d -o postgres -g postgres -m 700 "$DIR"
pg pg_dump -Fc -d "$DB" -f "$FILE"
live=$(counts "$DB")

# A dump only counts once it has been restored.
pg dropdb --if-exists "$CHECK_DB"
pg createdb "$CHECK_DB"
errors=$(pg pg_restore -d "$CHECK_DB" --no-owner --no-privileges -j 4 "$FILE" 2>&1 \
  | grep -v 'schema "public" already exists' | grep -E 'error:' | grep -v 'errors ignored' || true)
[ -z "$errors" ] || { echo "restore errors:"; echo "$errors"; pg dropdb "$CHECK_DB"; exit 1; }
restored=$(counts "$CHECK_DB")
pg dropdb "$CHECK_DB"
# Writes between the dump and the count (view counter) can only add rows.
[ "$restored" = "$live" ] || echo "note: live $live, restored $restored"
[ "$(echo "$restored" | cut -d'|' -f1)" -gt 0 ] || { echo "restored resumes empty"; exit 1; }

rclone copyto --s3-no-check-bucket "$FILE" "r2:$R2_BUCKET/daily/$(basename "$FILE")"
find "$DIR" -name "$DB-*.dump" -mtime +$KEEP_LOCAL_DAYS -delete
echo "backup ok: $(basename "$FILE") $(du -h "$FILE" | cut -f1) counts $restored"
