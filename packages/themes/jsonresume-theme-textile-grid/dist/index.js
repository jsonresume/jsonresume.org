import { createTheme } from "@jsonresume/theme-primitives";
var design = "_1eemnt20";
const render = createTheme({
  slug: "textile-grid",
  layout: "balanced",
  defaultLanguage: "en",
  fonts: ["Cormorant Garamond:wght@400;600;700", "Figtree:wght@400;600;700"],
  sidebarSections: [
    "education",
    "skills",
    "certificates",
    "languages",
    "interests",
    "awards"
  ],
  className: design,
  css: "._1eemnt20{--_1ucpvn50: #20262e;--_1ucpvn51: #4b5563;--_1ucpvn52: #703d80;--_1ucpvn54: #f5eff8;--_1ucpvn55: #51265f;--_1ucpvn56: #ffffff;--_1ucpvn53: #c8cfd5;--_1ucpvn57: Figtree, Arial, sans-serif;--_1ucpvn58: Cormorant Garamond, Georgia, serif;--_1ucpvn59: 34px;--_1ucpvn5a: 23px;--_1ucpvn5b: 52px;--_1ucpvn5c: 16px;--_1ucpvn5d: 1.65;--_1ucpvn5e: 46px;--_1ucpvn5f: 19px;--_1ucpvn5g: 1100px}._1eemnt20[data-theme] ._1t9tjcq3{font-size:clamp(30px,5vw,46px);font-weight:700}._1eemnt20[data-theme] ._1t9tjcq1{padding-bottom:24px}._1eemnt20[data-theme] ._1t9tjcq8{gap:37px}._1eemnt20[data-theme] ._1t9tjcqc{border:0;padding:0;margin-bottom:14px}._1eemnt20[data-theme] ._1t9tjcq1{border-top:5px solid var(--_1ucpvn52);padding-top:24px}._1eemnt20[data-theme] ._1t9tjcqc{border-inline-start:3px solid var(--_1ucpvn52);padding-inline-start:11px}._1eemnt20[data-theme] ._1t9tjcqa{padding-inline-start:20px;border-inline-start:1px solid var(--_1ucpvn53)}@media screen and (max-width:640px){._1eemnt20[data-theme] ._1t9tjcqa{padding-inline-start:0;border:0}}\n"
});
const index = { render };
export {
  index as default,
  render
};
