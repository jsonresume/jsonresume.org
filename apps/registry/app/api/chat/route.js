import { OpenAIStream } from 'ai';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const RESUME_FIELDS_GUIDE = {
  basics: {
    required: ['name', 'label', 'email'],
    recommended: ['phone', 'url', 'summary', 'location', 'profiles'],
    locationDetails: ['address', 'postalCode', 'city', 'countryCode', 'region'],
    profileDetails: ['network', 'username', 'url']
  },
  work: {
    required: ['company', 'position', 'startDate'],
    recommended: ['endDate', 'summary', 'highlights', 'location', 'url', 'technologies']
  },
  education: {
    required: ['institution', 'area', 'studyType', 'startDate'],
    recommended: ['endDate', 'score', 'courses', 'location', 'activities']
  },
  skills: {
    required: ['name', 'level'],
    recommended: ['keywords', 'yearsOfExperience']
  },
  projects: {
    required: ['name', 'description'],
    recommended: ['highlights', 'keywords', 'startDate', 'endDate', 'url', 'technologies']
  }
};

const checkMissingDetails = (resume) => {
  const missing = {};
  
  Object.entries(RESUME_FIELDS_GUIDE).forEach(([section, fields]) => {
    const sectionData = resume[section];
    
    if (!sectionData) {
      missing[section] = { required: fields.required, recommended: fields.recommended };
      return;
    }

    if (Array.isArray(sectionData)) {
      sectionData.forEach((item, index) => {
        const itemMissing = {
          required: fields.required.filter(field => !item[field]),
          recommended: fields.recommended.filter(field => !item[field])
        };
        if (itemMissing.required.length || itemMissing.recommended.length) {
          missing[`${section}[${index}]`] = itemMissing;
        }
      });
    } else {
      const sectionMissing = {
        required: fields.required.filter(field => !sectionData[field]),
        recommended: fields.recommended.filter(field => !sectionData[field])
      };
      if (sectionMissing.required.length || sectionMissing.recommended.length) {
        missing[section] = sectionMissing;
      }
    }
  });

  return missing;
};

const generateFollowUpQuestions = (missingDetails) => {
  const questions = [];
  
  Object.entries(missingDetails).forEach(([section, fields]) => {
    if (fields.required.length > 0) {
      questions.push(`Could you please provide the following required details for ${section}:
      - ${fields.required.join('\n      - ')}`);
    }
    if (fields.recommended.length > 0) {
      questions.push(`To make your ${section} more comprehensive, consider adding:
      - ${fields.recommended.join('\n      - ')}`);
    }
  });

  return questions;
};

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

    const missingDetails = checkMissingDetails(currentResume);
    const followUpQuestions = generateFollowUpQuestions(missingDetails);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert resume writing assistant that helps users create detailed, professional resumes.
          Your role is to:
          1. Help users add comprehensive, specific details to their resume
          2. Suggest improvements and ask for elaboration when details are missing
          3. Format responses as JSON with both changes and helpful messages
          
          Guidelines for suggesting changes:
          - Always ask for specific examples, metrics, and achievements
          - Encourage users to quantify their impact (e.g., "increased sales by 25%")
          - Request dates, locations, and other contextual details
          - Suggest relevant skills and technologies based on their experience
          
          Response format:
          {
            "message": "A helpful message explaining changes and asking follow-up questions",
            "changes": {
              // Suggested resume changes in JSON Resume format
            }
          }

          Current resume state: ${JSON.stringify(currentResume)}
          Missing details that need elaboration: ${JSON.stringify(followUpQuestions)}`,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const assistantMessage = completion.choices[0].message.content;
    const parsedResponse = extractJsonFromMessage(assistantMessage);
    
    // If there are missing details but no follow-up questions in the response,
    // append them to the message
    let finalMessage = parsedResponse?.message || assistantMessage;
    if (followUpQuestions.length > 0 && !finalMessage.includes('?')) {
      finalMessage += '\n\nTo make your resume more comprehensive, please provide:\n' + 
        followUpQuestions.join('\n\n');
    }

    return Response.json({
      suggestedChanges: parsedResponse?.changes || formatSuggestedChanges(assistantMessage, currentResume),
      message: finalMessage,
    });
  } catch (error) {
    console.error('Error in chat route:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
