import { createTheme } from "@jsonresume/theme-primitives";
var design = "_19t76wr0";
const render = createTheme({
  slug: "academic-classic",
  className: design,
  layout: "academic",
  fonts: ["PT Serif:wght@400;700", "PT Sans:wght@400;700"],
  css: "._19t76wr0{--_1ucpvn50: #252d32;--_1ucpvn51: #4e5960;--_1ucpvn52: #1d5575;--_1ucpvn53: #b7c9d3;--_1ucpvn54: #f2f5f7;--_1ucpvn55: #183e4c;--_1ucpvn56: #ffffff;--_1ucpvn57: \"PT Serif\", Georgia, serif;--_1ucpvn58: \"PT Sans\", Arial, sans-serif;--_1ucpvn59: 32px;--_1ucpvn5a: 21px;--_1ucpvn5b: 50px;--_1ucpvn5c: 16px;--_1ucpvn5d: 1.6;--_1ucpvn5e: 42px;--_1ucpvn5f: 20px;--_1ucpvn5g: 960px}._19t76wr0 ._1t9tjcq1{display:grid;grid-template-columns:1fr minmax(180px,.65fr);column-gap:30px}._19t76wr0 ._1t9tjcq3{font-weight:400;color:var(--_1ucpvn52)}._19t76wr0 ._1t9tjcq5{display:block;text-align:right;margin-top:4px;font-family:PT Sans,Arial,sans-serif}._19t76wr0 ._1t9tjcq6{grid-column:1 / -1;max-width:none}._19t76wr0 ._1t9tjcqc{font-weight:400;border-bottom:1px solid var(--_1ucpvn53)}._19t76wr0 ._1t9tjcqg{font-family:PT Sans,Arial,sans-serif;color:var(--_1ucpvn52)}._19t76wr0 ._1t9tjcqh{font-style:italic}@media screen and (max-width:640px){._19t76wr0 ._1t9tjcq1{display:block}._19t76wr0 ._1t9tjcq5{text-align:left;margin-top:16px}}\n",
  sectionOrder: [
    "education",
    "work",
    "publications",
    "projects",
    "awards",
    "certificates",
    "volunteer",
    "skills",
    "languages",
    "interests",
    "references"
  ]
});
const theme = { render };
export {
  theme as default,
  render
};
