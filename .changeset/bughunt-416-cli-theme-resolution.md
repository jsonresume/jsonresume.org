---
'resume-cli': patch
---

Fix theme-resolution edge cases from the Wave 16 bug-hunt (#416): the `jsonresume-theme-` prefix fallback guard in renderHTML tested the wrong variable (so it ran unconditionally, even for scoped specifiers); `resume serve` printed a leftover debug object on every rebuild; and PDF export resolved themes with its own `cwd/node_modules/<theme>/index.js` lookup, so hoisted installs or themes with a non-`index.js` entry point could render HTML fine but spuriously fail PDF export. Theme resolution is now shared between the HTML and PDF paths.
