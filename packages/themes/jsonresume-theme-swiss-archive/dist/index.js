import { createTheme } from "@jsonresume/theme-primitives";
var design = "_6umk2b0";
const render = createTheme({
  slug: "swiss-archive",
  layout: "balanced",
  defaultLanguage: "en",
  fonts: ["Inter:wght@400;600;700"],
  sidebarSections: [
    "education",
    "skills",
    "certificates",
    "languages",
    "interests",
    "awards"
  ],
  className: design,
  css: "._6umk2b0{--_1ucpvn50: #20262e;--_1ucpvn51: #4b5563;--_1ucpvn52: #9b3027;--_1ucpvn54: #fcf1ec;--_1ucpvn55: #76251f;--_1ucpvn56: #ffffff;--_1ucpvn53: #c8cfd5;--_1ucpvn57: Inter, Arial, sans-serif;--_1ucpvn58: Inter, Georgia, serif;--_1ucpvn59: 34px;--_1ucpvn5a: 25px;--_1ucpvn5b: 48px;--_1ucpvn5c: 16px;--_1ucpvn5d: 1.65;--_1ucpvn5e: 58px;--_1ucpvn5f: 19px;--_1ucpvn5g: 1100px}._6umk2b0[data-theme] ._1t9tjcq3{font-size:clamp(30px,5vw,58px);font-weight:700}._6umk2b0[data-theme] ._1t9tjcq1{padding-bottom:24px}._6umk2b0[data-theme] ._1t9tjcq8{gap:34px}._6umk2b0[data-theme] ._1t9tjcqc{border:0;padding:0;margin-bottom:14px}._6umk2b0[data-theme] ._1t9tjcq2{margin-inline-start:12%;padding-inline-start:22px;border-inline-start:7px solid var(--_1ucpvn52)}._6umk2b0[data-theme]{counter-reset:portfolio-section}._6umk2b0[data-theme] ._1t9tjcqb{counter-increment:portfolio-section}._6umk2b0[data-theme] ._1t9tjcqc:before{content:counter(portfolio-section,decimal-leading-zero) \" / \";font-family:ui-monospace,monospace;font-size:.72em}._6umk2b0[data-theme] ._1t9tjcqa{padding-inline-start:20px;border-inline-start:1px solid var(--_1ucpvn53)}@media screen and (max-width:640px){._6umk2b0[data-theme] ._1t9tjcq2{margin-inline-start:0}._6umk2b0[data-theme] ._1t9tjcqa{padding-inline-start:0;border:0}}\n"
});
const index = { render };
export {
  index as default,
  render
};
