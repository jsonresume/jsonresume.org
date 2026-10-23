#!/usr/bin/env bash
# Sync Cloudflare's published IP ranges into ufw (80/443 open only to
# Cloudflare) and into Caddy's trusted proxies. Safe to re-run; run as root.
set -euo pipefail

v4=$(curl -fsS https://www.cloudflare.com/ips-v4)
v6=$(curl -fsS https://www.cloudflare.com/ips-v6)
ranges=$(printf '%s\n%s\n' "$v4" "$v6" | grep -E '^[0-9a-f:./]+$')
[ "$(echo "$ranges" | wc -l)" -ge 10 ] || { echo "too few ranges, aborting" >&2; exit 1; }

for ip in $ranges; do
  ufw allow proto tcp from "$ip" to any port 80,443 comment cloudflare >/dev/null
done

printf 'trusted_proxies static %s\n' "$(echo $ranges)" > /etc/caddy/cloudflare-trusted-proxies
systemctl reload caddy 2>/dev/null || true
echo "synced $(echo "$ranges" | wc -l) Cloudflare ranges"
