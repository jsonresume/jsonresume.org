// Mock the AI SDK before importing
jest.mock('ai', () => ({
  experimental_generateSpeech: jest.fn(),
}));

import { POST } from '../../../app/api/speech/route';

// Get mocked functions
const { experimental_generateSpeech } = jest.requireMock('ai');
const mockAudioFile = {
  uint8ArrayData: new Uint8Array([1, 2, 3, 4, 5]),
  mediaType: 'audio/mpeg',
};

// Set up mock behavior
experimental_generateSpeech.mockResolvedValue({
  audio: mockAudioFile,
});

jest.mock('@ai-sdk/openai', () => ({
  openai: {
    speech: jest.fn((model) => ({ model })),
  },
}));

// Mock environment variables
process.env.OPENAI_API_KEY = 'test-api-key';

describe('/api/speech route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset console methods
    console.log = jest.fn();
    console.error = jest.fn();
  });

  describe('POST handler', () => {
    it('should generate speech for valid text input', async () => {
      const requestBody = {
        text: 'Hello, this is a test message.',
        voice: 'nova',
      };

      const request = new Request('http://localhost/api/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(experimental_generateSpeech).toHaveBeenCalledWith({
        model: { model: 'tts-1' },
        text: 'Hello, this is a test message.',
        voice: 'nova',
      });

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('audio/mpeg');
      expect(response.headers.get('Content-Length')).toBe('5');
      expect(response.headers.get('Cache-Control')).toBe(
        'public, max-age=3600'
      );

      const audioData = await response.arrayBuffer();
      expect(new Uint8Array(audioData)).toEqual(
        new Uint8Array([1, 2, 3, 4, 5])
      );
    });

    it('should use default voice when not specified', async () => {
      const requestBody = {
        text: 'Hello, this is a test message.',
        // voice not specified
      };

      const request = new Request('http://localhost/api/speech', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      await POST(request);

      expect(experimental_generateSpeech).toHaveBeenCalledWith({
        model: { model: 'tts-1' },
        text: 'Hello, this is a test message.',
        voice: 'nova', // Default voice
      });
    });

    it('should handle different voice options', async () => {
      const voices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];

      for (const voice of voices) {
        const requestBody = {
          text: 'Test message',
          voice,
        };

        const request = new Request('http://localhost/api/speech', {
          method: 'POST',
          body: JSON.stringify(requestBody),
        });

        await POST(request);

        expect(experimental_generateSpeech).toHaveBeenCalledWith({
          model: { model: 'tts-1' },
          text: 'Test message',
          voice,
        });

        experimental_generateSpeech.mockClear();
      }
    });

    it('should handle long text input', async () => {
      const longText = 'This is a very long text message. '.repeat(100);
      const requestBody = {
        text: longText,
        voice: 'alloy',
      };

      const request = new Request('http://localhost/api/speech', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(experimental_generateSpeech).toHaveBeenCalledWith({
        model: { model: 'tts-1' },
        text: longText,
        voice: 'alloy',
      });

      expect(response.status).toBe(200);
    });

    it('should log API key presence without exposing the key', async () => {
      const requestBody = {
        text: 'Test message',
        voice: 'nova',
      };

      const request = new Request('http://localhost/api/speech', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      await POST(request);

      expect(console.log).toHaveBeenCalledWith(
        'OpenAI API key configured:',
        true
      );
    });

    it('should log speech request details', async () => {
      const requestBody = {
        text: 'This is a longer test message for logging purposes',
        voice: 'echo',
      };

      const request = new Request('http://localhost/api/speech', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      await POST(request);

      expect(console.log).toHaveBeenCalledWith('Speech request received:', {
        text: 'This is a longer test message for logging purpos', // Truncated to 50 chars
        voice: 'echo',
      });
    });
  });

  describe('error handling', () => {
    it('should return 400 for missing text', async () => {
      const requestBody = {
        voice: 'nova',
        // text missing
      };

      const request = new Request('http://localhost/api/speech', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      const errorData = await response.json();
      expect(errorData.error).toBe('Text is required');
    });

    it('should return 400 for empty text', async () => {
      const requestBody = {
        text: '',
        voice: 'nova',
      };

      const request = new Request('http://localhost/api/speech', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      const errorData = await response.json();
      expect(errorData.error).toBe('Text is required');
    });

    it('should handle generateSpeech errors', async () => {
      experimental_generateSpeech.mockRejectedValue(
        new Error('API rate limit exceeded')
      );

      const requestBody = {
        text: 'Test message',
        voice: 'nova',
      };

      const request = new Request('http://localhost/api/speech', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      const errorData = await response.json();
      expect(errorData.error).toBe('Failed to generate speech');
      expect(errorData.details).toBe('API rate limit exceeded');
      expect(errorData.type).toBe('Error');
    });

    it('should handle missing audio result', async () => {
      experimental_generateSpeech.mockResolvedValue({
        // No audio property
      });

      const requestBody = {
        text: 'Test message',
        voice: 'nova',
      };

      const request = new Request('http://localhost/api/speech', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      const errorData = await response.json();
      expect(errorData.error).toBe('Failed to generate speech');
      expect(errorData.details).toBe('No audio data generated');
    });

    it('should handle missing audio data in file', async () => {
      experimental_generateSpeech.mockResolvedValue({
        audio: {
          // No uint8ArrayData or base64Data
          mediaType: 'audio/mpeg',
        },
      });

      const requestBody = {
        text: 'Test message',
        voice: 'nova',
      };

      const request = new Request('http://localhost/api/speech', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      const errorData = await response.json();
      expect(errorData.error).toBe('Failed to generate speech');
      expect(errorData.details).toBe('No audio data available');
    });

    it('should handle invalid JSON in request', async () => {
      const request = new Request('http://localhost/api/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid json',
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      const errorData = await response.json();
      expect(errorData.error).toBe('Failed to generate speech');
    });
  });

  describe('audio data handling', () => {
    it('should handle uint8ArrayData format', async () => {
      const audioData = new Uint8Array([10, 20, 30, 40]);
      experimental_generateSpeech.mockResolvedValue({
        audio: {
          uint8ArrayData: audioData,
          mediaType: 'audio/mpeg',
        },
      });

      const requestBody = {
        text: 'Test message',
        voice: 'nova',
      };

      const request = new Request('http://localhost/api/speech', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      const responseAudio = await response.arrayBuffer();
      expect(new Uint8Array(responseAudio)).toEqual(audioData);
    });

    it('should handle base64Data format', async () => {
      // Base64 encoding of [10, 20, 30, 40]
      const base64Data = btoa(String.fromCharCode(10, 20, 30, 40));
      experimental_generateSpeech.mockResolvedValue({
        audio: {
          base64Data,
          mediaType: 'audio/mpeg',
        },
      });

      const requestBody = {
        text: 'Test message',
        voice: 'nova',
      };

      const request = new Request('http://localhost/api/speech', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      const responseAudio = await response.arrayBuffer();
      expect(new Uint8Array(responseAudio)).toEqual(
        new Uint8Array([10, 20, 30, 40])
      );
    });

    it('should handle audioData property fallback', async () => {
      const audioData = new Uint8Array([50, 60, 70, 80]);
      experimental_generateSpeech.mockResolvedValue({
        audio: {
          audioData, // Alternative property name
          mediaType: 'audio/mpeg',
        },
      });

      const requestBody = {
        text: 'Test message',
        voice: 'nova',
      };

      const request = new Request('http://localhost/api/speech', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      const responseAudio = await response.arrayBuffer();
      expect(new Uint8Array(responseAudio)).toEqual(audioData);
    });

    it('should use default media type when not provided', async () => {
      experimental_generateSpeech.mockResolvedValue({
        audio: {
          uint8ArrayData: new Uint8Array([1, 2, 3]),
          // No mediaType property
        },
      });

      const requestBody = {
        text: 'Test message',
        voice: 'nova',
      };

      const request = new Request('http://localhost/api/speech', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.headers.get('Content-Type')).toBe('audio/mpeg');
    });

    it('should respect custom media type', async () => {
      experimental_generateSpeech.mockResolvedValue({
        audio: {
          uint8ArrayData: new Uint8Array([1, 2, 3]),
          mediaType: 'audio/wav',
        },
      });

      const requestBody = {
        text: 'Test message',
        voice: 'nova',
      };

      const request = new Request('http://localhost/api/speech', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.headers.get('Content-Type')).toBe('audio/wav');
    });
  });

  describe('logging and debugging', () => {
    it('should log detailed generation information', async () => {
      const requestBody = {
        text: 'Test message for detailed logging',
        voice: 'fable',
      };

      const request = new Request('http://localhost/api/speech', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      await POST(request);

      expect(console.log).toHaveBeenCalledWith('Calling generateSpeech with:', {
        model: 'tts-1',
        textLength: 'Test message for detailed logging'.length,
        voice: 'fable',
      });

      expect(console.log).toHaveBeenCalledWith('Got audio data:', {
        type: 'Uint8Array',
        size: 5,
        mediaType: 'audio/mpeg',
      });
    });

    it('should log speech generation result details', async () => {
      const requestBody = {
        text: 'Test message',
        voice: 'nova',
      };

      const request = new Request('http://localhost/api/speech', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      await POST(request);

      expect(console.log).toHaveBeenCalledWith(
        'Speech generation result:',
        expect.objectContaining({
          hasResult: true,
          hasAudio: true,
        })
      );
    });

    it('should log errors with detailed information', async () => {
      const customError = new Error('Custom API error');
      customError.name = 'APIError';
      customError.cause = 'Rate limit';
      experimental_generateSpeech.mockRejectedValue(customError);

      const requestBody = {
        text: 'Test message',
        voice: 'nova',
      };

      const request = new Request('http://localhost/api/speech', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      await POST(request);

      expect(console.error).toHaveBeenCalledWith(
        'Speech generation error details:',
        expect.objectContaining({
          message: 'Custom API error',
          name: 'APIError',
          cause: 'Rate limit',
        })
      );
    });
  });

  describe('edge cases and special inputs', () => {
    it('should handle special characters in text', async () => {
      const requestBody = {
        text: 'Hello! How are you? 😊 Special chars: <>&"\'',
        voice: 'nova',
      };

      const request = new Request('http://localhost/api/speech', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(experimental_generateSpeech).toHaveBeenCalledWith({
        model: { model: 'tts-1' },
        text: 'Hello! How are you? 😊 Special chars: <>&"\'',
        voice: 'nova',
      });
    });

    it('should handle multiline text', async () => {
      const requestBody = {
        text: 'Line 1\nLine 2\nLine 3',
        voice: 'echo',
      };

      const request = new Request('http://localhost/api/speech', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(experimental_generateSpeech).toHaveBeenCalledWith({
        model: { model: 'tts-1' },
        text: 'Line 1\nLine 2\nLine 3',
        voice: 'echo',
      });
    });

    it('should handle whitespace-only text as invalid', async () => {
      const requestBody = {
        text: '   \n\t  ',
        voice: 'nova',
      };

      const request = new Request('http://localhost/api/speech', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      const errorData = await response.json();
      expect(errorData.error).toBe('Text is required');
    });

    it('should handle null text', async () => {
      const requestBody = {
        text: null,
        voice: 'nova',
      };

      const request = new Request('http://localhost/api/speech', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it('should handle unknown voice gracefully', async () => {
      const requestBody = {
        text: 'Test message',
        voice: 'unknown-voice',
      };

      const request = new Request('http://localhost/api/speech', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      // Should still call the API (OpenAI will handle invalid voice)
      expect(experimental_generateSpeech).toHaveBeenCalledWith({
        model: { model: 'tts-1' },
        text: 'Test message',
        voice: 'unknown-voice',
      });
    });
  });
});
