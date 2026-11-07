---
'@jsonresume/ui': patch
---

The app shell on phones: the menu button and account menu are 44px targets and never squeezed, the account menu shows the avatar alone below 600px (the name stays its accessible name), and `AppPage` actions move under the title, sharing a row at 44px tall (ghost actions take an outline there). `DropdownMenuItem asChild` no longer throws when rendering a link (Radix Slot needs a `Slottable`); links in menus drop the underline, and menu rows are 44px on touch screens. Desktop is unchanged.
