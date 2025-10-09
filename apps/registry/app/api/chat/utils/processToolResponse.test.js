import { describe, it, expect, vi } from 'vitest';
import { processToolResponse } from './processToolResponse';

// Mock NextResponse
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data) => ({ json: data })),
  },
}));

describe('processToolResponse', () => {
  it('processes tool call with update_resume action', () => {
    const result = {
      toolCalls: [
        {
          toolName: 'update_resume',
          args: {
            changes: {
              basics: { name: 'John Doe' },
            },
            explanation: 'Updated name to John Doe',
          },
        },
      ],
    };

    const response = processToolResponse(result);
    expect(response.json).toEqual({
      message: 'Updated name to John Doe',
      suggestedChanges: {
        basics: { name: 'John Doe' },
      },
    });
  });

  it('returns text response when no tool calls present', () => {
    const result = {
      text: 'Here is my response',
    };

    const response = processToolResponse(result);
    expect(response.json).toEqual({
      message: 'Here is my response',
      suggestedChanges: null,
    });
  });

  it('returns text response when toolCalls array is empty', () => {
    const result = {
      text: 'No tools were called',
      toolCalls: [],
    };

    const response = processToolResponse(result);
    expect(response.json).toEqual({
      message: 'No tools were called',
      suggestedChanges: null,
    });
  });

  it('ignores non-update_resume tool calls', () => {
    const result = {
      text: 'Some other response',
      toolCalls: [
        {
          toolName: 'some_other_tool',
          args: { data: 'test' },
        },
      ],
    };

    const response = processToolResponse(result);
    expect(response.json).toEqual({
      message: 'Some other response',
      suggestedChanges: null,
    });
  });

  it('handles empty changes object', () => {
    const result = {
      toolCalls: [
        {
          toolName: 'update_resume',
          args: {
            changes: {},
            explanation: 'No changes needed',
          },
        },
      ],
    };

    const response = processToolResponse(result);
    expect(response.json).toEqual({
      message: 'No changes needed',
      suggestedChanges: {},
    });
  });

  it('processes complex nested changes', () => {
    const result = {
      toolCalls: [
        {
          toolName: 'update_resume',
          args: {
            changes: {
              basics: {
                name: 'Jane Smith',
                email: 'jane@example.com',
                location: {
                  city: 'San Francisco',
                },
              },
              work: [
                {
                  position: 'Developer',
                  company: 'Tech Co',
                },
              ],
            },
            explanation: 'Updated contact info and work history',
          },
        },
      ],
    };

    const response = processToolResponse(result);
    expect(response.json).toEqual({
      message: 'Updated contact info and work history',
      suggestedChanges: {
        basics: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          location: {
            city: 'San Francisco',
          },
        },
        work: [
          {
            position: 'Developer',
            company: 'Tech Co',
          },
        ],
      },
    });
  });
});
