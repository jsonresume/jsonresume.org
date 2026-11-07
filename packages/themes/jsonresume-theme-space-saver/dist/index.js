import { createTheme } from "@jsonresume/theme-primitives";
var design = "s1wv1v0";
const render = createTheme({
  slug: "space-saver",
  layout: "balanced",
  defaultLanguage: "en",
  fonts: ["DM Sans:wght@400;600;700"],
  sidebarSections: [
    "education",
    "skills",
    "certificates",
    "languages",
    "interests",
    "awards"
  ],
  className: design,
  css: ".s1wv1v0{--_1ucpvn50: #20262e;--_1ucpvn51: #4b5563;--_1ucpvn52: #17212a;--_1ucpvn54: #eef1f3;--_1ucpvn55: #17212a;--_1ucpvn56: #ffffff;--_1ucpvn53: #c8cfd5;--_1ucpvn57: DM Sans, Arial, sans-serif;--_1ucpvn58: DM Sans, Georgia, serif;--_1ucpvn59: 24px;--_1ucpvn5a: 16px;--_1ucpvn5b: 52px;--_1ucpvn5c: 15px;--_1ucpvn5d: 1.5;--_1ucpvn5e: 33px;--_1ucpvn5f: 19px;--_1ucpvn5g: 1080px}.s1wv1v0[data-theme] ._1t9tjcq3{font-size:clamp(30px,5vw,33px);font-weight:700}.s1wv1v0[data-theme] ._1t9tjcq1{padding-bottom:24px}.s1wv1v0[data-theme] ._1t9tjcq8{gap:40px}.s1wv1v0[data-theme] ._1t9tjcqc{border:0;padding:0;margin-bottom:14px}.s1wv1v0[data-theme] ._1t9tjcqa{padding-inline-start:20px;border-inline-start:1px solid var(--_1ucpvn53)}@media screen and (max-width:640px){.s1wv1v0[data-theme] ._1t9tjcqa{padding-inline-start:0;border:0}}\n"
});
const index = { render };
export {
  index as default,
  render
};
