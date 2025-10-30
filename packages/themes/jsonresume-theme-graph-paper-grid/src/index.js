import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import Resume from './Resume.jsx';
import React from 'react';

export function render(resume) {
  const sheet = new ServerStyleSheet();

  try {
    const html = renderToString(
      sheet.collectStyles(<Resume resume={resume} />)
    );
    const styles = sheet.getStyleTags();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resume.basics?.name || 'Resume'} - Curriculum Vitae</title>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Roboto+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">

  ${styles}

  <style>
    * {
      box-sizing: border-box;
    }

    html {
      margin: 0;
      padding: 0;
    }

    body {
      margin: 0;
      padding: 0;
      background:
        linear-gradient(to right, #e5e7eb 1px, transparent 1px),
        linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
      background-size: 20px 20px;
      background-color: #f3f4f6;
      background-attachment: fixed;
    }

    @media print {
      body {
        background: white;
      }

      @page {
        margin: 0.5cm;
      }
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
  } finally {
    sheet.seal();
  }
}
