# @jsonresume/ui

## 0.2.0

### Minor Changes

- 3d8ae9e: Dashboard components: `TimeSeriesChart`, `BarList`, `Sparkline`, `AppShell`, `AppNav`, `AppPage`, `AuthCard` and `GithubIcon`; `StatTile` gains `delta` and `trend`, `Divider` a `label`. Chart colour tokens (`vars.color.chart`), validated for colour-blind separation and contrast in both themes. Base link colour now applies to plain links only, so links styled as buttons keep their colours on hover.
- 157fdb3: Pieces for editors: `AppPage` `fill` (the content takes the rest of the screen from lg up), `PreviewFrame` `height="fill"` and `busy`, `Select` `inline`, and a `useSettledValue` hook. `AppPage` content no longer widens past the screen when it holds long lines of code.
- 7b1bf0b: `Text` gains `success`, `warning` and `danger` tones for status words beside a field, and `Card` a `danger` tone for irreversible actions. `PageHeader` actions now wrap on narrow screens instead of overflowing.

### Patch Changes

- 77a952e: `AppPage` actions centre vertically, so status text lines up with the buttons beside it.
