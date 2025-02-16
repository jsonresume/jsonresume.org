import OpenAI from 'openai';

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

    // Convert the audio file to a Buffer
    const buffer = Buffer.from(await audioFile.arrayBuffer());

    const transcription = await openai.audio.transcriptions.create({
      file: {
        buffer,
        name: 'audio.webm',
        type: audioFile.type,
      },
      model: 'whisper-1',
    });

    return Response.json({ text: transcription.text });
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return Response.json({ error: 'Failed to transcribe audio' }, { status: 500 });
  }
}
