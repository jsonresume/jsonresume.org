import { UnsupportedImport } from '@repo/api';
import { Effect, Layer, Stream } from 'effect';
import { LanguageModel } from 'effect/ai';
import { Downloader } from './download';
import { Importer } from './importer';
import { ResumeReader } from './reader';
import type { ModelReply } from './shape';
import { ImportStore } from './store';

/** Every section of the model's reply, empty: tests fill in what they need. */
export const emptyReply = (): ModelReply => ({
  resume: {
    basics: {
      name: null,
      label: null,
      email: null,
      phone: null,
      url: null,
      summary: null,
      location: {
        address: null,
        postalCode: null,
        city: null,
        countryCode: null,
        region: null,
      },
      profiles: [],
    },
    work: [],
    volunteer: [],
    education: [],
    awards: [],
    certificates: [],
    publications: [],
    skills: [],
    languages: [],
    interests: [],
    references: [],
    projects: [],
  },
  unsure: [],
});

/**
 * A language model that answers every request with `answer(text)`, the
 * text being what the user message carried: the resume's text. Counts its
 * calls, so tests can see the cache work.
 */
export const scriptedModel = (answer: (text: string) => ModelReply) => {
  const calls: string[] = [];
  const layer = Layer.effect(
    LanguageModel.LanguageModel,
    LanguageModel.make({
      generateText: (options) => {
        const text = options.prompt.content
          .flatMap((m) => (m.role === 'user' ? m.content : []))
          .flatMap((part) => (part.type === 'text' ? [part.text] : []))
          .join('\n');
        calls.push(text);
        return Effect.succeed([
          { type: 'text', text: JSON.stringify(answer(text)) },
        ]);
      },
      streamText: () => Stream.empty,
    })
  );
  return { layer, calls };
};

/** The real ResumeReader over a scripted model: no OpenAI. */
export const fakeReader = (answer: (text: string) => ModelReply) => {
  const model = scriptedModel(answer);
  return {
    layer: ResumeReader.layer('fake-model').pipe(Layer.provide(model.layer)),
    calls: model.calls,
  };
};

/** Downloads from a fixed set of URLs; any other URL fails. */
export const fakeDownloader = (
  files: ReadonlyMap<string, { bytes: Uint8Array; contentType?: string }>
) =>
  Layer.succeed(
    Downloader,
    Downloader.of({
      download: (url) => {
        const file = files.get(url);
        return file
          ? Effect.succeed({ ...file, name: url.split('/').pop() })
          : Effect.fail(
              new UnsupportedImport({ message: `Can't download ${url}.` })
            );
      },
    })
  );

/** The Importer on the database given (a SqlClient), with this reader. */
export const testImporter = (reader: Layer.Layer<ResumeReader>) =>
  Importer.layer.pipe(Layer.provide(Layer.merge(ImportStore.layer, reader)));
