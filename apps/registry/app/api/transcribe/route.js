import { experimental_transcribe as transcribe } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export async function POST(request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio');

    if (!audioFile) {
      return new Response(JSON.stringify({ error: 'No audio file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (audioFile.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ error: 'Audio file exceeds maximum size of 25MB' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const audioArrayBuffer = await audioFile.arrayBuffer();

    const result = await transcribe({
      model: openai.transcription('whisper-1'),
      audio: audioArrayBuffer,
    });

    return new Response(
      JSON.stringify({
        text: result.text,
        language: result.language,
        duration: result.durationInSeconds,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Transcription error:', error.message);
    return new Response(
      JSON.stringify({
        error: 'Failed to transcribe audio',
        details: error.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
