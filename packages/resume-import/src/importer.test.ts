import { ImportFailed } from '@repo/api';
import { TestDatabase } from '@repo/database/testing';
import { ProductEvents } from '@repo/posthog';
import { Effect, Exit, Layer } from 'effect';
import { SqlClient } from 'effect/sql';
import { describe, expect, it } from 'vitest';
import { Importer, type ImportInput } from './importer';
import { ResumeReader } from './reader';
import type { ModelReply } from './shape';
import {
  linkedInExport,
  RESUME_LINES,
  textPdf,
  wordDocx,
} from './test/fixtures';
import { emptyReply, fakeReader, testImporter } from './testing';

/** What the fake model "reads" from any resume text. */
const adaReply = (text: string): ModelReply => {
  const { resume } = emptyReply();
  return {
    resume: {
      ...resume,
      basics: {
        ...resume.basics,
        name: text.includes('Ada') ? 'Ada Lovelace' : null,
        email: 'ada@example.com',
        location: { ...resume.basics.location, city: 'London' },
      },
      work: [
        {
          name: 'Analytical Engines Ltd',
          position: 'Programmer',
          location: null,
          url: null,
          startDate: 'Jan 1842',
          endDate: 'Present',
          summary: null,
          highlights: ['Computed Bernoulli numbers on the engine'],
        },
      ],
    },
    unsure: [{ path: '/basics/location/city', confidence: 'low' }],
  };
};

/** An Importer over a fresh database and a scripted model, with events kept. */
const setup = (reader = fakeReader(adaReply)) => {
  const events: Array<{ id: string; event: string; properties?: unknown }> = [];
  const capture = Layer.succeed(
    ProductEvents,
    ProductEvents.of({
      capture: (id, event, properties) =>
        Effect.sync(() => void events.push({ id, event, properties })),
    })
  );
  const layer = testImporter(reader.layer).pipe(
    Layer.provide(capture),
    Layer.provideMerge(TestDatabase)
  );
  const run = <A, E>(
    effect: Effect.Effect<A, E, Importer | SqlClient.SqlClient>
  ) => Effect.runPromise(Effect.provide(effect, layer));
  const importing = (input: ImportInput, userId?: string) =>
    Effect.gen(function* () {
      return yield* (yield* Importer).run(input, userId);
    });
  return { run, importing, events, calls: reader.calls, layer };
};

const file = (bytes: Uint8Array) =>
  ({ _tag: 'File', upload: { bytes } } as const);

