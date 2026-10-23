---
title: CLI tools
description: Command-line tools for rendering JSON Resume to HTML, PDF, and more.
---

Render your JSON Resume to HTML, PDF and more from the command line.

## Overview

JSON Resume can be rendered to HTML using command-line tools. The recommended CLI is [**resumed**](https://github.com/rbardini/resumed), a lightweight, fully tested Node.js tool that renders your resume using any compatible theme.

All official JSON Resume themes are compatible with `resumed` and can be used to generate beautiful HTML resumes from your `resume.json` file.

## Installation

Install `resumed` globally using npm:

```bash
npm install -g resumed
```

Or use it directly with npx (no installation required):

```bash
npx resumed --help
```

## Basic usage

The basic command to render a resume requires a `resume.json` file and a theme:

```bash
# Render to HTML (writes resume.html)
resumed render resume.json --theme jsonresume-theme-even

# Choose the output file
resumed render resume.json --theme jsonresume-theme-even --output my-resume.html
```

## Using themes

Themes are npm packages that transform your JSON Resume into HTML. To use a theme, first install it:

```bash
# Install a theme
npm install jsonresume-theme-even

# Then render with it
resumed render resume.json --theme jsonresume-theme-even
```

### Theme naming convention

All JSON Resume themes follow the naming pattern `jsonresume-theme-{name}`. `resumed` needs the full package name (or set `meta.theme` in your resume):

```bash
resumed render resume.json --theme jsonresume-theme-even
```

### Using local themes

You can also use themes from a local directory, which is useful during theme development. Pass an absolute path to the theme's entry file:

```bash
# Use a local theme
resumed render resume.json --theme "$PWD/my-theme/index.js"

# For themes with a build step, point at the built entry
resumed render resume.json --theme "$PWD/my-theme/dist/index.js"
```

## Official themes

JSON Resume provides many official themes that are tested and maintained. Here are some popular ones.

### Scoped themes (@jsonresume)

These themes are published under the `@jsonresume` scope on npm:

```bash
# Install scoped themes
npm install @jsonresume/jsonresume-theme-professional
npm install @jsonresume/jsonresume-theme-creative-studio
npm install @jsonresume/jsonresume-theme-consultant-polished
npm install @jsonresume/jsonresume-theme-tokyo-modernist

# Use them
resumed render resume.json --theme @jsonresume/jsonresume-theme-professional
```

### Community themes

Many community-maintained themes are available on npm. Search for [jsonresume-theme on npm](https://www.npmjs.com/search?q=jsonresume-theme) to discover more:

```bash
# Popular community themes
npm install jsonresume-theme-even
npm install jsonresume-theme-elegant
npm install jsonresume-theme-kendall
npm install jsonresume-theme-stackoverflow
npm install jsonresume-theme-macchiato
```

### Preview themes online

You can preview how your resume looks with different themes on the [JSON Resume Registry](https://registry.jsonresume.org). Just host your resume and append `?theme={name}` to the URL.

## PDF export

To generate a PDF, you can use browser-based tools or Puppeteer. The `resumed export` command generates PDFs with Puppeteer:

```bash
# Install Puppeteer (required for PDF)
npm install puppeteer

# Generate PDF
resumed export resume.json --theme jsonresume-theme-even --output resume.pdf
```

Alternatively, you can render to HTML and use any HTML-to-PDF tool:

```bash
# Render to HTML first
resumed render resume.json --theme jsonresume-theme-even --output resume.html

# Then convert with wkhtmltopdf
wkhtmltopdf resume.html resume.pdf

# Or with Chrome headless
google-chrome --headless --print-to-pdf=resume.pdf resume.html
```

## Validation

Before rendering, you can validate your `resume.json` against the official JSON Resume [schema](/schema):

```bash
# Validate your resume
resumed validate resume.json

# The command exits with code 0 if valid, non-zero otherwise
resumed validate resume.json && echo "Valid!" || echo "Invalid!"
```

## Programmatic API

You can also use `resumed` programmatically in your Node.js applications:

```js
import { render } from 'resumed';
import * as theme from 'jsonresume-theme-even';
import { readFileSync } from 'fs';

// Load your resume
const resume = JSON.parse(readFileSync('resume.json', 'utf-8'));

// Render to HTML
const html = await render(resume, theme);

console.log(html);
```

### Using themes directly

Each theme exports a `render` function that you can call directly:

```js
import { render } from 'jsonresume-theme-even';
import { readFileSync } from 'fs';

const resume = JSON.parse(readFileSync('resume.json', 'utf-8'));
const html = render(resume);

// Write to file
import { writeFileSync } from 'fs';
writeFileSync('resume.html', html);
```

## Creating your own theme

Want to create a custom theme? Check out our [theme development guide](/theme-development) to learn how to build themes that work with `resumed` and the JSON Resume ecosystem.

The basic requirements for a theme are:

- Export a `render(resume)` function that returns HTML
- Name your package `jsonresume-theme-{name}`
- Publish to npm for others to use

```js
// Minimal theme example
export function render(resume) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${resume.basics?.name || 'Resume'}</title>
      </head>
      <body>
        <h1>${resume.basics?.name}</h1>
        <p>${resume.basics?.label}</p>
        <!-- Add more sections... -->
      </body>
    </html>
  `;
}
```

## Troubleshooting

### Theme not found

Make sure the theme is installed in your project or globally:

```bash
# Install locally
npm install jsonresume-theme-even

# Or globally
npm install -g jsonresume-theme-even
```

### Module errors

Some themes require peer dependencies. Install them if you see module errors:

```bash
# Common peer dependencies
npm install react react-dom styled-components
```

### Getting help

If you encounter issues, check the [resumed GitHub issues](https://github.com/rbardini/resumed/issues) or the [JSON Resume repository](https://github.com/jsonresume/jsonresume.org/issues).

## Quick reference

```bash
# Install resumed
npm install -g resumed

# Validate resume
resumed validate resume.json

# Render to HTML
resumed render resume.json --theme jsonresume-theme-even --output resume.html

# Export to PDF (requires puppeteer)
resumed export resume.json --theme jsonresume-theme-even --output resume.pdf

# List available options
resumed --help
resumed render --help
```
