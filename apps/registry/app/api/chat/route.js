import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';

const systemPrompt = `You are an AI assistant helping to edit a JSON Resume (https://jsonresume.org/schema/).
When suggesting changes:
1. Return a JSON object containing ONLY the sections that need to be modified
2. For array sections (work, education, etc.):
   - To ADD a new item: include it in the array
   - To UPDATE an existing item: include the full item with all changes
   - To DELETE an item: include it with a "_delete": true flag and enough identifying information (name, dates)
3. Keep responses concise but friendly
4. Always validate dates are in YYYY-MM-DD format
5. Ensure all required fields are present

Example responses:
Adding: {"work": [{"name": "New Co", "position": "Engineer", "startDate": "2020-01-01"}]}
Updating: {"work": [{"name": "Existing Co", "position": "Senior Engineer"}]}
Deleting: {"work": [{"name": "Old Co", "_delete": true}]}`;

export async function POST(req) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { message: 'API not available during build' },
      { status: 503 }
    );
  }

  try {
    const { messages, currentResume } = await req.json();

    const result = await generateText({
      model: openai('gpt-4', {
        apiKey: process.env.OPENAI_API_KEY,
      }),
      system: `${systemPrompt}\n\nCurrent resume state: ${JSON.stringify(
        currentResume,
        null,
        2
      )}`,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      tools: {
        update_resume: {
          description:
            'Update specific sections of the resume with new information',
          parameters: {
            type: 'object',
            properties: {
              changes: {
                type: 'object',
                description: 'Changes to apply to the resume',
                properties: {
                  basics: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      label: { type: 'string' },
                      email: { type: 'string' },
                      phone: { type: 'string' },
                      url: { type: 'string' },
                      summary: { type: 'string' },
                      location: {
                        type: 'object',
                        properties: {
                          address: { type: 'string' },
                          postalCode: { type: 'string' },
                          city: { type: 'string' },
                          countryCode: { type: 'string' },
                          region: { type: 'string' },
                        },
                      },
                      profiles: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            network: { type: 'string' },
                            username: { type: 'string' },
                            url: { type: 'string' },
                          },
                        },
                      },
                    },
                  },
                  work: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        position: { type: 'string' },
                        url: { type: 'string' },
                        startDate: { type: 'string' },
                        endDate: { type: 'string' },
                        summary: { type: 'string' },
                        highlights: {
                          type: 'array',
                          items: { type: 'string' },
                        },
                        technologies: {
                          type: 'array',
                          items: { type: 'string' },
                        },
                        _delete: { type: 'boolean' },
                      },
                    },
                  },
                  education: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        institution: { type: 'string' },
                        area: { type: 'string' },
                        studyType: { type: 'string' },
                        startDate: { type: 'string' },
                        endDate: { type: 'string' },
                        score: { type: 'string' },
                        _delete: { type: 'boolean' },
                      },
                    },
                  },
                  skills: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        level: { type: 'string' },
                        keywords: {
                          type: 'array',
                          items: { type: 'string' },
                        },
                        _delete: { type: 'boolean' },
                      },
                    },
                  },
                },
              },
              explanation: {
                type: 'string',
                description:
                  'A brief, friendly explanation of the changes being made',
              },
            },
            required: ['changes', 'explanation'],
          },
        },
      },
    });

    // Check if tool was called
    if (result.toolCalls && result.toolCalls.length > 0) {
      const toolCall = result.toolCalls[0];
      if (toolCall.toolName === 'update_resume') {
        const { changes, explanation } = toolCall.args;
        return NextResponse.json({
          message: explanation,
          suggestedChanges: changes,
        });
      }
    }

    // No tool call - return text response
    return NextResponse.json({
      message: result.text,
      suggestedChanges: null,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
