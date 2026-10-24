---
title: Privacy policy
description: What jsonresume.org keeps about you, why, who helps us run it, how long it's kept, and how to see, change or delete it.
---

_Last updated 24 October 2026._

JSON Resume is an open-source project, and jsonresume.org is run by its maintainers. This policy covers jsonresume.org, its API and its MCP server (the connection that lets apps such as ChatGPT and Claude use your account). We keep only what the site needs to work, we don't sell data, and we don't show ads.

## What we keep, and why

**Your account.** Your email address, your username, and your password stored as a one-way hash (never the password itself). If you sign in with GitHub: your GitHub user id, login and avatar URL, and the GitHub access token GitHub gives us, encrypted, with the permissions you granted (your profile, your email and, if you allow it, your gists). We use these to sign you in and to read and save your resume gist.

**Your resume.** The resume you save here, or a copy of your `resume.json` gist, refreshed when your page is visited. Your resume is published at `jsonresume.org/@username` once your account is confirmed: it's meant to be public, so don't put anything in it you wouldn't share. If you keep a public `resume.json` gist on GitHub, its page at `jsonresume.org/@your-github-login` works without an account.

**Who reads your resume.** When someone views a resume page, we record the page or format read, the theme, the time, how long the page was visible and how far down it was read, the site they came from, their country (from Cloudflare), and their device type and browser. Visitors are counted with a hash that changes every day. We don't set cookies for this and don't store IP addresses. These numbers are shown only to the resume's owner. Owners viewing their own page aren't counted.

**Jobs.** Job posts come from public Hacker News "Who is hiring?" threads. When you use jobs matched to your resume, the text of your resume is sent to OpenAI to make an embedding (a list of numbers describing it), which we keep, keyed by a hash of that text, so we don't need to send it again. We also keep what you mark about jobs (interested, maybe, applied, not for me) and any note you add.

**Apps and keys.** For each app you connect (MCP clients such as ChatGPT or Claude) and each API key you make: its name, when it was made and last used, and a one-way hash of the key or token. We never keep keys or tokens in a form we could read back.

**Signing in.** A cookie keeps you signed in, another tells the site you are (so it can show the right buttons), and a short-lived one protects signing in with GitHub. No tracking or advertising cookies.

**Server logs.** Our servers log requests, including IP addresses, for security and to find problems. These logs are kept for at most 30 days.

## Who helps us run it

- **OVH** hosts our server and database, in Canada.
- **Cloudflare** carries traffic to the site and stores our database backups.
- **GitHub** signs you in when you choose it, and holds your gist.
- **OpenAI** reads job posts to tidy them, and makes embeddings of resumes for matching. OpenAI doesn't use API data to train its models.
- **Resend** sends account emails (confirming your address, resetting your password).

They process data only to provide those services to us.

## How long we keep it

Your account and everything in it are kept until you delete your account. Deleting it (in [Settings](/dashboard/settings)) removes your account, saved resume, reader statistics, job marks, keys and connected apps at once, and frees your username. Accounts whose email address is never confirmed are deleted after 7 days. Database backups are kept for 30 days, so deleted data is gone from them within 30 days too. Copies of gist resumes shown without an account are refreshed from GitHub and go when the gist goes.

## Your choices

- See and download your resume at any time (`/@username.json`, `.yaml` or `.txt`), and edit it in the [editor](/dashboard/editor).
- Disconnect apps and revoke API keys in [Settings](/dashboard/settings).
- Revoke our GitHub access in your GitHub settings, under Applications.
- Delete your account in [Settings](/dashboard/settings).
- Ask what we hold about you, or anything else about privacy, [on GitHub](https://github.com/jsonresume/jsonresume.org/issues) or on [Discord](https://discord.gg/GTZtn8pTXC).

## Children

jsonresume.org isn't meant for children under 13, and we don't knowingly collect their data.

## Changes

When this policy changes, we'll update it here and change the date at the top. The history of every change is in our [public repository](https://github.com/jsonresume/jsonresume.org).
