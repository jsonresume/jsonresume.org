---
'resume-cli': minor
---

- `export`, `serve` and `audit` find the themes bundled with the CLI on global and `npx` installs
- ESM-only themes load (including current `jsonresume-theme-even`, whose CommonJS build can't be required)
- Scoped theme packages (`--theme @scope/jsonresume-theme-name`) are no longer mangled and are listed by `resume themes`
- The default theme is now `even`; `elegant` crashes on resumes without optional sections. Pass `--theme elegant` to keep using it
- `init` without a TTY writes the resume (or refuses to overwrite one) instead of exiting silently
- PDF launch failures suggest `RESUME_PUPPETEER_NO_SANDBOX=1`, which is now documented
