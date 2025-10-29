export default `:root {
  --accent: #bc1b39;
  --anchor-color: #2c85b1;
  --blue: #2c85b1;
  --copy-color-light: #666666;
  --copy-color: #242424;
  --grey: #999999;
  --light-grey: #ededed;
  --white: #ffffff;
  --base-font-size: 12pt;
  --spacing-double: 1rem;
  --spacing-small: 0.1rem;
  --spacing: 0.5rem;
}
@media (min-width: 567px) {
  :root {
    --spacing-double: 1.5rem;
    --spacing-small: 0.25rem;
    --spacing: 0.75rem;
  }
}
@media print {
  :root {
    --anchor-color: #000000;
    --base-font-size: 9pt;
    --copy-color-light: #000000;
    --copy-color: #000000;
  }
}`;
