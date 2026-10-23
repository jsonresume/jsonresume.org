---
title: AI
description: Open-source AI tools in the JSON Resume registry for job recommendations, cover letters, resume suggestions and interview practice.
---

## What is this?

These are AI-related tools for building your resume. They are all fully open source, but the hosted version uses a central API account, which is subject to usage limits.

Currently they are only accessible via the registry, which requires using Gist hosting as explained on the [getting started](/getting-started) page.

## Tooling

These URLs are integrated with OpenAI and pass your resume to it with a predefined prompt, generating a new response each time. Replace `thomasdavis` with your GitHub username.

Recommended jobs is public. Cover letters, suggestions and interview practice need you to [sign in to the registry with GitHub](https://registry.jsonresume.org/login) first.

| Tool               | What it does                                                                    | URL                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Recommended jobs   | Tries to match your resume to recent Hacker News "Who is hiring?" posts         | [registry.jsonresume.org/thomasdavis/jobs](https://registry.jsonresume.org/thomasdavis/jobs)               |
| Cover letter       | Attempts to write a cover letter that matches your resume                       | [registry.jsonresume.org/thomasdavis/letter](https://registry.jsonresume.org/thomasdavis/letter)           |
| Resume suggestions | Asks ChatGPT for precise feedback on improvements you could make to your resume | [registry.jsonresume.org/thomasdavis/suggestions](https://registry.jsonresume.org/thomasdavis/suggestions) |
| Interview yourself | Inserts your `resume.json` into the prompt so you can talk to (or at) yourself  | [registry.jsonresume.org/thomasdavis/interview](https://registry.jsonresume.org/thomasdavis/interview)     |
