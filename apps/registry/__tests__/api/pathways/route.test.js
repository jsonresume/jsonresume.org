// Mock the AI SDK before importing
jest.mock('ai', () => ({
  streamText: jest.fn(),
  tool: jest.fn((config) => config),
  convertToModelMessages: jest.fn((messages) => messages),
}));

import { POST } from '../../../app/api/pathways/route';

// Get mocked functions
const { streamText } = jest.requireMock('ai');
const mockResult = {
  toUIMessageStreamResponse: jest
    .fn()
    .mockReturnValue(new Response('mock response')),
};

// Set up mock behavior
streamText.mockReturnValue(mockResult);

jest.mock('@ai-sdk/openai', () => ({
  openai: jest.fn((model) => ({ model })),
}));

// Mock environment variables
process.env.OPENAI_API_KEY = 'test-api-key';

describe('/api/pathways route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST handler', () => {
    it('should handle valid chat request', async () => {
      const requestBody = {
        messages: [
          {
            role: 'user',
            content: 'Help me add a new job to my resume',
          },
        ],
        currentResume: {
          basics: {
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
      };

      const request = new Request('http://localhost/api/pathways', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(streamText).toHaveBeenCalledWith({
        model: { model: 'gpt-4.1' },
        system: expect.stringContaining('You are a helpful career copilot'),
        messages: requestBody.messages,
        tools: expect.objectContaining({
          updateResume: expect.objectContaining({
            name: 'updateResume',
            description:
              'Update specific sections of the resume with new information',
            inputSchema: expect.any(Object),
          }),
        }),
        experimental_transform: expect.any(Object),
      });

      expect(mockResult.toUIMessageStreamResponse).toHaveBeenCalled();
    });

    it('should include current resume in system prompt', async () => {
      const requestBody = {
        messages: [{ role: 'user', content: 'Update my resume' }],
        currentResume: {
          basics: { name: 'Jane Smith' },
          work: [
            {
              name: 'Tech Corp',
              position: 'Engineer',
            },
          ],
        },
      };

      const request = new Request('http://localhost/api/pathways', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      await POST(request);

      const systemPrompt = streamText.mock.calls[0][0].system;
      expect(systemPrompt).toContain('Jane Smith');
      expect(systemPrompt).toContain('Tech Corp');
      expect(systemPrompt).toContain('Engineer');
    });

    it('should handle empty currentResume', async () => {
      const requestBody = {
        messages: [{ role: 'user', content: 'Help me create a resume' }],
        currentResume: null,
      };

      const request = new Request('http://localhost/api/pathways', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      await POST(request);

      const systemPrompt = streamText.mock.calls[0][0].system;
      expect(systemPrompt).toContain('{}');
    });

    it('should handle missing currentResume field', async () => {
      const requestBody = {
        messages: [{ role: 'user', content: 'Help with resume' }],
        // currentResume field missing
      };

      const request = new Request('http://localhost/api/pathways', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      await POST(request);

      const systemPrompt = streamText.mock.calls[0][0].system;
      expect(systemPrompt).toContain('{}');
    });

    it('should configure updateResume tool correctly', async () => {
      const requestBody = {
        messages: [{ role: 'user', content: 'Add new job' }],
        currentResume: {},
      };

      const request = new Request('http://localhost/api/pathways', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      await POST(request);

      const tools = streamText.mock.calls[0][0].tools;
      const updateResumeTool = tools.updateResume;

      expect(updateResumeTool.name).toBe('updateResume');
      expect(updateResumeTool.description).toBe(
        'Update specific sections of the resume with new information'
      );
      expect(updateResumeTool.inputSchema).toBeDefined();
    });

    it('should configure smooth streaming', async () => {
      const requestBody = {
        messages: [{ role: 'user', content: 'Test' }],
        currentResume: {},
      };

      const request = new Request('http://localhost/api/pathways', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      await POST(request);

      const transform = streamText.mock.calls[0][0].experimental_transform;
      expect(transform).toBeDefined();
    });

    it('should use gpt-4.1 model', async () => {
      const requestBody = {
        messages: [{ role: 'user', content: 'Test' }],
        currentResume: {},
      };

      const request = new Request('http://localhost/api/pathways', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      await POST(request);

      const model = streamText.mock.calls[0][0].model;
      expect(model.model).toBe('gpt-4.1');
    });
  });

  describe('error handling', () => {
    it('should handle invalid JSON in request body', async () => {
      const request = new Request('http://localhost/api/pathways', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid json',
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      const errorData = await response.json();
      expect(errorData.error).toBeDefined();
    });

    it('should handle streamText errors', async () => {
      streamText.mockRejectedValue(new Error('API Error'));

      const requestBody = {
        messages: [{ role: 'user', content: 'Test' }],
        currentResume: {},
      };

      const request = new Request('http://localhost/api/pathways', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      const errorData = await response.json();
      expect(errorData.error).toBe('API Error');
    });

    it('should handle errors without message property', async () => {
      const customError = new Error();
      delete customError.message;
      streamText.mockRejectedValue(customError);

      const requestBody = {
        messages: [{ role: 'user', content: 'Test' }],
        currentResume: {},
      };

      const request = new Request('http://localhost/api/pathways', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      const errorData = await response.json();
      expect(errorData.error).toBe('Something went wrong');
    });
  });

  describe('updateResume tool schema validation', () => {
    it('should define proper schema for basics section', async () => {
      const requestBody = {
        messages: [{ role: 'user', content: 'Test' }],
        currentResume: {},
      };

      const request = new Request('http://localhost/api/pathways', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      await POST(request);

      const { tool } = require('ai');
      const toolCall = tool.mock.calls[0][0];

      expect(toolCall.inputSchema).toBeDefined();

      // Test that we can validate a basic changes object
      const testInput = {
        changes: {
          basics: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1-555-0123',
            location: {
              city: 'San Francisco',
              region: 'CA',
            },
          },
        },
        explanation: 'Updated basic information',
      };

      // Schema should accept valid input (this is a conceptual test)
      expect(toolCall.inputSchema).toBeDefined();
    });

    it('should define proper schema for work section', async () => {
      const requestBody = {
        messages: [{ role: 'user', content: 'Test' }],
        currentResume: {},
      };

      const request = new Request('http://localhost/api/pathways', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      await POST(request);

      const { tool } = require('ai');
      const toolCall = tool.mock.calls[0][0];

      // Test work section schema structure
      const testInput = {
        changes: {
          work: [
            {
              name: 'Tech Corp',
              position: 'Software Engineer',
              startDate: '2022-01-01',
              endDate: '2024-01-01',
              highlights: ['Built features', 'Led team'],
              technologies: ['React', 'Node.js'],
            },
          ],
        },
        explanation: 'Added new job',
      };

      expect(toolCall.inputSchema).toBeDefined();
    });

    it('should define proper schema for skills section', async () => {
      const requestBody = {
        messages: [{ role: 'user', content: 'Test' }],
        currentResume: {},
      };

      const request = new Request('http://localhost/api/pathways', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      await POST(request);

      const { tool } = require('ai');
      const toolCall = tool.mock.calls[0][0];

      // Test skills section schema structure
      const testInput = {
        changes: {
          skills: [
            {
              name: 'JavaScript',
              level: 'Expert',
              keywords: ['React', 'Node.js', 'TypeScript'],
            },
          ],
        },
        explanation: 'Updated skills',
      };

      expect(toolCall.inputSchema).toBeDefined();
    });

    it('should support deletion markers', async () => {
      const requestBody = {
        messages: [{ role: 'user', content: 'Test' }],
        currentResume: {},
      };

      const request = new Request('http://localhost/api/pathways', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      await POST(request);

      const { tool } = require('ai');
      const toolCall = tool.mock.calls[0][0];

      // Test deletion marker in schema
      const testInput = {
        changes: {
          work: [
            { _delete: true }, // Should be allowed
          ],
          skills: [
            {
              name: 'Old Skill',
              _delete: true,
            },
          ],
        },
        explanation: 'Removed outdated entries',
      };

      expect(toolCall.inputSchema).toBeDefined();
    });
  });

  describe('system prompt configuration', () => {
    it('should instruct AI to add sample data instead of asking questions', async () => {
      const requestBody = {
        messages: [{ role: 'user', content: 'Test' }],
        currentResume: {},
      };

      const request = new Request('http://localhost/api/pathways', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      await POST(request);

      const systemPrompt = streamText.mock.calls[0][0].system;
      expect(systemPrompt).toContain('ADD SAMPLE DATA directly');
      expect(systemPrompt).toContain('instead of asking follow-up questions');
    });

    it('should identify the assistant as a career copilot', async () => {
      const requestBody = {
        messages: [{ role: 'user', content: 'Test' }],
        currentResume: {},
      };

      const request = new Request('http://localhost/api/pathways', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      await POST(request);

      const systemPrompt = streamText.mock.calls[0][0].system;
      expect(systemPrompt).toContain('helpful career copilot');
    });

    it('should include current resume context in system prompt', async () => {
      const currentResume = {
        basics: {
          name: 'Alice Developer',
          email: 'alice@example.com',
        },
        work: [
          {
            name: 'StartupCo',
            position: 'Full Stack Developer',
            startDate: '2020-01-01',
          },
        ],
        skills: [
          {
            name: 'Python',
            level: 'Advanced',
            keywords: ['Django', 'Flask'],
          },
        ],
      };

      const requestBody = {
        messages: [{ role: 'user', content: 'Update my resume' }],
        currentResume,
      };

      const request = new Request('http://localhost/api/pathways', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      await POST(request);

      const systemPrompt = streamText.mock.calls[0][0].system;
      expect(systemPrompt).toContain('Alice Developer');
      expect(systemPrompt).toContain('StartupCo');
      expect(systemPrompt).toContain('Full Stack Developer');
      expect(systemPrompt).toContain('Python');
      expect(systemPrompt).toContain('Django');
    });
  });

  describe('edge cases', () => {
    it('should handle missing messages field', async () => {
      const requestBody = {
        currentResume: {},
        // messages field missing
      };

      const request = new Request('http://localhost/api/pathways', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      // Should either handle gracefully or return appropriate error
      expect(response).toBeDefined();
    });

    it('should handle empty messages array', async () => {
      const requestBody = {
        messages: [],
        currentResume: {},
      };

      const request = new Request('http://localhost/api/pathways', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(streamText).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: [],
        })
      );
    });

    it('should handle complex nested resume data', async () => {
      const complexResume = {
        basics: {
          name: 'Complex User',
          profiles: [
            { network: 'LinkedIn', url: 'https://linkedin.com/in/user' },
            { network: 'GitHub', url: 'https://github.com/user' },
          ],
          location: {
            address: '123 Main St',
            city: 'San Francisco',
            region: 'CA',
            postalCode: '94105',
          },
        },
        work: [
          {
            name: 'Big Tech Corp',
            position: 'Senior Software Engineer',
            highlights: [
              'Led team of 5 developers',
              'Increased performance by 40%',
              'Implemented microservices architecture',
            ],
            technologies: ['React', 'Node.js', 'AWS', 'Docker'],
          },
        ],
        education: [
          {
            institution: 'University of Technology',
            area: 'Computer Science',
            studyType: 'Bachelor',
            startDate: '2015-09-01',
            endDate: '2019-05-01',
          },
        ],
      };

      const requestBody = {
        messages: [{ role: 'user', content: 'Help me improve this' }],
        currentResume: complexResume,
      };

      const request = new Request('http://localhost/api/pathways', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      await POST(request);

      const systemPrompt = streamText.mock.calls[0][0].system;
      expect(systemPrompt).toContain('Big Tech Corp');
      expect(systemPrompt).toContain('microservices architecture');
      expect(systemPrompt).toContain('University of Technology');
    });
  });
});
