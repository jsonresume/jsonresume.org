/**
 * Spawn the Claude Code CLI to generate a research dossier and stream its
 * output. Isolated from React so the spawn/stream/lifecycle logic can be
 * reasoned about (and replaced) independently of the hook state.
 */

import { createDossierStream } from './dossierStream.js';

// Locate the `claude` binary. Throws if not installed.
export async function resolveClaudePath() {
  const { execSync } = await import('child_process');
  return execSync('which claude', { encoding: 'utf-8' }).trim();
}

// Env for nested claude sessions — drop the markers that block nesting.
export function nestedClaudeEnv(baseEnv = process.env) {
  const env = { ...baseEnv };
  delete env.CLAUDECODE;
  delete env.CLAUDE_CODE_ENTRYPOINT;
  delete env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS;
  return env;
}

export const CLAUDE_ARGS_PREFIX = [
  '--print',
  '--output-format',
  'stream-json',
  '--verbose',
  '--allowedTools',
  'WebSearch',
  'WebFetch',
  '--',
];

/**
 * Spawn claude with the prompt, stream parsed text through onText, and resolve
 * with the final result string once the process closes.
 *
 * @param {object} opts
 * @param {string} opts.claudePath  resolved path to the claude binary
 * @param {string} opts.prompt      dossier prompt
 * @param {(text:string)=>void} opts.onText  called with composed visible text
 * @param {(child:any)=>void} opts.onChild   receives the spawned child process
 * @param {(child:any)=>void} [opts.onEnd]   called when the process closes/errors
 * @returns {Promise<string>} final result text
 */
export async function runClaudeDossier({
  claudePath,
  prompt,
  onText,
  onChild,
  onEnd,
}) {
  const { spawn } = await import('child_process');
  const env = nestedClaudeEnv();

  const child = spawn(claudePath, [...CLAUDE_ARGS_PREFIX, prompt], {
    stdio: ['ignore', 'pipe', 'pipe'],
    env,
  });
  onChild?.(child);

  const stream = createDossierStream(onText);
  let buffer = '';

  child.stdout.on('data', (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      stream.processLine(line);
    }
  });

  child.stderr.on('data', () => {});

  await new Promise((resolve, reject) => {
    child.on('close', (code) => {
      onEnd?.(child);
      // Process any remaining buffered partial line.
      if (buffer.trim()) stream.processLine(buffer);
      if (code === 0) {
        resolve();
      } else if (code !== null) {
        reject(new Error(`Claude exited with code ${code}`));
      } else {
        resolve(); // killed
      }
    });
    child.on('error', (err) => {
      onEnd?.(child);
      reject(err);
    });
  });

  return stream.getResult();
}
