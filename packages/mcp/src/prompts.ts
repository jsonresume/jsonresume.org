import { Effect, Layer, Schema } from 'effect';
import { McpServer } from 'effect/ai';
import { prompts } from './catalog';

const info = (name: string) => {
  const found = prompts.find((p) => p.name === name);
  if (!found) throw new Error(`${name} is not in the MCP catalog`);
  return { name, title: found.title, description: found.description };
};

const jobId = Schema.String.annotate({
  description:
    'A job id from search_jobs or match_jobs, or a jsonresume.org/jobs/… URL',
});
const optionalJob = Schema.optional(jobId);

const forJob = (job: string | undefined) =>
  job
    ? `the job ${job} (read it with get_job, taking the number from a URL)`
    : 'the kind of role I want next (ask me what that is first)';

/**
 * The registry's AI tools (suggestions, cover letters, interviews, job
 * matching) as prompts: the user's own agent does the writing, with the
 * tools for the facts.
 */
export const Prompts = Layer.mergeAll(
  McpServer.prompt({
    ...info('review_resume'),
    content: () =>
      Effect.succeed(
        'Review my resume. Read it with get_resume and check it with validate_resume. Then give me specific, prioritised feedback: what is missing, vague or unproven (no numbers or outcomes), what a recruiter would skip, and any schema problems. Propose concrete rewrites. Apply only the changes I agree to, with update_resume_section, and show me what changed.'
      ),
  }),
  McpServer.prompt({
    ...info('tailor_resume'),
    parameters: { job: jobId },
    content: ({ job }) =>
      Effect.succeed(
        `Tailor my resume to ${forJob(
          job
        )}. Read my resume with get_resume. Suggest changes to my summary (basics.summary), the order and wording of my work highlights, and my skills, so the most relevant experience comes first, without inventing anything. Show each change as before and after, and save only what I approve with update_resume_section.`
      ),
  }),
  McpServer.prompt({
    ...info('cover_letter'),
    parameters: { job: jobId },
    content: ({ job }) =>
      Effect.succeed(
        `Write a cover letter for ${forJob(
          job
        )}, from my resume (get_resume). Keep it under 300 words, specific to the company and role, with two or three achievements from my resume that match what they ask for. No clichés, nothing I haven't done. Then ask whether to mark the job as interested with mark_job.`
      ),
  }),
  McpServer.prompt({
    ...info('interview_practice'),
    parameters: { job: optionalJob },
    content: ({ job }) =>
      Effect.succeed(
        `Interview me for ${forJob(
          job
        )}. Read my resume with get_resume. Ask one question at a time, mixing questions about my own experience with ones about the role, and wait for my answer. After each answer, say briefly what was strong and what to improve, then ask the next. After about eight questions, sum up how I did.`
      ),
  }),
  McpServer.prompt({
    ...info('job_hunt'),
    content: () =>
      Effect.succeed(
        'Help me find jobs worth applying to. Read my resume with get_resume, then ask me, a few at a time: the role I want, remote or where, least pay, company stage, industries to avoid, and dealbreakers. Use match_jobs with matching filters (and search_jobs for anything specific), read the promising ones with get_job, and give me a shortlist with why each fits and any gaps. Record what I decide with mark_job (interested, maybe, applied or not_interested, with a note), so later rankings learn from it.'
      ),
  })
);
