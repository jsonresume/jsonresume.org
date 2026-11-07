import { createTheme } from "@jsonresume/theme-primitives";
var design = "_2t0a230";
const render = createTheme({
  slug: "alta",
  className: design,
  layout: "achievement",
  fonts: ["Lato:wght@400;700", "Merriweather Sans:wght@400;600;700"],
  css: "._2t0a230{--_1ucpvn50: #302b32;--_1ucpvn51: #5e515f;--_1ucpvn52: #763953;--_1ucpvn53: #c7b3bd;--_1ucpvn54: #f5eef1;--_1ucpvn55: #183e4c;--_1ucpvn56: #ffffff;--_1ucpvn57: Lato, Arial, sans-serif;--_1ucpvn58: \"Merriweather Sans\", Arial, sans-serif;--_1ucpvn59: 31px;--_1ucpvn5a: 23px;--_1ucpvn5b: 46px;--_1ucpvn5c: 16px;--_1ucpvn5d: 1.55;--_1ucpvn5e: 42px;--_1ucpvn5f: 18px;--_1ucpvn5g: 980px}._2t0a230 ._1t9tjcq3{color:var(--_1ucpvn52);letter-spacing:-.015em}._2t0a230 ._1t9tjcq4{color:var(--_1ucpvn50);font-weight:700;font-size:19px}._2t0a230 ._1t9tjcqc{text-transform:uppercase;padding-bottom:9px;letter-spacing:.015em}._2t0a230 ._1t9tjcqh{color:var(--_1ucpvn52)}._2t0a230 ._1t9tjcqa{font-size:15px}._2t0a230 ._1t9tjcqa ._1t9tjcqe{display:block}._2t0a230 ._1t9tjcqa ._1t9tjcqg{margin-top:5px}._2t0a230 ._1t9tjcqa ._1t9tjcqc{font-size:16px}\n",
  sidebarSections: [
    "awards",
    "skills",
    "languages",
    "interests",
    "certificates"
  ]
});
const theme = { render };
export {
  theme as default,
  render
};
