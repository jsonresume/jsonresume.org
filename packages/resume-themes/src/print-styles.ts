/** Safe defaults also cover third-party themes that supply no page margins. */
export const PRINT_DEFAULTS = `<style data-jsonresume-print-defaults>
@page{margin:12mm}
@media print{
body,h1,h2,h3,h4,p,li,a{overflow-wrap:anywhere}
:where(main,aside,section,article,header,div){min-width:0}
h1,h2,h3,h4,h5,h6{break-inside:avoid;break-after:avoid}
p,li{orphans:2;widows:2}
*,*::before,*::after{animation:none!important;transition:none!important}
}
</style>`;

const externalMargins = new Set([
  'elegant',
  'even',
  'jacrys',
  'kendall',
  'lucide',
  'macchiato',
  'minyma',
  'paper-plus-plus',
  'pumpkin',
  'rickosborne',
  'tan-responsive',
  'two-column',
]);

/** Compatibility fixes for older npm themes; these apply only while printing. */
const overrides: Readonly<Record<string, string>> = {
  jacrys: '.list-group-item{break-inside:avoid}',
  macchiato: `.page{height:auto;min-height:0;padding:0}.container{page-break-inside:auto}
    .resume-content{display:grid;grid-template-columns:minmax(0,.3fr) minmax(0,1fr);gap:18px}
    .left-column{float:none;width:auto;margin:0;min-width:0}
    .right-column{float:none;overflow:visible;min-width:0}
    .references-container .item{break-inside:avoid}`,
  'two-column': `.masthead{overflow:visible}.masthead__top{flex-wrap:wrap;gap:4mm}
    .identity__name,.contact,.row__value{white-space:normal}
    .contact a{min-width:0;overflow-wrap:anywhere}
    .identity__name{font-size:28pt;line-height:1.15}.contacts{flex:1 1 42%;min-width:0;max-width:100%}`,
  even: `body{grid-template-columns:[full-start main-start side-start] minmax(0,8em) [side-end content-start] minmax(0,1fr) [main-end content-end full-end];gap:1.5em;--secondaryColor:#5c6864;--accentColor:#7b5f00;--linkColor:#226348}
  .masthead{padding:1.5em 0}.masthead>*{min-width:0}
  h1{font-size:28pt}h2{font-size:16pt}h3{font-size:12pt}`,
  'tan-responsive': `.instaFade,.quickFade{opacity:1!important}
  #cv{margin:0;width:100%;max-width:none}#mainArea{padding:0}
  #headshot:has(img[src]:not([src=""])){display:block}
  #headshot img{max-height:28mm;object-fit:cover}
  section .sectionTitle,section .sectionContent{float:none;width:auto}
  section .sectionTitle{margin-bottom:3mm}section{break-inside:auto}`,
};

/** Keep theme CSS authoritative except for demonstrated legacy print defects. */
export function withPrintStyles(html: string, theme: string): string {
  const defaults = html.replace(/(<head(?:\s[^>]*)?>)/i, `$1${PRINT_DEFAULTS}`);
  const margins = externalMargins.has(theme)
    ? '@page{margin:12mm!important}@page:first{margin:12mm!important}'
    : '';
  const css = overrides[theme] ?? '';
  return defaults.replace(
    /<\/head>/i,
    `<style data-jsonresume-print-fixes>@page{size:auto!important}${margins}@media print{${css}}</style></head>`
  );
}
