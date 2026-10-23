'use client';

import { PreviewFrame } from '@jsonresume/ui';

const html = `<!doctype html><html><body style="font-family: Georgia, serif; padding: 48px 56px; color: #202020">
<h1 style="text-align:center; font-weight:600; margin:0">Richard Hendriks</h1>
<p style="text-align:center; color:#4b4b4b">Programmer · richard@piedpiper.com</p>
<h2 style="font-size:18px; border-bottom:1px solid #b8b8b2; padding-bottom:4px">Experience</h2>
<p><strong>CEO</strong> · Pied Piper · 2013 – 2014</p>
<p>Built a middle-out compression algorithm.</p></body></html>`;

// In the registry, srcDoc is the rendered theme or src is the resume URL.
export default function PreviewFrameResume() {
  return (
    <PreviewFrame
      title="Resume preview, Pro theme"
      srcDoc={html}
      height={420}
    />
  );
}
