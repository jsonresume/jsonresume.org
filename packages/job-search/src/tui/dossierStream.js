/**
 * Parser for the Claude CLI `--output-format stream-json` output.
 *
 * Each call to processLine() consumes one NDJSON line, updates internal state
 * (the latest assistant text plus a tool-activity status line) and invokes
 * onText with the composed visible text. getResult() returns the final text.
 */

import { statusLineForTool, composeDossierText } from './aiHelpers.js';

export function createDossierStream(onText) {
  let finalResult = '';
  let statusLine = '';

  function processLine(line) {
    if (!line.trim()) return;
    let event;
    try {
      event = JSON.parse(line);
    } catch {
      // Not valid JSON, skip
      return;
    }

    if (event.type === 'assistant') {
      const content = event.message?.content || [];
      for (const block of content) {
        if (block.type === 'text' && block.text) {
          finalResult = block.text;
          onText(composeDossierText(statusLine, finalResult));
        } else if (block.type === 'tool_use') {
          statusLine = statusLineForTool(block);
          onText(composeDossierText(statusLine, finalResult));
        }
      }
    }

    if (event.type === 'result' && event.result) {
      finalResult = event.result;
      onText(finalResult);
    }
  }

  return {
    processLine,
    getResult: () => finalResult,
  };
}
