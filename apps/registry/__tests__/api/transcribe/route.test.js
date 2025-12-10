// Mock the AI SDK before importing
jest.mock('ai', () => ({
  experimental_transcribe: jest.fn(),
}));

import { POST } from '../../../app/api/transcribe/route';

// Get mocked functions
const { experimental_transcribe } = jest.requireMock('ai');

jest.mock('@ai-sdk/openai', () => ({
  openai: {
    transcription: jest.fn((model) => ({ model })),
  },
}));

// Mock environment variables
process.env.OPENAI_API_KEY = 'test-api-key';

describe('/api/transcribe route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();

    // Default successful transcription mock
    experimental_transcribe.mockResolvedValue({
      text: 'This is the transcribed text from audio',
      language: 'en',
      durationInSeconds: 5.2,
    });
  });

  describe('POST handler', () => {
    it('should transcribe audio file successfully', async () => {
      const audioData = new Uint8Array([1, 2, 3, 4, 5]);
      const audioBlob = new Blob([audioData], { type: 'audio/wav' });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const request = new Request('http://localhost/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      const result = await response.json();

      expect(result).toEqual({
        text: 'This is the transcribed text from audio',
        language: 'en',
        duration: 5.2,
      });

      expect(experimental_transcribe).toHaveBeenCalledWith({
        model: { model: 'whisper-1' },
        audio: expect.any(ArrayBuffer),
      });
    });

    it('should handle different audio file formats', async () => {
      const audioFormats = [
        { type: 'audio/wav', filename: 'recording.wav' },
        { type: 'audio/webm', filename: 'recording.webm' },
        { type: 'audio/ogg', filename: 'recording.ogg' },
        { type: 'audio/mp4', filename: 'recording.mp4' },
        { type: 'audio/mpeg', filename: 'recording.mp3' },
      ];

      for (const format of audioFormats) {
        const audioData = new Uint8Array([1, 2, 3, 4, 5]);
        const audioBlob = new Blob([audioData], { type: format.type });

        const formData = new FormData();
        formData.append('audio', audioBlob, format.filename);

        const request = new Request('http://localhost/api/transcribe', {
          method: 'POST',
          body: formData,
        });

        const response = await POST(request);

        expect(response.status).toBe(200);
        expect(experimental_transcribe).toHaveBeenCalledWith({
          model: { model: 'whisper-1' },
          audio: expect.any(ArrayBuffer),
        });

        experimental_transcribe.mockClear();
      }
    });

    it('should log transcription request details', async () => {
      const audioData = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      const audioBlob = new Blob([audioData], { type: 'audio/wav' });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'test-recording.wav');

      const request = new Request('http://localhost/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      await POST(request);

      expect(console.log).toHaveBeenCalledWith(
        'Transcription request received:',
        {
          fileName: 'test-recording.wav',
          fileType: 'audio/wav',
          fileSize: 10,
        }
      );

      expect(console.log).toHaveBeenCalledWith('Audio data prepared:', {
        type: 'audio/wav',
        size: 10,
      });
    });

    it('should log transcription results', async () => {
      experimental_transcribe.mockResolvedValue({
        text: 'Hello, this is a transcription test with a longer message.',
        language: 'en-US',
        durationInSeconds: 12.5,
      });

      const audioData = new Uint8Array([1, 2, 3]);
      const audioBlob = new Blob([audioData], { type: 'audio/webm' });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const request = new Request('http://localhost/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      await POST(request);

      expect(console.log).toHaveBeenCalledWith('Transcription result:', {
        textLength: 'Hello, this is a transcription test with a longer message.'
          .length,
        language: 'en-US',
        duration: 12.5,
      });
    });

    it('should handle empty transcription result', async () => {
      experimental_transcribe.mockResolvedValue({
        text: '',
        language: 'en',
        durationInSeconds: 1.0,
      });

      const audioData = new Uint8Array([1, 2, 3]);
      const audioBlob = new Blob([audioData], { type: 'audio/wav' });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'empty.wav');

      const request = new Request('http://localhost/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result.text).toBe('');
    });

    it('should handle missing language in result', async () => {
      experimental_transcribe.mockResolvedValue({
        text: 'Transcribed text',
        durationInSeconds: 3.0,
        // language missing
      });

      const audioData = new Uint8Array([1, 2, 3]);
      const audioBlob = new Blob([audioData], { type: 'audio/wav' });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const request = new Request('http://localhost/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result.language).toBeUndefined();
    });

    it('should handle missing duration in result', async () => {
      experimental_transcribe.mockResolvedValue({
        text: 'Transcribed text',
        language: 'en',
        // durationInSeconds missing
      });

      const audioData = new Uint8Array([1, 2, 3]);
      const audioBlob = new Blob([audioData], { type: 'audio/wav' });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const request = new Request('http://localhost/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result.duration).toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('should return 400 when no audio file is provided', async () => {
      const formData = new FormData();
      // No audio file appended

      const request = new Request('http://localhost/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      const errorData = await response.json();
      expect(errorData.error).toBe('No audio file provided');
    });

    it('should return 400 when audio field is null', async () => {
      const formData = new FormData();
      formData.append('audio', null);

      const request = new Request('http://localhost/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      const errorData = await response.json();
      expect(errorData.error).toBe('No audio file provided');
    });

    it('should handle transcription API errors', async () => {
      experimental_transcribe.mockRejectedValue(
        new Error('Audio format not supported')
      );

      const audioData = new Uint8Array([1, 2, 3]);
      const audioBlob = new Blob([audioData], { type: 'audio/wav' });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const request = new Request('http://localhost/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      const errorData = await response.json();
      expect(errorData.error).toBe('Failed to transcribe audio');
      expect(errorData.details).toBe('Audio format not supported');
    });

    it('should handle network errors during transcription', async () => {
      const networkError = new Error('Network timeout');
      networkError.name = 'NetworkError';
      networkError.cause = 'Connection timeout';
      experimental_transcribe.mockRejectedValue(networkError);

      const audioData = new Uint8Array([1, 2, 3]);
      const audioBlob = new Blob([audioData], { type: 'audio/wav' });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const request = new Request('http://localhost/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      const errorData = await response.json();
      expect(errorData.error).toBe('Failed to transcribe audio');
      expect(errorData.details).toBe('Network timeout');

      expect(console.error).toHaveBeenCalledWith(
        'Transcription error:',
        expect.objectContaining({
          message: 'Network timeout',
          name: 'NetworkError',
          cause: 'Connection timeout',
        })
      );
    });

    it('should handle malformed FormData', async () => {
      const request = new Request('http://localhost/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invalid: 'format' }),
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      const errorData = await response.json();
      expect(errorData.error).toBe('Failed to transcribe audio');
    });

    it('should handle audio file reading errors', async () => {
      // Mock a file that fails to read as ArrayBuffer
      const badFile = {
        name: 'bad-file.wav',
        type: 'audio/wav',
        size: 100,
        arrayBuffer: jest.fn().mockRejectedValue(new Error('File read error')),
      };

      const formData = new FormData();
      formData.append('audio', badFile);

      const request = new Request('http://localhost/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      const errorData = await response.json();
      expect(errorData.error).toBe('Failed to transcribe audio');
      expect(errorData.details).toBe('File read error');
    });
  });

  describe('audio file handling', () => {
    it('should handle large audio files', async () => {
      const largeAudioData = new Uint8Array(1024 * 1024); // 1MB
      largeAudioData.fill(42); // Fill with some data

      const audioBlob = new Blob([largeAudioData], { type: 'audio/wav' });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'large-recording.wav');

      const request = new Request('http://localhost/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(experimental_transcribe).toHaveBeenCalledWith({
        model: { model: 'whisper-1' },
        audio: expect.any(ArrayBuffer),
      });

      const calledArrayBuffer = experimental_transcribe.mock.calls[0][0].audio;
      expect(calledArrayBuffer.byteLength).toBe(1024 * 1024);
    });

    it('should handle very small audio files', async () => {
      const tinyAudioData = new Uint8Array([42]);
      const audioBlob = new Blob([tinyAudioData], { type: 'audio/wav' });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'tiny.wav');

      const request = new Request('http://localhost/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
    });

    it('should handle file with no extension in filename', async () => {
      const audioData = new Uint8Array([1, 2, 3]);
      const audioBlob = new Blob([audioData], { type: 'audio/wav' });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording');

      const request = new Request('http://localhost/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(console.log).toHaveBeenCalledWith(
        'Transcription request received:',
        expect.objectContaining({
          fileName: 'recording',
        })
      );
    });

    it('should handle file with unusual MIME type', async () => {
      const audioData = new Uint8Array([1, 2, 3]);
      const audioBlob = new Blob([audioData], { type: 'audio/x-custom' });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.custom');

      const request = new Request('http://localhost/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(console.log).toHaveBeenCalledWith(
        'Transcription request received:',
        expect.objectContaining({
          fileType: 'audio/x-custom',
        })
      );
    });

    it('should convert audio file to ArrayBuffer correctly', async () => {
      const originalData = new Uint8Array([10, 20, 30, 40, 50]);
      const audioBlob = new Blob([originalData], { type: 'audio/wav' });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const request = new Request('http://localhost/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      await POST(request);

      const calledArrayBuffer = experimental_transcribe.mock.calls[0][0].audio;
      const calledData = new Uint8Array(calledArrayBuffer);
      expect(calledData).toEqual(originalData);
    });
  });

  describe('whisper model configuration', () => {
    it('should use whisper-1 model', async () => {
      const audioData = new Uint8Array([1, 2, 3]);
      const audioBlob = new Blob([audioData], { type: 'audio/wav' });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const request = new Request('http://localhost/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      await POST(request);

      expect(experimental_transcribe).toHaveBeenCalledWith({
        model: { model: 'whisper-1' },
        audio: expect.any(ArrayBuffer),
      });
    });

    it('should pass correct OpenAI model configuration', async () => {
      const { openai } = require('@ai-sdk/openai');

      const audioData = new Uint8Array([1, 2, 3]);
      const audioBlob = new Blob([audioData], { type: 'audio/wav' });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const request = new Request('http://localhost/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      await POST(request);

      expect(openai.transcription).toHaveBeenCalledWith('whisper-1');
    });
  });

  describe('response format', () => {
    it('should return correct JSON response format', async () => {
      experimental_transcribe.mockResolvedValue({
        text: 'Complete transcription text',
        language: 'en-US',
        durationInSeconds: 45.7,
      });

      const audioData = new Uint8Array([1, 2, 3]);
      const audioBlob = new Blob([audioData], { type: 'audio/wav' });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const request = new Request('http://localhost/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);

      expect(response.headers.get('Content-Type')).toBe('application/json');

      const result = await response.json();
      expect(result).toEqual({
        text: 'Complete transcription text',
        language: 'en-US',
        duration: 45.7,
      });
    });

    it('should handle special characters in transcription', async () => {
      experimental_transcribe.mockResolvedValue({
        text: 'Hello! How are you? I\'m fine, thanks. 😊 Special chars: <>&"',
        language: 'en',
        durationInSeconds: 5.0,
      });

      const audioData = new Uint8Array([1, 2, 3]);
      const audioBlob = new Blob([audioData], { type: 'audio/wav' });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const request = new Request('http://localhost/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const result = await response.json();

      expect(result.text).toBe(
        'Hello! How are you? I\'m fine, thanks. 😊 Special chars: <>&"'
      );
    });

    it('should handle multiline transcription', async () => {
      experimental_transcribe.mockResolvedValue({
        text: 'Line one.\nLine two.\nLine three.',
        language: 'en',
        durationInSeconds: 8.0,
      });

      const audioData = new Uint8Array([1, 2, 3]);
      const audioBlob = new Blob([audioData], { type: 'audio/wav' });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const request = new Request('http://localhost/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const result = await response.json();

      expect(result.text).toContain('\n');
      expect(result.text.split('\n')).toHaveLength(3);
    });
  });

  describe('edge cases', () => {
    it('should handle extremely long transcription', async () => {
      const longTranscription = 'This is a very long transcription. '.repeat(
        1000
      );
      experimental_transcribe.mockResolvedValue({
        text: longTranscription,
        language: 'en',
        durationInSeconds: 300.0,
      });

      const audioData = new Uint8Array([1, 2, 3]);
      const audioBlob = new Blob([audioData], { type: 'audio/wav' });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'long-recording.wav');

      const request = new Request('http://localhost/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const result = await response.json();

      expect(result.text).toBe(longTranscription);
      expect(result.text.length).toBeGreaterThan(30000);
    });

    it('should handle zero-duration audio', async () => {
      experimental_transcribe.mockResolvedValue({
        text: '',
        language: 'en',
        durationInSeconds: 0.0,
      });

      const audioData = new Uint8Array([1, 2, 3]);
      const audioBlob = new Blob([audioData], { type: 'audio/wav' });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'silent.wav');

      const request = new Request('http://localhost/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const result = await response.json();

      expect(result.duration).toBe(0.0);
      expect(result.text).toBe('');
    });

    it('should handle non-English transcriptions', async () => {
      experimental_transcribe.mockResolvedValue({
        text: 'Bonjour, comment allez-vous?',
        language: 'fr',
        durationInSeconds: 3.5,
      });

      const audioData = new Uint8Array([1, 2, 3]);
      const audioBlob = new Blob([audioData], { type: 'audio/wav' });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'french.wav');

      const request = new Request('http://localhost/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const result = await response.json();

      expect(result.text).toBe('Bonjour, comment allez-vous?');
      expect(result.language).toBe('fr');
    });
  });
});
