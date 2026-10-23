# Self-hosted box

How `vps-27b4fa5a.vps.ovh.ca` (54.39.111.72) runs jsonresume.org. The plan and
its phases are in [`SELF_HOSTING_PLAN.md`](../SELF_HOSTING_PLAN.md).

## Layout

| Path                              | What                                                       |
| --------------------------------- | ---------------------------------------------------------- |
| `/etc/jsonresume/<app>.env`       | Secrets and `PORT` per app (root, 600)                     |
| `/etc/jsonresume/postgres.env`    | `DATABASE_URL` for the local database                      |
| `/etc/jsonresume/backup.env`      | R2 credentials, scoped to the `jsonresume-db-backups` bucket |
| `/srv/jsonresume/<app>/current`   | Live release, served by `jsonresume@<app>`                 |
| `/usr/local/lib/jsonresume/deploy`| Installed copy of this directory (backup script)           |
| `/var/backups/jsonresume`         | Local dumps, kept 7 days                                   |
| `/etc/caddy/certs`                | Cloudflare origin certificate for `*.jsonresume.org`       |

Ports: registry 3000, homepage2 3001, styleguide 3002, app 3003.

## Common tasks

```sh
sudo deploy/scripts/deploy.sh registry               # build and release origin/master
sudo deploy/scripts/deploy.sh registry <branch|sha>  # any ref
sudo deploy/scripts/deploy.sh registry --rollback    # back to the previous release
journalctl -u jsonresume@registry -f                 # logs
sudo systemctl start jsonresume-backup               # backup now (also nightly, 03:00 UTC)
sudo deploy/scripts/cloudflare-ips.sh                # refresh Cloudflare ranges (ufw + Caddy)
```

## Rebuilding the box from scratch

1. **Harden.** Drop-in `/etc/ssh/sshd_config.d/10-hardening.conf` with
   `PasswordAuthentication no`, `KbdInteractiveAuthentication no`,
   `PermitRootLogin no`. Install `fail2ban` (sshd jail, systemd backend),
   enable `unattended-upgrades`, add 4 GB swap. `ufw`: deny incoming, `limit
   22/tcp`, then `deploy/scripts/cloudflare-ips.sh` opens 80/443 to Cloudflare
   only. Create the system user `deploy` (home `/srv/jsonresume`).
2. **Packages.** `postgresql-18 postgresql-18-pgvector`, Caddy from
   `dl.cloudsmith.io/public/caddy/stable` (Ubuntu's 2.6 is too old for
   `trusted_proxies`), rclone from rclone.org (Ubuntu's 1.60 fails R2 uploads),
   Node 24 with corepack. Chromium for PDF export needs: `libxcomposite1
   libxdamage1 libxfixes3 libxrandr2 libasound2t64 libatk1.0-0t64
   libatk-bridge2.0-0t64 libatspi2.0-0t64 libcairo2 libcups2t64 libgbm1
   libpango-1.0-0 libnss3 libxkbcommon0` plus `fonts-liberation fonts-noto-core
   fonts-noto-color-emoji fonts-noto-cjk`.
3. **Database.** Create role and database `jsonresume`, then restore the latest
   dump from R2 (see the header of `scripts/backup-db.sh`). For a first import
   from Supabase, apply `postgres/00-supabase-compat.sql` before restoring.
4. **Web.** Install `caddy/Caddyfile`, the origin certificate, and the units in
   `systemd/`; enable `jsonresume@<app>` and `jsonresume-backup.timer`.
5. **Deploy** each app with `scripts/deploy.sh`.

## Notes

- Auth.js needs `AUTH_TRUST_HOST=true` and an explicit `AUTH_URL` here;
  behind `next start` it otherwise builds callback URLs on `localhost:3000`.
- Playwright has no Ubuntu 26.04 build; `deploy.sh` installs the 24.04 one
  (`PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64`).
- Cloudflare SSL mode for the zone is still Full, not Full (strict); switch
  only after checking every origin in the zone.
