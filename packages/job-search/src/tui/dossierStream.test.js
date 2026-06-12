import { describe, it, expect, vi } from 'vitest';
import { createDossierStream } from './dossierStream.js';

function lines(...objs) {
  return objs.map((o) => JSON.stringify(o));
}

describe('createDossierStream', () => {
  it('ignores blank and non-JSON lines', () => {
    const onText = vi.fn();
    const s = createDossierStream(onText);
    s.processLine('');
    s.processLine('   ');
    s.processLine('not json {');
    expect(onText).not.toHaveBeenCalled();
    expect(s.getResult()).toBe('');
  });

  it('captures assistant text blocks as the running result', () => {
    const onText = vi.fn();
    const s = createDossierStream(onText);
    const [line] = lines({
      type: 'assistant',
      message: { content: [{ type: 'text', text: 'Hello world' }] },
    });
    s.processLine(line);
    expect(onText).toHaveBeenLastCalledWith('Hello world');
    expect(s.getResult()).toBe('Hello world');
  });

  it('prefixes a tool status line before existing result text', () => {
    const onText = vi.fn();
    const s = createDossierStream(onText);
    const [textLine, toolLine] = lines(
      {
        type: 'assistant',
        message: { content: [{ type: 'text', text: 'Body' }] },
      },
      {
        type: 'assistant',
        message: {
          content: [
            { type: 'tool_use', name: 'WebSearch', input: { query: 'q' } },
          ],
        },
      }
    );
    s.processLine(textLine);
    s.processLine(toolLine);
    expect(onText).toHaveBeenLastCalledWith('🔍 WebSearch: q\n\nBody');
  });

  it('shows the status line alone when no result text yet', () => {
    const onText = vi.fn();
    const s = createDossierStream(onText);
    const [toolLine] = lines({
      type: 'assistant',
      message: {
        content: [{ type: 'tool_use', name: 'WebFetch', input: { url: 'u' } }],
      },
    });
    s.processLine(toolLine);
    expect(onText).toHaveBeenLastCalledWith('🔍 WebFetch: u');
  });

  it('overrides result with the final result event', () => {
    const onText = vi.fn();
    const s = createDossierStream(onText);
    const [textLine, resultLine] = lines(
      {
        type: 'assistant',
        message: { content: [{ type: 'text', text: 'partial' }] },
      },
      { type: 'result', result: 'FINAL ANSWER' }
    );
    s.processLine(textLine);
    s.processLine(resultLine);
    expect(s.getResult()).toBe('FINAL ANSWER');
    expect(onText).toHaveBeenLastCalledWith('FINAL ANSWER');
  });
});
