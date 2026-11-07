import { createTheme } from "@jsonresume/theme-primitives";
var design = "_1r9vluv0";
const render = createTheme({
  slug: "gallery-catalogue",
  layout: "balanced",
  defaultLanguage: "en",
  fonts: ["DM Serif Display:wght@400", "Source Sans 3:wght@400;600;700"],
  sidebarSections: [
    "education",
    "skills",
    "certificates",
    "languages",
    "interests",
    "awards"
  ],
  className: design,
  css: "._1r9vluv0{--_1ucpvn50: #20262e;--_1ucpvn51: #4b5563;--_1ucpvn52: #383838;--_1ucpvn54: #f5f5f3;--_1ucpvn55: #303030;--_1ucpvn56: #ffffff;--_1ucpvn53: #c8cfd5;--_1ucpvn57: Source Sans 3, Arial, sans-serif;--_1ucpvn58: DM Serif Display, Georgia, serif;--_1ucpvn59: 36px;--_1ucpvn5a: 25px;--_1ucpvn5b: 44px;--_1ucpvn5c: 16px;--_1ucpvn5d: 1.65;--_1ucpvn5e: 45px;--_1ucpvn5f: 19px;--_1ucpvn5g: 1080px}._1r9vluv0[data-theme] ._1t9tjcq3{font-size:clamp(30px,5vw,45px);font-weight:400}._1r9vluv0[data-theme] ._1t9tjcq1{padding-bottom:24px}._1r9vluv0[data-theme] ._1t9tjcq8{gap:28px}._1r9vluv0[data-theme] ._1t9tjcqc{border:0;padding:0;margin-bottom:14px}._1r9vluv0[data-theme]{counter-reset:portfolio-section}._1r9vluv0[data-theme] ._1t9tjcqb{counter-increment:portfolio-section}._1r9vluv0[data-theme] ._1t9tjcqc:before{content:counter(portfolio-section,decimal-leading-zero) \" / \";font-family:ui-monospace,monospace;font-size:.72em}._1r9vluv0[data-theme] ._1t9tjcqa{padding-inline-start:20px;border-inline-start:1px solid var(--_1ucpvn53)}@media screen and (max-width:640px){._1r9vluv0[data-theme] ._1t9tjcqa{padding-inline-start:0;border:0}}\n"
});
const index = { render };
export {
  index as default,
  render
};
