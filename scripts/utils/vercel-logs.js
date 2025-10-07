const { execSync } = require('child_process');

async function fetchVercelLogs(project) {
  try {
    // Use gtimeout (macOS) or timeout (Linux) with SIGKILL to force termination after 5 seconds
    const timeoutCmd = execSync('which gtimeout 2>/dev/null || which timeout', {
      encoding: 'utf8',
    }).trim();
    const result = execSync(
      `${timeoutCmd} -s SIGKILL 5 bash -c "VERCEL_TOKEN=${process.env.VERCEL_TOKEN} vercel logs ${project.url} --json 2>&1" || true`,
      { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
    );

    return result;
  } catch (error) {
    console.error(`Failed to fetch logs for ${project.name}:`, error.message);
    return '';
  }
}

function parseErrors(logs) {
  const errors = [];
  const lines = logs.split('\n');

  // Skip CLI header lines - only parse actual log output
  const cliHeaders =
    /^(Vercel CLI|Fetching|Displaying|waiting for|Error: No existing credentials)/i;

  for (const line of lines) {
    if (!line.trim()) continue;

    // Skip Vercel CLI informational/error messages
    if (cliHeaders.test(line)) continue;

    try {
      const log = JSON.parse(line);

      // Filter for error-level logs or logs containing error keywords
      const isError =
        log.level === 'error' ||
        (log.message &&
          log.message.match(/error|exception|failed|fatal/i) &&
          !log.message.match(/successfully|resolved/i));

      if (isError) {
        errors.push({
          message: log.message || line,
          stack: log.stack ? [log.stack] : [],
          timestamp: log.timestamp || new Date().toISOString(),
        });
      }
    } catch (e) {
      // If not JSON, skip it - we only want actual JSON log entries
      // This prevents CLI messages from being treated as errors
      continue;
    }
  }

  return errors;
}

module.exports = {
  fetchVercelLogs,
  parseErrors,
};
