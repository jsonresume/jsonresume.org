# jsonresume.org - Bun Workspace Commands
# Run `just --list` to see all available commands

# Default recipe - show help
default:
    @just --list

# ============================================
# Installation
# ============================================

# Install all dependencies
install:
    bun install

# Install with frozen lockfile (CI)
install-frozen:
    bun install --frozen-lockfile

# ============================================
# Development
# ============================================

# Start registry app in development mode
dev:
    bun run --filter registry dev

# Start all apps in development mode
dev-all:
    bun run --filter '*' dev

# Start homepage in development mode
dev-homepage:
    bun run --filter homepage2 dev

# ============================================
# Build
# ============================================

# Build all packages and apps
build:
    bun run --filter '*' build

# Build registry app only
build-registry:
    bun run --filter registry build

# Build homepage only
build-homepage:
    bun run --filter homepage2 build

# ============================================
# Lint & Format
# ============================================

# Run ESLint on all packages
lint:
    bun run --filter '*' lint

# Format all files with Prettier
format:
    bun prettier -w .

# Check formatting without writing
format-check:
    bun prettier -c .

# ============================================
# Testing
# ============================================

# Run unit tests in watch mode
test:
    bun run --filter registry test

# Run unit tests once (CI mode)
test-run:
    bun run --filter registry test -- --run

# Run a single test file
test-file file:
    bun run --filter registry test -- --run {{file}}

# Run tests matching a pattern
test-match pattern:
    bun run --filter registry test -- -t "{{pattern}}"

# Run tests with coverage
test-coverage:
    bun run --filter registry test:coverage

# Run Playwright E2E tests
test-e2e:
    bun run --filter registry test:e2e

# Install Playwright browsers
playwright-install:
    bunx playwright install --with-deps

# ============================================
# Database
# ============================================

# Generate Prisma client
db-generate:
    bun run --filter registry db:generate

# Push schema changes to Supabase
db-push:
    supabase db push

# Link Supabase project
db-link:
    supabase link

# ============================================
# UI Components
# ============================================

# Add a shadcn/ui component
ui-add component:
    bun run --filter @repo/ui ui:add {{component}}

# Start Storybook
storybook:
    bun run --filter @repo/ui storybook

# Build Storybook
build-storybook:
    bun run --filter @repo/ui build-storybook

# ============================================
# Theme Development
# ============================================

# Generate theme screenshots
generate-screenshots:
    bun run generate:screenshots

# Serve registry and generate screenshots
serve-screenshots:
    bun run serve:registry

# ============================================
# Release
# ============================================

# Create a changeset
changeset:
    bunx changeset

# Version packages
changeset-version:
    bunx changeset version

# Publish packages
changeset-publish:
    bunx changeset publish

# ============================================
# Cleanup
# ============================================

# Remove all node_modules
clean:
    rm -rf node_modules
    find . -name "node_modules" -type d -prune -exec rm -rf {} +

# Remove build artifacts
clean-build:
    rm -rf apps/*/.next
    rm -rf apps/*/_site
    rm -rf packages/*/dist

# Full clean (node_modules + build artifacts)
clean-all: clean clean-build
