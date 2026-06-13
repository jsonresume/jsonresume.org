import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

/**
 * Render a @jsonresume/core component to static HTML using the same
 * ServerStyleSheet path themes use for SSR. Returns both the markup and the
 * collected style tags so tests can assert on output without a DOM or DB.
 *
 * @param {React.ReactElement} element
 * @returns {{ html: string, css: string }}
 */
export function renderHtml(element) {
  const sheet = new ServerStyleSheet();
  try {
    const html = renderToStaticMarkup(
      <StyleSheetManager sheet={sheet.instance}>{element}</StyleSheetManager>
    );
    const css = sheet.getStyleTags();
    return { html, css };
  } finally {
    sheet.seal();
  }
}
