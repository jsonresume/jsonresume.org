import { createTheme } from "@jsonresume/theme-primitives";
var design = "g3r62t0";
const render = createTheme({
  slug: "council-profile",
  layout: "balanced",
  defaultLanguage: "en",
  fonts: ["EB Garamond:wght@400;600;700", "Lato:wght@400;600;700"],
  sidebarSections: [
    "education",
    "skills",
    "certificates",
    "languages",
    "interests",
    "awards"
  ],
  className: design,
  css: ".g3r62t0{--_1ucpvn50: #20262e;--_1ucpvn51: #4b5563;--_1ucpvn52: #33604a;--_1ucpvn54: #f0f5ef;--_1ucpvn55: #294b39;--_1ucpvn56: #ffffff;--_1ucpvn53: #c8cfd5;--_1ucpvn57: Lato, Arial, sans-serif;--_1ucpvn58: EB Garamond, Georgia, serif;--_1ucpvn59: 32px;--_1ucpvn5a: 24px;--_1ucpvn5b: 52px;--_1ucpvn5c: 16px;--_1ucpvn5d: 1.65;--_1ucpvn5e: 42px;--_1ucpvn5f: 19px;--_1ucpvn5g: 1020px}.g3r62t0[data-theme] ._1t9tjcq3{font-size:clamp(30px,5vw,42px);font-weight:700}.g3r62t0[data-theme] ._1t9tjcq1{padding-bottom:24px}.g3r62t0[data-theme] ._1t9tjcq8{gap:40px}.g3r62t0[data-theme] ._1t9tjcqc{border:0;padding:0;margin-bottom:14px}.g3r62t0[data-theme] ._1t9tjcq1{border-bottom:1px solid var(--_1ucpvn52)}.g3r62t0[data-theme] ._1t9tjcqc{padding-bottom:7px;border-bottom:1px solid var(--_1ucpvn52)}.g3r62t0[data-theme] ._1t9tjcqa{padding-inline-start:20px;border-inline-start:1px solid var(--_1ucpvn53)}@media screen and (max-width:640px){.g3r62t0[data-theme] ._1t9tjcqa{padding-inline-start:0;border:0}}\n"
});
const index = { render };
export {
  index as default,
  render
};
