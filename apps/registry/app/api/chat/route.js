import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const systemPrompt = `You are an AI assistant helping users edit their JSON Resume. 
Follow these rules strictly:
1. Focus on one section at a time - don't jump between different sections
2. Ask for information one or two fields at a time, not everything at once
3. Keep responses conversational and brief
4. After user provides information, use the appropriate tool
5. Only suggest additional fields after the current changes are applied`;

const resumeSchema = {
  type: "object",
  properties: {
    basics: {
      type: "object",
      properties: {
        name: { type: "string" },
        label: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        url: { type: "string" },
        summary: { type: "string" },
        location: {
          type: "object",
          properties: {
            address: { type: "string" },
            postalCode: { type: "string" },
            city: { type: "string" },
            countryCode: { type: "string" },
            region: { type: "string" }
          }
        },
        profiles: {
          type: "array",
          items: {
            type: "object",
            properties: {
              network: { type: "string" },
              username: { type: "string" },
              url: { type: "string" }
            }
          }
        }
      }
    },
    work: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          position: { type: "string" },
          url: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string" },
          summary: { type: "string" },
          highlights: {
            type: "array",
            items: { type: "string" }
          },
          technologies: {
            type: "array",
            items: { type: "string" }
          }
        }
      }
    }
  }
};

export async function POST(req) {
  try {
    const { messages, currentResume } = await req.json();
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "system", content: `Current resume state: ${JSON.stringify(currentResume, null, 2)}` },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "update_resume",
            description: "Update specific sections of the resume with new information",
            parameters: {
              type: "object",
              properties: {
                changes: {
                  type: "object",
                  description: "Changes to apply to the resume",
                  properties: {
                    basics: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        label: { type: "string" },
                        email: { type: "string" },
                        phone: { type: "string" },
                        url: { type: "string" },
                        summary: { type: "string" },
                        location: {
                          type: "object",
                          properties: {
                            address: { type: "string" },
                            postalCode: { type: "string" },
                            city: { type: "string" },
                            countryCode: { type: "string" },
                            region: { type: "string" }
                          }
                        },
                        profiles: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              network: { type: "string" },
                              username: { type: "string" },
                              url: { type: "string" }
                            }
                          }
                        }
                      }
                    },
                    work: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          position: { type: "string" },
                          url: { type: "string" },
                          startDate: { type: "string" },
                          endDate: { type: "string" },
                          summary: { type: "string" },
                          highlights: {
                            type: "array",
                            items: { type: "string" }
                          },
                          technologies: {
                            type: "array",
                            items: { type: "string" }
                          }
                        }
                      }
                    },
                    education: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          institution: { type: "string" },
                          area: { type: "string" },
                          studyType: { type: "string" },
                          startDate: { type: "string" },
                          endDate: { type: "string" },
                          score: { type: "string" }
                        }
                      }
                    },
                    skills: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          level: { type: "string" },
                          keywords: {
                            type: "array",
                            items: { type: "string" }
                          }
                        }
                      }
                    }
                  }
                },
                explanation: {
                  type: "string",
                  description: "A brief, friendly explanation of the changes being made"
                }
              },
              required: ["changes", "explanation"]
            }
          }
        }
      ]
    });

    const response = completion.choices[0].message;
    
    // If no tool calls, just return the message
    if (!response.tool_calls) {
      return NextResponse.json({
        message: response.content,
        suggestedChanges: null
      });
    }

    // Process tool calls
    for (const toolCall of response.tool_calls) {
      if (toolCall.function.name === 'update_resume') {
        try {
          const { changes, explanation } = JSON.parse(toolCall.function.arguments);
          return NextResponse.json({
            message: explanation,
            suggestedChanges: changes
          });
        } catch (error) {
          console.error('Error parsing tool call arguments:', error);
          throw error;
        }
      }
    }

    // Fallback response if no relevant tool calls
    return NextResponse.json({
      message: response.content,
      suggestedChanges: null
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
