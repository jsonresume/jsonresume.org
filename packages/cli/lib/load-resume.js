import chalk from 'chalk';
import getResume from './get-resume';

// Load the resume from the given path, turning the low-level failures
// (missing file, unreadable stream, malformed JSON/YAML) into a single
// friendly, stack-trace-free message. Returns null on failure after printing
// the message and flagging a non-zero exit code, so callers can bail early
// instead of leaking an unhandled rejection / Node-internal stack trace.
const loadResumeOrReport = async (resumePath) => {
  try {
    return await getResume({ path: resumePath });
  } catch (err) {
    const label = resumePath === '-' ? 'stdin' : resumePath;
    console.error(chalk.red(`Could not read resume: ${label}`));
    console.error(err && err.message ? err.message : String(err));
    process.exitCode = 1;
    return null;
  }
};

export default loadResumeOrReport;
