import type { ResumeProblem } from '@repo/domain';
import { resumeFormats } from '@repo/profiles';

/** One sentence on what went wrong, for the JSON error of data formats. */
export function describeProblem(problem: ResumeProblem): string {
  switch (problem.kind) {
    case 'no-user':
      return `There is no GitHub user called ${problem.username}.`;
    case 'no-gist':
      return `${problem.username} has no public gist with a file called ${problem.file}.`;
    case 'not-json':
      return `${problem.file} in ${problem.username}'s gist is not valid JSON: ${problem.message}`;
    case 'not-object':
      return `${problem.file} in ${problem.username}'s gist must hold a JSON object.`;
    case 'github-down':
      return 'GitHub could not be reached. Try again in a minute.';
    case 'theme-missing':
      return `There is no theme called ${problem.theme}.`;
    case 'theme-failed':
      return `The ${problem.theme} theme could not render this resume.`;
    case 'unknown-format':
      return `.${
        problem.extension
      } is not a format we serve; try ${resumeFormats
        .map((f) => `.${f}`)
        .join(', ')}.`;
  }
}
