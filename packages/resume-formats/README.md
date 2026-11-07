# @repo/resume-formats

A resume as JSON, YAML or plain text: `formatResume('txt', resume)` gives the
body and its content type. HTML comes from a theme (`@repo/resume-themes`).
The plain text is written for reading: header, then every standard section,
with structured locations and dates as text.

`toDocx(resume, paper)` gives a Word document (built with the `docx`
package): the name as Word's Title, each section a Heading 1, each entry a
Heading 2, highlights and lists as real bullets, dates as "May 2021 –
present". One plain layout, editable anywhere a .docx opens, on A4 or Letter
(`/@username.docx` uses the PDF's paper rule, `?paper=` first). Arabic and
Hebrew paragraphs run right to left (Arial for those scripts, Calibri
otherwise), and characters XML forbids (control codes pasted from PDFs) are
dropped, since one would make Word refuse the file. `docx.valid.test.ts`
checks the package (parts, content types, relationships, styles, lists,
well-formed XML) for the complete sample and an edge-case resume; both were
also converted with LibreOffice 25.8 headless and checked by eye.
