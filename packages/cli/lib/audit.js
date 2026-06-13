import chalk from 'chalk';
import renderHTML from './render-html';
import { ThemeNotFoundError, formatThemeNotFound } from './theme-errors';
import { loadValidator } from './ats-validator';

// Map a coarse ATS-compatibility band to a chalk colorizer so the headline
// score reads at a glance.
const colorForCompatibility = (compatibility) => {
  switch (compatibility) {
    case 'excellent':
      return chalk.green;
    case 'good':
      return chalk.cyan;
    case 'fair':
      return chalk.yellow;
    default:
      return chalk.red;
  }
};

// Build the human-readable report lines from a validateATS() result. Kept pure
// (no console / no process) so it is trivially unit-testable.
export const formatAuditReport = (result, recommendations) => {
  const color = colorForCompatibility(result.atsCompatibility);
  const lines = [];

  lines.push('');
  lines.push(
    color(
      `ATS score: ${result.score}/100  (grade ${result.grade}, ${result.atsCompatibility})`,
    ),
  );
  lines.push(
    chalk.gray(
      `${result.passed}/${result.checks.length} checks passed, ${result.failed} need attention`,
    ),
  );
  lines.push('');
  lines.push(chalk.bold('Checks:'));
  result.checks.forEach((check) => {
    const mark = check.passed ? chalk.green('✓') : chalk.red('✗');
    lines.push(`  ${mark} ${check.name} (${check.score}/${check.maxScore})`);
  });

  if (recommendations.length > 0) {
    lines.push('');
    lines.push(chalk.bold('Recommendations:'));
    recommendations.forEach((rec) => {
      lines.push(`  - ${rec}`);
    });
  }

  lines.push('');
  return lines.join('\n');
};

// Run an ATS-friendliness audit: render the resume to HTML with `themePath`,
// score it with @jsonresume/ats-validator, and print an advisory report.
//
// `resume` is an already-loaded/parsed resume object (callers reuse the shared
// loader). Render/validator failures are reported through the friendly error
// path and surfaced via a non-zero exit; a successful audit always exits 0 —
// the score is advisory, not a gate.
const audit = async ({ resume, themePath, log = console.log }) => {
  let html;
  try {
    html = await renderHTML({ resume, themePath });
  } catch (err) {
    if (err instanceof ThemeNotFoundError) {
      console.error(formatThemeNotFound(err.theme));
    } else {
      console.error(chalk.red(err && err.message ? err.message : String(err)));
    }
    process.exitCode = 1;
    return;
  }

  let result;
  let recommendations;
  try {
    const { validateATS, getRecommendations } = await loadValidator();
    result = validateATS(html);
    recommendations = getRecommendations(result);
  } catch (err) {
    console.error(
      chalk.red(
        `Could not audit resume: ${
          err && err.message ? err.message : String(err)
        }`,
      ),
    );
    process.exitCode = 1;
    return;
  }

  log(formatAuditReport(result, recommendations));
};

export default audit;
