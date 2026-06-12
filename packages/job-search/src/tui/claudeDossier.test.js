import { describe, it, expect } from 'vitest';
import { nestedClaudeEnv, CLAUDE_ARGS_PREFIX } from './claudeDossier.js';

describe('nestedClaudeEnv', () => {
  it('drops claude-nesting markers but keeps other vars', () => {
    const env = nestedClaudeEnv({
      PATH: '/usr/bin',
      CLAUDECODE: '1',
      CLAUDE_CODE_ENTRYPOINT: 'cli',
      CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS: 'x',
      OPENAI_API_KEY: 'sk',
    });
    expect(env.PATH).toBe('/usr/bin');
    expect(env.OPENAI_API_KEY).toBe('sk');
    expect(env.CLAUDECODE).toBeUndefined();
    expect(env.CLAUDE_CODE_ENTRYPOINT).toBeUndefined();
    expect(env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS).toBeUndefined();
  });

  it('does not mutate the source env', () => {
    const src = { CLAUDECODE: '1' };
    nestedClaudeEnv(src);
    expect(src.CLAUDECODE).toBe('1');
  });
});

describe('CLAUDE_ARGS_PREFIX', () => {
  it('requests stream-json with web tools and ends with the arg separator', () => {
    expect(CLAUDE_ARGS_PREFIX).toEqual([
      '--print',
      '--output-format',
      'stream-json',
      '--verbose',
      '--allowedTools',
      'WebSearch',
      'WebFetch',
      '--',
    ]);
  });
});