describe('Importer', () => {
  it('reads a PDF with the model, repairs it, scores each field, and caches it', async () => {
    const { run, importing, events, calls } = setup();
    const pdf = textPdf(RESUME_LINES);
    const [first, again, rows] = await run(
      Effect.gen(function* () {
        const first = yield* importing(file(pdf));
        const again = yield* importing(file(pdf));
        const sql = yield* SqlClient.SqlClient;
        const rows = yield* sql`
          SELECT user_id, kind, file_hash, fields, model, cached,
                 result IS NOT NULL AS kept
          FROM app.imports ORDER BY created_at, cached`;
        return [first, again, rows] as const;
      })
    );
    expect(calls).toHaveLength(1);
    expect(calls[0]).toContain('Computed Bernoulli numbers');
    expect(first.kind).toBe('pdf');
    expect(first.cached).toBe(false);
    expect(first.resume).toEqual({
      basics: {
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        location: { city: 'London' },
      },
      work: [
        {
          name: 'Analytical Engines Ltd',
          position: 'Programmer',
          startDate: '1842-01',
          highlights: ['Computed Bernoulli numbers on the engine'],
        },
      ],
    });
    expect(first.confidence).toEqual({
      '/basics/name': 'high',
      '/basics/email': 'high',
      '/basics/location/city': 'low',
      '/work/0/name': 'high',
      '/work/0/position': 'high',
      '/work/0/startDate': 'medium',
      '/work/0/highlights/0': 'high',
    });
    expect(first.fields).toBe(7);
    expect(first.warnings).toEqual([
      'Left out work › 0 › endDate: Use a date like 2024-06-30, 2024-06 or 2024.',
    ]);
    expect(again).toMatchObject({ cached: true, resume: first.resume });
    // Only the hash, counts and the parsed result: never the file or its text.
    expect(rows).toEqual([
      expect.objectContaining({
        user_id: null,
        kind: 'pdf',
        fields: 7,
        model: 'fake-model',
        cached: false,
        kept: true,
      }),
      expect.objectContaining({ cached: true, kept: false, model: null }),
    ]);
    expect(String(rows[0]?.['file_hash'])).toMatch(/^[0-9a-f]{64}$/);
    expect(events.map((e) => e.event)).toEqual([
      'import_started',
      'import_finished',
      'import_started',
      'import_finished',
    ]);
    expect(events[1]).toMatchObject({
      id: expect.stringMatching(/^import-/),
      properties: {
        kind: 'pdf',
        fields_found: 7,
        cached: false,
        ok: true,
        $process_person_profile: false,
      },
    });
    expect(events[0]?.id).toBe(events[1]?.id);
  });

  it('reads Word documents and pasted text, under the user’s id when signed in', async () => {
    const { run, importing, events } = setup();
    const docx = Effect.promise(() => wordDocx(RESUME_LINES));
    const id = '00000000-0000-4000-8000-000000000001';
    const [word, owner] = await run(
      Effect.gen(function* () {
        const sql = yield* SqlClient.SqlClient;
        yield* sql`INSERT INTO app.users (id, email) VALUES (${id}, 'ada@example.com')`;
        const word = yield* importing(file(yield* docx), id);
        const [row] = yield* sql`SELECT user_id FROM app.imports`;
        return [word, row?.['user_id']] as const;
      })
    );
    expect(word).toMatchObject({ kind: 'docx', fields: 7 });
    expect(owner).toBe(id);
    expect(events[0]).toMatchObject({
      id,
      properties: { kind: 'docx' },
    });
    const pasted = await run(
      importing({ _tag: 'Text', text: RESUME_LINES.join('\n') })
    );
    expect(pasted).toMatchObject({ kind: 'text', cached: false });
  });

  it('maps a LinkedIn export without the model', async () => {
    const { run, importing, calls } = setup();
    const result = await run(importing(file(linkedInExport())));
    expect(calls).toHaveLength(0);
    expect(result.kind).toBe('linkedin');
    expect(result.resume['work']).toHaveLength(2);
    expect(result.confidence['/basics/name']).toBe('high');
    expect(result.confidence['/basics/location/city']).toBe('medium');
  });

  it('fails clearly: too large, scanned, unsupported, nothing found, model down', async () => {
    const { run, importing, events } = setup();
    const fail = async (input: ImportInput) => {
      const exit = await Effect.runPromiseExit(
        Effect.provide(importing(input), setup().layer)
      );
      return Exit.isFailure(exit) ? JSON.stringify(exit.cause) : 'succeeded';
    };
    expect(await fail(file(new Uint8Array(5 * 1024 * 1024 + 1)))).toContain(
      'ImportTooLarge'
    );
    expect(
      await fail({ _tag: 'Text', text: 'x'.repeat(6 * 1024 * 1024) })
    ).toContain('ImportTooLarge');
    expect(await fail(file(textPdf([])))).toContain('NothingToImport');
    expect(
      await fail(file(new Uint8Array([0x89, 0x50, 0x4e, 0x47])))
    ).toContain('UnsupportedImport');
    expect(await fail({ _tag: 'Text', text: 'hi' })).toContain(
      'NothingToImport'
    );

    // A model that finds nothing, and one that is down.
    const nothing = setup(fakeReader(() => emptyReply()));
    const empty = await Effect.runPromiseExit(
      Effect.provide(
        nothing.importing({ _tag: 'Text', text: RESUME_LINES.join('\n') }),
        nothing.layer
      )
    );
    expect(JSON.stringify(empty)).toContain('No resume could be found');
    const down = Layer.succeed(
      ResumeReader,
      ResumeReader.of({
        model: 'down',
        read: () => Effect.fail(new ImportFailed({ message: 'down' })),
      })
    );
    const broken = setup({ layer: down, calls: [] });
    const exit = await Effect.runPromiseExit(
      Effect.provide(
        broken.importing({ _tag: 'Text', text: RESUME_LINES.join('\n') }),
        broken.layer
      )
    );
    expect(JSON.stringify(exit)).toContain('ImportFailed');
    expect(broken.events.at(-1)).toMatchObject({
      event: 'import_finished',
      properties: { ok: false, fields_found: 0 },
    });
    expect(await run(Effect.succeed(events.length))).toBe(0);
  });
});
