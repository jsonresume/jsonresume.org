import { experimental_generateSpeech as generateSpeech } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';

const VALID_VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];

export async function POST(request) {
  try {
    const { text, voice = 'nova' } = await request.json();

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (text.length > 4096) {
      return new Response(
        JSON.stringify({
          error: 'Text exceeds maximum length of 4096 characters',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const selectedVoice = VALID_VOICES.includes(voice) ? voice : 'nova';

    const result = await generateSpeech({
      model: openai.speech('tts-1'),
      text,
      voice: selectedVoice,
    });

    const audioFile = result.audio;

    if (!result || !audioFile) {
      throw new Error('No audio data generated');
    }

    // Extract audio data from various possible formats
    let audioData = audioFile.uint8ArrayData || audioFile.audioData;

    if (!audioData && audioFile.base64Data) {
      const binaryString = atob(audioFile.base64Data);
      audioData = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        audioData[i] = binaryString.charCodeAt(i);
      }
    }

    if (!audioData) {
      throw new Error('No audio data available');
    }

    return new Response(audioData, {
      headers: {
        'Content-Type': audioFile.mediaType || 'audio/mpeg',
        'Content-Length': String(audioData.byteLength || audioData.length),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Speech generation error:', error.message);
    return new Response(
      JSON.stringify({
        error: 'Failed to generate speech',
        details: error.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
