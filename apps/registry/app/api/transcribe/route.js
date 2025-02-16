import OpenAI from 'openai';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import fs from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio');

    if (!audioFile) {
      return Response.json({ error: 'No audio file provided' }, { status: 400 });
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
        response_format: 'text'
      });

      // Clean up the temporary file
      fs.unlink(tmpFilePath, (err) => {
        if (err) console.error('Error deleting temporary file:', err);
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
    console.error('Error transcribing audio:', error);
    return Response.json({ 
      error: 'Failed to transcribe audio',
      details: error.message 
    }, { status: 500 });
  }
}
