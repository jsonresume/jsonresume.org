import { createTheme } from "@jsonresume/theme-primitives";
var design = "_1x093620";
const render = createTheme({
  slug: "type-foundry",
  layout: "balanced",
  defaultLanguage: "en",
  fonts: ["DM Serif Display:wght@400", "Work Sans:wght@400;600;700"],
  sidebarSections: [
    "education",
    "skills",
    "certificates",
    "languages",
    "interests",
    "awards"
  ],
  className: design,
  css: "._1x093620{--_1ucpvn50: #20262e;--_1ucpvn51: #4b5563;--_1ucpvn52: #17212a;--_1ucpvn54: #eef1f3;--_1ucpvn55: #17212a;--_1ucpvn56: #ffffff;--_1ucpvn53: #c8cfd5;--_1ucpvn57: Work Sans, Arial, sans-serif;--_1ucpvn58: DM Serif Display, Georgia, serif;--_1ucpvn59: 36px;--_1ucpvn5a: 24px;--_1ucpvn5b: 44px;--_1ucpvn5c: 16px;--_1ucpvn5d: 1.65;--_1ucpvn5e: 65px;--_1ucpvn5f: 19px;--_1ucpvn5g: 1120px}._1x093620[data-theme] ._1t9tjcq3{font-size:clamp(30px,5vw,65px);font-weight:400}._1x093620[data-theme] ._1t9tjcq1{padding-bottom:24px}._1x093620[data-theme] ._1t9tjcq8{gap:31px}._1x093620[data-theme] ._1t9tjcqc{border:0;padding:0;margin-bottom:14px}._1x093620[data-theme] ._1t9tjcq2{display:flex;flex-direction:column}._1x093620[data-theme] ._1t9tjcq4{order:-1;margin:0 0 12px;font-size:15px;letter-spacing:.07em}._1x093620[data-theme]{counter-reset:portfolio-section}._1x093620[data-theme] ._1t9tjcqb{counter-increment:portfolio-section}._1x093620[data-theme] ._1t9tjcqc:before{content:counter(portfolio-section,decimal-leading-zero) \" / \";font-family:ui-monospace,monospace;font-size:.72em}._1x093620[data-theme] ._1t9tjcqa{padding-inline-start:20px;border-inline-start:1px solid var(--_1ucpvn53)}@media screen and (max-width:640px){._1x093620[data-theme] ._1t9tjcqa{padding-inline-start:0;border:0}}\n"
});
const index = { render };
export {
  index as default,
  render
};
