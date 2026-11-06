# @repo/resume-formats

A resume as JSON, YAML or plain text: `formatResume('txt', resume)` gives the
body and its content type. HTML comes from a theme (`@repo/resume-themes`).
The plain text is written for reading: header, then every standard section,
with structured locations and dates as text.

`toDocx(resume)` gives a Word document (built with the `docx` package): the
name as Word's Title, each section a Heading 1, each entry a Heading 2,
highlights and lists as real bullets, dates as "May 2021 – present". One
plain layout, editable anywhere a .docx opens. `/@username.docx` serves it.
