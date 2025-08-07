import { experimental_generateSpeech as generateSpeech } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';

// Log API key presence (not the actual key)
console.log('OpenAI API key configured:', !!process.env.OPENAI_API_KEY);

export async function POST(request) {
  try {
    const { text, voice = 'nova' } = await request.json();

    console.log('Speech request received:', {
      text: text.substring(0, 50),
      voice,
    });

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Calling generateSpeech with:', {
      model: 'tts-1',
      textLength: text.length,
      voice,
    });

    // Generate speech using OpenAI TTS
    const result = await generateSpeech({
      model: openai.speech('tts-1'), // Use tts-1 for faster generation, tts-1-hd for higher quality
      text,
      voice, // Options: alloy, echo, fable, onyx, nova, shimmer
    });

    console.log('Speech generation result:', {
      hasResult: !!result,
      hasAudio: !!result?.audio,
      hasAudioData: !!result?.audioData,
      audioType: result?.audio ? typeof result.audio : 'undefined',
      audioConstructor: result?.audio
        ? result.audio.constructor.name
        : 'undefined',
      resultKeys: result ? Object.keys(result) : [],
      audioKeys: result?.audio ? Object.keys(result.audio) : [],
      audioProps: result?.audio ? Object.getOwnPropertyNames(result.audio) : [],
      audioMethods: result?.audio
        ? Object.getOwnPropertyNames(Object.getPrototypeOf(result.audio))
        : [],
    });

    // The property is 'audio' not 'audioData' in the current version
    const audioFile = result.audio;

    // Check if we actually have audio data
    if (!result || !audioFile) {
      throw new Error('No audio data generated');
    }

    // The audio file has uint8ArrayData property
    let audioData = audioFile.uint8ArrayData || audioFile.audioData;

    // If not available, try base64Data
    if (!audioData && audioFile.base64Data) {
      // Convert base64 to Uint8Array
      const binaryString = atob(audioFile.base64Data);
      audioData = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        audioData[i] = binaryString.charCodeAt(i);
      }
      console.log(
        'Converted base64 to Uint8Array:',
        audioData.byteLength,
        'bytes'
      );
    }

    if (!audioData) {
      // Log what we have and throw error
      console.error('Unable to extract audio data. Available properties:', {
        hasUint8ArrayData: !!audioFile.uint8ArrayData,
        hasBase64Data: !!audioFile.base64Data,
        hasAudioData: !!audioFile.audioData,
        mediaType: audioFile.mediaType,
        format: audioFile.format,
      });
      throw new Error('No audio data available');
    }

    console.log('Got audio data:', {
      type: audioData.constructor.name,
      size: audioData.byteLength || audioData.length,
      mediaType: audioFile.mediaType || 'audio/mpeg',
    });

    // Return audio data as binary with correct media type
    return new Response(audioData, {
      headers: {
        'Content-Type': audioFile.mediaType || 'audio/mpeg',
        'Content-Length': String(audioData.byteLength || audioData.length),
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Speech generation error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      cause: error.cause,
      fullError: error,
    });

    return new Response(
      JSON.stringify({
        error: 'Failed to generate speech',
        details: error.message,
        type: error.name,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
