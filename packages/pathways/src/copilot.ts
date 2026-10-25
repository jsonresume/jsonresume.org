import { OpenAiClient, OpenAiLanguageModel } from '@effect/ai-openai';
import type { UserRecord } from '@repo/accounts';
import type { CopilotEvent, CopilotMessage } from '@repo/api';
import { AgentHandlers, AgentToolkit, McpCaller } from '@repo/mcp';
import { Config, Context, Effect, Layer, Option, Ref, Stream } from 'effect';
import { type AiError, Chat, type LanguageModel } from 'effect/ai';
import { FetchHttpClient } from 'effect/http';
import { system } from './prompt';

/** Tool rounds in one reply, at most: enough to look things up and act. */
const MAX_STEPS = 8;
/** Earlier messages kept, so long conversations stay within the model's reach. */
const HISTORY = 30;

const unavailable: Stream.Stream<CopilotEvent> = Stream.make({
  type: 'error',
  message: 'Pathways is not set up on this server (OPENAI_API_KEY).',
});

/**
 * Pathways' copilot: a conversation with an OpenAI model that has every MCP
 * tool, acting as the signed-in user. A reply streams as CopilotEvents: its
 * text as it's written, and each tool it uses.
 */
export class Copilot extends Context.Service<
  Copilot,
  {
    reply(
      user: UserRecord,
      messages: ReadonlyArray<CopilotMessage>
    ): Stream.Stream<CopilotEvent>;
  }
>()('@repo/pathways/Copilot') {
  /** Needs AgentHandlers' services (Accounts, AnalyticsStore, JobBoard, JobMatcher). */
  static readonly layer = Layer.effect(
    Copilot,
    Effect.gen(function* () {
      const key = yield* Config.option(Config.Redacted('OPENAI_API_KEY'));
      const name = yield* Config.String('PATHWAYS_MODEL').pipe(
        Config.withDefault('gpt-5-mini')
      );
      if (Option.isNone(key)) return Copilot.of({ reply: () => unavailable });
      // Not strict: the resume tools take free-form JSON (a whole resume, a
      // section), which strict function schemas can't describe.
      const model = yield* OpenAiLanguageModel.model(name, {
        reasoning: { effort: 'low' },
        strictJsonSchema: false,
      }).captureRequirements.pipe(
        Effect.provide(
          OpenAiClient.layer({ apiKey: key.value }).pipe(
            Layer.provide(FetchHttpClient.layer)
          )
        )
      );

      return Copilot.of({ reply: yield* replyWith(model) });
    })
  ).pipe(Layer.provide(AgentHandlers));

  /** With a given model (tests use a scripted one). */
  static readonly layerWith = (
    model: Layer.Layer<LanguageModel.LanguageModel>
  ) =>
    Layer.effect(
      Copilot,
      Effect.map(replyWith(model), (reply) => Copilot.of({ reply }))
    ).pipe(Layer.provide(AgentHandlers));
}

/** Replies with this model and every MCP tool. */
const replyWith = (model: Layer.Layer<LanguageModel.LanguageModel>) =>
  Effect.gen(function* () {
    const toolkit = yield* AgentToolkit;
    const reply = (user: UserRecord, messages: ReadonlyArray<CopilotMessage>) =>
      Stream.unwrap(
        Effect.gen(function* () {
          const today = new Date().toISOString().slice(0, 10);
          const chat = yield* Chat.fromPrompt([
            { role: 'system', content: system(user.username, today) },
            ...messages.slice(-HISTORY),
          ]);
          const usedTools = yield* Ref.make(false);

          const step = (
            n: number
          ): Stream.Stream<CopilotEvent, AiError.AiError> =>
            chat.streamText({ prompt: [], toolkit }).pipe(
              Stream.provide(model),
              Stream.flatMap((part): Stream.Stream<CopilotEvent> => {
                switch (part.type) {
                  case 'text-delta':
                    return Stream.make({ type: 'text', delta: part.delta });
                  case 'tool-call':
                    return Stream.fromEffect(
                      Ref.set(usedTools, true).pipe(
                        Effect.as<CopilotEvent>({
                          type: 'tool',
                          id: part.id,
                          name: part.name,
                          status: 'running',
                        })
                      )
                    );
                  case 'tool-result':
                    return Stream.make({
                      type: 'tool',
                      id: part.id,
                      name: part.name,
                      status: part.isFailure ? 'error' : 'done',
                    });
                  default:
                    return Stream.empty;
                }
              }),
              // After a round of tools, the model reads their results and goes on.
              Stream.concat(
                Stream.unwrap(
                  Effect.gen(function* () {
                    const again = yield* Ref.getAndSet(usedTools, false);
                    return again && n < MAX_STEPS ? step(n + 1) : Stream.empty;
                  })
                )
              )
            );

          return step(1).pipe(
            Stream.concat(Stream.make({ type: 'done' as const })),
            Stream.provideService(McpCaller, user)
          );
        })
      ).pipe(
        Stream.catchCause((cause) =>
          Stream.fromEffect(
            Effect.logError('Pathways reply failed', cause).pipe(
              Effect.as<CopilotEvent>({
                type: 'error',
                message: 'Something went wrong. Try again in a moment.',
              })
            )
          )
        )
      );

    return reply;
  });
