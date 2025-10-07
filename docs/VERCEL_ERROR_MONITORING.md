# Vercel Error Monitoring

Automated error monitoring system that checks Vercel deployment logs and creates GitHub issues for new/unique errors.

## How It Works

1. **GitHub Action** runs every 6 hours (or manually via `workflow_dispatch`)
2. **Fetches logs** from both Vercel projects using Vercel CLI
3. **Parses errors** from logs and creates error fingerprints
4. **Deduplicates** by checking existing issues with the same fingerprint
5. **Creates issues** for new errors or updates existing ones with occurrence counts

## Setup

### 1. Configure Vercel Token

Create a Vercel access token with read access to logs:

1. Go to [Vercel Settings → Tokens](https://vercel.com/account/tokens)
2. Create new token with name "GitHub Actions Error Monitor"
3. Add to GitHub repository secrets as `VERCEL_TOKEN`

### 2. Enable GitHub Actions

The workflow is located at `.github/workflows/vercel-error-monitor.yml` and runs automatically.

**Manual trigger:**

```bash
gh workflow run vercel-error-monitor.yml
```

## Error Fingerprinting

Errors are deduplicated using normalized fingerprints:

- Line/column numbers replaced with `X:X`
- Timestamps replaced with `TIMESTAMP`
- Hashes normalized

This ensures the same error type creates only one issue, even with different line numbers or timestamps.

## Issue Labels

All auto-created issues have these labels:

- `auto-error` - Identifies automated error reports
- `bug` - Categorizes as bug for triage
- `vercel-logs` - Indicates source is Vercel logs

## Error Hash Storage

Error fingerprints are stored in `scripts/.vercel-error-hashes.json` to track which errors have been reported.

## Monitored Projects

- `jsonresume-org-registry` - Main registry app
- `jsonresume-org-homepage2` - Homepage

## Issue Format

```markdown
## Automated Error Report

**Error Fingerprint:** `abc123def456`
**Project:** jsonresume-org-registry
**First Seen:** 2025-10-05T03:00:00.000Z
**Environment:** Production

### Error Message
```

[error message]

```

### Stack Trace
```

[stack trace if available]

```

```

## Manual Testing

Test locally (requires VERCEL_TOKEN):

```bash
export VERCEL_TOKEN="your-token"
export GITHUB_REPOSITORY="jsonresume/jsonresume.org"
node scripts/monitor-vercel-errors.js
```

## Limitations

- **Ephemeral logs**: Vercel only provides runtime logs from recent requests
- **Sampling**: May miss errors between monitoring runs
- **Rate limits**: GitHub API and Vercel API have rate limits

## Future Improvements

- Add auto-close logic for errors not seen in X days
- Group related errors by similarity
- Add severity classification
- Support for more deployment environments
