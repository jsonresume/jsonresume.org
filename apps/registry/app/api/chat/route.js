import { OpenAIStream } from 'ai';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const extractJsonFromMessage = (message) => {
  try {
    // First try to parse the message itself as JSON
    try {
      return JSON.parse(message);
    } catch (e) {
      // Not a JSON string, continue with other methods
    }

    // Try to find a JSON object in code blocks
    const codeBlockMatch = message.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (codeBlockMatch) {
      return JSON.parse(codeBlockMatch[1]);
    }

    // Try to find any JSON object in the message
    const jsonMatch = message.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return null;
  } catch (error) {
    console.error('Error parsing JSON from message:', error);
    return null;
  }
};

const formatSuggestedChanges = (assistantMessage, currentResume) => {
  const extractedJson = extractJsonFromMessage(assistantMessage);
  if (!extractedJson) return {};

  // If the extracted JSON contains changes field, use that directly
  if (extractedJson.changes) {
    return extractedJson.changes;
  }

  // If the extracted JSON is a complete resume or section, merge it with current resume
  if (extractedJson.basics || extractedJson.work || extractedJson.education) {
    return extractedJson;
  }

  // If it's a specific field update (e.g., basics.name), create the proper structure
  const changes = {};
  Object.entries(extractedJson).forEach(([key, value]) => {
    const parts = key.split('.');
    let current = changes;
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        current[part] = value;
      } else {
        current[part] = current[part] || {};
        current = current[part];
      }
    });
  });

  return changes;
};

export async function POST(req) {
  try {
    const { messages, currentResume } = await req.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that helps users update their JSON Resume. 
          When the user describes changes they want to make, respond with a JSON object that includes:
          1. A "message" field with a friendly confirmation of what you're changing
          2. A "changes" field containing the actual JSON changes

          Example response for updating a name:
          {
            "message": "I'll update your name to John Doe.",
            "changes": {
              "basics": {
                "name": "John Doe"
              }
            }
          }

          Example response for adding education:
          {
            "message": "I'll add your education at University of Sydney starting from 2016.",
            "changes": {
              "education": [{
                "institution": "University of Sydney",
                "startDate": "2016"
              }]
            }
          }

          Current resume state: ${JSON.stringify(currentResume)}`,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const assistantMessage = completion.choices[0].message.content;
    const parsedResponse = extractJsonFromMessage(assistantMessage);
    
    return Response.json({
      suggestedChanges: parsedResponse?.changes || formatSuggestedChanges(assistantMessage, currentResume),
      message: parsedResponse?.message || 'Here are the suggested changes to your resume.',
    });
  } catch (error) {
    console.error('Error in chat route:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
