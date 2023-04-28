import { Resume } from "./Resume";
import { renderToString } from "react-dom/server";
import type { Resume as ResumeType } from "./types";
import { readFileSync } from "fs";
import path from "path";
const css = readFileSync(path.join(__dirname, "../style.css")).toString();

type Language = "en" | "de";

const createRender = (language: Language) => (resume: ResumeType) =>
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My App</title>
    <style>${css}</style>
  </head>
  <body>
    <div id="root">${renderToString(<Resume {...resume} />)}</div>
  </body>
</html>`;

const marginValue = "0.8 cm";
const pdfRenderOptions = {
  margin: {
    top: marginValue,
    bottom: marginValue,
    left: marginValue,
    right: marginValue,
  },
};

export const createTheme = (language: Language = "en") => ({
  pdfRenderOptions,
  render: createRender(language),
});
