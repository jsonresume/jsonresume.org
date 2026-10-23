---
title: Getting started
description: Install the JSON Resume CLI, export your resume to PDF or HTML, and host it on the registry from a GitHub Gist.
---

## Command line tool

We've built a CLI (command line interface) that runs on macOS, Linux and Windows. To create your own resume, install `resume-cli` from npm:

```bash
npm install -g resume-cli
```

`resume-cli` is maintained in the [jsonresume.org monorepo](https://github.com/jsonresume/jsonresume.org/tree/master/packages/cli). [resumed](https://github.com/rbardini/resumed) (`npm install -g resumed`) is a lightweight community alternative.

### Exporting

The command line tool uses an ecosystem of modules that we've open sourced to convert your resume to different formats:

```bash
resume export resume.pdf
resume export resume.html
```

## Import from LinkedIn

One of our community members wrote a great Chrome extension to import your LinkedIn profile. [Download it from the Chrome Web Store](https://chromewebstore.google.com/detail/json-resume-exporter/caobgmmcpklomkcckaenhjlokpmfbdec).

## LaTeX

If you want to render a LaTeX resume, there is a very well put together project called [RenderCV](https://github.com/rendercv/rendercv). It has its own data format for resumes, but we have tools to convert your `resume.json` to that format.

To convert your `resume.json`:

```bash
npx @jsonresume/jsonresume-to-rendercv resume.json
```

Then simply run:

```bash
rendercv render resume.yaml
```

If you use the registry hosting service, you can also access your resume in the RenderCV format, e.g. [https://registry.jsonresume.org/thomasdavis.rendercv](https://registry.jsonresume.org/thomasdavis.rendercv).

## YAML

If you prefer maintaining your resume as YAML, [YAMLResume](https://yamlresume.dev) is a TypeScript toolchain that renders pixel-perfect PDFs via LaTeX typesetting, with built-in i18n support and schema validation. It can import JSON Resume directly.

YAMLResume requires Node.js 22 or newer. Convert your existing resume:

```bash
npx json2yamlresume resume.json
```

Install the YAMLResume CLI:

```bash
npm install -g yamlresume
```

For PDF output, install a supported LaTeX engine following the [YAMLResume installation guide](https://yamlresume.dev/docs/installation), then verify your environment and build:

```bash
yamlresume doctor
yamlresume build resume.yml
```

## Maintaining and deploying multiple versions

The registry supports multiple resume files via the `?gistname=` parameter. Store alternate versions (e.g. `resume-en.json`, `resume-fr.json`) in your GitHub Gist and access them with:

```text
https://registry.jsonresume.org/yourusername?gistname=resume-fr
```

For automated deployments, you can use GitHub Actions to publish specific resume versions to the registry on push.

## Hosting

JSON Resume offers a hosting service that renders your `resume.json` with any theme you like, e.g. [registry.jsonresume.org/thomasdavis](https://registry.jsonresume.org/thomasdavis).

All you have to do is create a Gist on GitHub named `resume.json`, e.g. [gist.github.com/thomasdavis/c9dcfa1b37dec07fb2ee7f36d7278105](https://gist.github.com/thomasdavis/c9dcfa1b37dec07fb2ee7f36d7278105). **Alternatively**, you can use the editor at [registry.jsonresume.org](https://registry.jsonresume.org).

Our hosting service will automatically detect your Gist when you visit `registry.jsonresume.org/your_github_username`.

To set a theme, add this to your `resume.json`:

```json
{ "meta": { "theme": "elegant" } }
```

### Use your own repository instead of a Gist

You can create a GitHub Action that publishes your Gist whenever you push to your own repository. For an example, see [github.com/thomasdavis/resume](https://github.com/thomasdavis/resume).

### Raw formats

You can also access your resume in raw formats:

| Format | Example                                                                                      |
| ------ | -------------------------------------------------------------------------------------------- |
| JSON   | [registry.jsonresume.org/thomasdavis.json](https://registry.jsonresume.org/thomasdavis.json) |
| YAML   | [registry.jsonresume.org/thomasdavis.yaml](https://registry.jsonresume.org/thomasdavis.yaml) |
| Text   | [registry.jsonresume.org/thomasdavis.txt](https://registry.jsonresume.org/thomasdavis.txt)   |

### QR service

To generate a QR code that links to your hosted resume, use [registry.jsonresume.org/thomasdavis.qr](https://registry.jsonresume.org/thomasdavis.qr), e.g.:

![QR code linking to Thomas Davis's hosted resume](https://registry.jsonresume.org/thomasdavis.qr)

### Video

[Watch the video on YouTube](https://www.youtube.com/watch?v=BxpHgNM0clE).
