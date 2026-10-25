import {
  Button,
  Callout,
  ChatComposer,
  ChatMessage,
  ChatMessages,
  ChatToolCall,
  Markdown,
  Stack,
  Text,
} from '@jsonresume/ui';
import { useSession } from '../session';
import * as s from './pathways.css';
import type { useCopilot } from './useCopilot';

/** What each tool did, in the user's words. */
const toolLabels: Record<string, string> = {
  get_resume: 'Read your resume',
  save_resume: 'Saved your resume',
  update_resume_section: 'Updated your resume',
  validate_resume: 'Checked your resume',
  get_resume_schema: 'Read the resume schema',
  list_themes: 'Looked at themes',
  set_theme: 'Changed your theme',
  get_resume_analytics: 'Read who views your resume',
  get_account: 'Read your account',
  set_resume_source: 'Changed where your resume comes from',
  change_username: 'Changed your username',
  search_jobs: 'Searched jobs',
  match_jobs: 'Ranked jobs for you',
  get_job: 'Read a job',
  mark_job: 'Marked a job',
  list_marked_jobs: 'Read your marked jobs',
  get_career_directions: 'Mapped your directions',
  check_ats: 'Checked how tracking systems read it',
  export_resume: 'Made a file of your resume',
  search_resumes: 'Searched public resumes',
  set_explore_listing: 'Changed your Explore listing',
};

export const starters = [
  'Where could my career go next, given my resume?',
  'Find remote jobs that fit me and tell me which to apply for first.',
  'What would it take for me to reach a staff or lead role?',
  'Review my resume summary and suggest a sharper one.',
];

/** The copilot's conversation: messages, the tools it used, and the composer. */
export function Copilot({
  copilot,
}: {
  copilot: ReturnType<typeof useCopilot>;
}) {
  const user = useSession();
  const { turns, send, stop, reset, busy } = copilot;
  return (
    <div className={s.chat}>
      <ChatMessages label="Conversation with Pathways" scrollKey={turns}>
        {turns.length === 0 ? (
          <Stack gap={4}>
            <Text tone="muted">
              Pathways knows your resume and today’s open jobs. Ask where you
              could go next, what to learn, or have it improve your resume.
            </Text>
            <div className={s.starters}>
              {starters.map((q) => (
                <button
                  key={q}
                  type="button"
                  className={s.starter}
                  onClick={() => send(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </Stack>
        ) : null}
        {turns.map((turn, i) =>
          turn.role === 'user' ? (
            <ChatMessage
              key={i}
              role="user"
              author="You"
              avatarUrl={user.github?.avatarUrl ?? null}
            >
              <Text as="p">{turn.text}</Text>
            </ChatMessage>
          ) : (
            <ChatMessage
              key={i}
              role="assistant"
              author="Pathways"
              pending={turn.streaming && !turn.text && turn.tools.length === 0}
            >
              {turn.tools.length > 0 ? (
                <div className={s.tools}>
                  {turn.tools.map((t) => (
                    <ChatToolCall
                      key={t.id}
                      name={toolLabels[t.name] ?? t.name}
                      status={t.status}
                    />
                  ))}
                </div>
              ) : null}
              {turn.text ? (
                <Markdown externalLinks>{turn.text}</Markdown>
              ) : null}
              {turn.error ? (
                <Callout tone="danger">{turn.error}</Callout>
              ) : null}
            </ChatMessage>
          )
        )}
      </ChatMessages>
      <div className={s.composer}>
        <ChatComposer
          label="Message Pathways"
          placeholder="Ask about your next move…"
          busy={busy}
          onSubmit={send}
          actions={
            busy ? (
              <Button size="sm" variant="ghost" onClick={stop}>
                Stop
              </Button>
            ) : turns.length > 0 ? (
              <Button size="sm" variant="ghost" onClick={reset}>
                New conversation
              </Button>
            ) : null
          }
        />
      </div>
    </div>
  );
}
