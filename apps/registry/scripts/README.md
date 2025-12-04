# Registry Scripts

Utility scripts for the jsonresume.org registry application.

## Database Maintenance

### `cleanup-deleted-gists.js`

Removes cached resume data for users whose GitHub gists have been deleted. This keeps the /explore page clean and up-to-date by removing stale entries.

**Purpose**: Over time, users may delete their GitHub gists without using the registry's privacy page. This leaves stale cached data in the database that shows up in /explore search results. This script identifies and removes those stale entries.

**Prerequisites:**
- `SUPABASE_KEY` environment variable with admin/service role permissions

**Usage:**

```bash
# Dry run (recommended first) - shows what would be deleted
cd apps/registry
SUPABASE_KEY=your_key_here pnpm cleanup:gists:dry-run

# With limit for testing
SUPABASE_KEY=your_key_here pnpm cleanup:gists:dry-run -- --limit=10

# Actual deletion
SUPABASE_KEY=your_key_here pnpm cleanup:gists

# With limit for incremental cleanup
SUPABASE_KEY=your_key_here pnpm cleanup:gists -- --limit=100
```

**Options:**
- `--dry-run` - Show what would be deleted without actually deleting
- `--limit=N` - Only process N users (useful for testing or incremental cleanup)

**How It Works:**

1. Fetches cached resumes from Supabase `resumes` table
2. For each cached resume, checks if the gist still exists via HEAD request to `https://gist.githubusercontent.com/{username}/raw/resume.json`
3. Identifies gists that return non-200 status (deleted or inaccessible)
4. Deletes cache entries for deleted gists from the `resumes` table
5. Includes 100ms delay between checks to avoid rate limiting

**Example Output:**

```json
{"level":30,"msg":"Starting cleanup of deleted gists","isDryRun":true,"limit":"unlimited"}
{"level":30,"msg":"Checking gists for users","count":245}
{"level":30,"msg":"Found deleted gist","username":"deleteduser123","createdAt":"2024-01-15"}
{"level":30,"msg":"Gist check complete","total":245,"existing":243,"deleted":2}
{"level":30,"msg":"DRY RUN: Would delete these users","usernames":["deleteduser123","olduser456"]}
```

**Automation:**

For production environments, consider running this script:
- As a scheduled cron job (weekly or monthly)
- Via GitHub Actions on a schedule
- As a Vercel cron job (see Vercel docs)

**Security:**
- Never commit `SUPABASE_KEY` to version control
- The script requires admin/service role permissions
- Always run with `--dry-run` first to verify behavior

**Related:**
- `/api/privacy/delete-cache` - User-facing API for manual cache deletion
- `/explore` - Public search page displaying cached resume data

## Theme Screenshot Generator

Automatically generates preview images for resume themes.

### Scripts

#### `generate-theme-screenshots.js`

Basic script that checks which themes are missing screenshots and outputs a task list. This is the planning/analysis script.

**Usage:**
```bash
node apps/registry/scripts/generate-theme-screenshots.js [options]
```

**Options:**
- `--force` - Check all themes, not just missing ones
- `--theme=NAME` - Check a specific theme only
- `--port=3000` - Dev server port (default: 3000)
- `--username=USER` - Test username (default: thomasdavis)

**Example:**
```bash
# Check all missing screenshots
node apps/registry/scripts/generate-theme-screenshots.js

# Check a specific theme
node apps/registry/scripts/generate-theme-screenshots.js --theme=tokyo-modernist
```

#### `generate-theme-screenshots-auto.js` (Recommended)

Fully automated script that generates all missing theme screenshots using Playwright.

**Prerequisites:**
1. Dev server must be running:
   ```bash
   cd apps/registry && pnpm dev
   ```

2. Playwright must be installed (should be installed via workspace):
   ```bash
   pnpm exec playwright install chromium
   ```

**Usage:**
```bash
node apps/registry/scripts/generate-theme-screenshots-auto.js [options]
```

**Options:**
- `--force` - Regenerate all screenshots, even if they exist
- `--theme=NAME` - Generate screenshot for specific theme only
- `--port=3000` - Dev server port (default: 3000)
- `--username=USER` - Test username for resume (default: thomasdavis)

**Examples:**
```bash
# Generate all missing screenshots
node apps/registry/scripts/generate-theme-screenshots-auto.js

# Regenerate all screenshots (overwrite existing)
node apps/registry/scripts/generate-theme-screenshots-auto.js --force

# Generate screenshot for a single theme
node apps/registry/scripts/generate-theme-screenshots-auto.js --theme=modern-classic

# Use a different test user
node apps/registry/scripts/generate-theme-screenshots-auto.js --username=johndoe
```

**Output:**
- Screenshots are saved to: `apps/homepage2/public/img/themes/`
- File format: `{theme-name}.png`
- Viewport size: 1280x1024px (captures hero section)

### How It Works

1. **Theme Discovery**: Reads theme list from `apps/registry/lib/formatters/template/themeConfig.js`
2. **Missing Check**: Compares theme list against existing screenshots in `apps/homepage2/public/img/themes/`
3. **Server Verification**: Checks that the dev server is running on the specified port
4. **Screenshot Capture**:
   - Launches headless Chromium browser
   - Navigates to each theme URL: `http://localhost:3000/{username}?theme={theme-name}`
   - Captures viewport screenshot (top portion of resume)
   - Saves to themes directory
5. **Cleanup**: Closes browser and reports success/failure counts

### When to Use

- **After adding new themes**: Run the script to generate preview images for the theme gallery
- **After theme updates**: Use `--force` to regenerate screenshots for themes with design changes
- **Testing themes**: Use `--theme=NAME` to quickly generate a preview for a single theme
- **CI/CD integration**: Can be integrated into build pipelines to ensure all themes have screenshots

### Troubleshooting

**Error: Dev server is not running**
```bash
# Start the dev server first
cd apps/registry && pnpm dev
```

**Error: Playwright is not installed**
```bash
# Install Playwright browsers
pnpm exec playwright install chromium
```

**Error: Navigation timeout**
- Check that the theme is properly registered in `themeConfig.js`
- Verify the test user exists and has a valid resume
- Increase timeout in the script if needed

**Error: Permission denied**
```bash
# Make script executable
chmod +x apps/registry/scripts/generate-theme-screenshots-auto.js
```

### Integration with Theme Development

When creating a new theme, follow this workflow:

1. Create theme package in `packages/themes/jsonresume-theme-{name}/`
2. Register theme in `apps/registry/lib/formatters/template/themeConfig.js`
3. Add theme to workspace dependencies in `apps/registry/package.json`
4. Start dev server and test theme manually
5. Run screenshot generator:
   ```bash
   node apps/registry/scripts/generate-theme-screenshots-auto.js --theme={name}
   ```
6. Verify screenshot looks good in `apps/homepage2/public/img/themes/{name}.png`
7. Commit both the theme code and screenshot

### Technical Details

- **Browser**: Chromium (headless)
- **Framework**: Playwright
- **Viewport**: 1280x1024px
- **Format**: PNG
- **Navigation timeout**: 30 seconds
- **Wait strategy**: `networkidle` (waits for network to be idle before screenshot)
