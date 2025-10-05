import OpenAI from 'openai';
import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import { join } from 'path';
import fs from 'fs';
import { logger } from '@/lib/logger';

export async function POST(req) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { message: 'API not available during build' },
      { status: 503 }
    );
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio');

    if (!audioFile) {
      return Response.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Create a temporary file
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tmpFilePath = join('/tmp', `audio-${Date.now()}.webm`);
    await writeFile(tmpFilePath, buffer);

    try {
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(tmpFilePath),
        model: 'whisper-1',
        language: 'en',
        response_format: 'text',
      });

      // Clean up the temporary file
      fs.unlink(tmpFilePath, (err) => {
        if (err)
          logger.error(
            { error: err.message, filePath: tmpFilePath },
            'Error deleting temporary file'
          );
      });

      return Response.json({ text: transcription });
    } finally {
      // Ensure we try to clean up the temp file even if transcription fails
      try {
        fs.unlinkSync(tmpFilePath);
      } catch (e) {
        // Ignore errors during cleanup
      }
    }
  } catch (error) {
    logger.error({ error: error.message }, 'Error transcribing audio');
    return Response.json(
      {
        error: 'Failed to transcribe audio',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
