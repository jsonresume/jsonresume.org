import { experimental_transcribe as transcribe } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';

export async function POST(request) {
  try {
    // Get the audio data from the request
    const formData = await request.formData();
    const audioFile = formData.get('audio');

    if (!audioFile) {
      return new Response(JSON.stringify({ error: 'No audio file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Transcription request received:', {
      fileName: audioFile.name,
      fileType: audioFile.type,
      fileSize: audioFile.size,
    });

    // Convert the audio file to a Blob which the AI SDK expects
    const audioBlob = new Blob([await audioFile.arrayBuffer()], {
      type: audioFile.type || 'audio/wav',
    });

    console.log('Audio blob prepared:', {
      type: audioBlob.type,
      size: audioBlob.size,
    });

    // Use the AI SDK transcribe function with the blob
    const result = await transcribe({
      model: openai.transcription('whisper-1'),
      audio: audioBlob,
    });

    console.log('Transcription result:', {
      textLength: result.text?.length,
      language: result.language,
      duration: result.durationInSeconds,
    });

    // Return the transcription result
    return new Response(
      JSON.stringify({
        text: result.text,
        language: result.language,
        duration: result.durationInSeconds,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Transcription error:', {
      message: error.message,
      name: error.name,
      cause: error.cause,
    });

    return new Response(
      JSON.stringify({
        error: 'Failed to transcribe audio',
        details: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
