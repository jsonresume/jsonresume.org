import { Config, Context, Effect, Layer, Option, Redacted } from 'effect';
import { FetchHttpClient, HttpClient, HttpClientRequest } from 'effect/http';

export interface Mail {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Sends email. With RESEND_API_KEY set it goes through Resend; without, the
 * message (links included) is logged, so sign-up still works on a server
 * that can't send mail yet, and `enabled` tells the pages to say so.
 */
export class Mailer extends Context.Service<
  Mailer,
  { readonly enabled: boolean; send(mail: Mail): Effect.Effect<void> }
>()('@repo/accounts/Mailer') {
  static readonly log = Layer.succeed(
    Mailer,
    Mailer.of({
      enabled: false,
      send: (mail) =>
        Effect.logWarning(
          'Email not sent: no provider configured (RESEND_API_KEY)',
          {
            to: mail.to,
            subject: mail.subject,
            text: mail.text,
          }
        ),
    })
  );

  static readonly layer = Layer.unwrap(
    Effect.gen(function* () {
      const key = yield* Config.option(Config.Redacted('RESEND_API_KEY'));
      const from = yield* Config.String('MAIL_FROM').pipe(
        Config.withDefault('JSON Resume <no-reply@jsonresume.org>')
      );
      if (Option.isNone(key)) return Mailer.log;
      return Layer.effect(
        Mailer,
        Effect.gen(function* () {
          const client = HttpClient.filterStatusOk(
            yield* HttpClient.HttpClient
          );
          return Mailer.of({
            enabled: true,
            send: (mail) =>
              HttpClientRequest.post('https://api.resend.com/emails').pipe(
                HttpClientRequest.bearerToken(Redacted.value(key.value)),
                HttpClientRequest.bodyJsonUnsafe({ from, ...mail }),
                client.execute,
                Effect.asVoid,
                // A failed send is logged; the person can ask for another link.
                Effect.catch((error) =>
                  Effect.logError('Email failed to send', {
                    to: mail.to,
                    error: String(error),
                  })
                )
              ),
          });
        })
      ).pipe(Layer.provide(FetchHttpClient.layer));
    })
  );
}
