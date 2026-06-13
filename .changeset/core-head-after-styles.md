---
'@jsonresume/core': patch
---

`renderResumeDocument` gains a composable `headAfterStyles` option: raw HTML
inserted in `<head>` AFTER the styled-components tags (for inline `<style>` that
must override component styles — global resets, body backgrounds, `@media print`
/ `@page` rules). Composes with the existing `head` option (before the styled
tags), so a theme can reproduce inline-style blocks on either side of the
component CSS cascade. Backward-compatible (default empty).
