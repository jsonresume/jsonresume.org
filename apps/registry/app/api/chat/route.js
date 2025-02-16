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
    profileDetails: ['network', 'username', 'url'],
  },
  work: {
    required: ['company', 'position', 'startDate'],
    recommended: [
      'endDate',
      'summary',
      'highlights',
      'location',
      'url',
      'technologies',
    ],
  },
  education: {
    required: ['institution', 'area', 'studyType', 'startDate'],
    recommended: ['endDate', 'score', 'courses', 'location', 'activities'],
  },
  skills: {
    required: ['name', 'level'],
    recommended: ['keywords', 'yearsOfExperience'],
  },
  projects: {
    required: ['name', 'description'],
    recommended: [
      'highlights',
      'keywords',
      'startDate',
      'endDate',
      'url',
      'technologies',
    ],
  },
};

const checkMissingDetails = (resume) => {
  const missing = {};

  Object.entries(RESUME_FIELDS_GUIDE).forEach(([section, fields]) => {
    const sectionData = resume[section];

    if (!sectionData) {
      missing[section] = {
        required: fields.required,
        recommended: fields.recommended,
      };
      return;
    }

    if (Array.isArray(sectionData)) {
      sectionData.forEach((item, index) => {
        const itemMissing = {
          required: fields.required.filter((field) => !item[field]),
          recommended: fields.recommended.filter((field) => !item[field]),
        };
        if (itemMissing.required.length || itemMissing.recommended.length) {
          missing[`${section}[${index}]`] = itemMissing;
        }
      });
    } else {
      const sectionMissing = {
        required: fields.required.filter((field) => !sectionData[field]),
        recommended: fields.recommended.filter((field) => !sectionData[field]),
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
      // Remove comments before parsing
      const jsonString = codeBlockMatch[1]
        .replace(/\/\/.*$/gm, '') // Remove single-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
        .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas

      return JSON.parse(jsonString);
    }

    // Try to find any JSON object in the message
    const jsonMatch = message.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      // Remove comments before parsing
      const jsonString = jsonMatch[0]
        .replace(/\/\/.*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/,(\s*[}\]])/g, '$1');

      return JSON.parse(jsonString);
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

  // Clean up the extracted JSON by removing any undefined or null values
  const cleanJson = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(cleanJson).filter(item => item != null);
    }
    if (typeof obj === 'object' && obj !== null) {
      const cleaned = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value != null) {
          cleaned[key] = cleanJson(value);
        }
      }
      return cleaned;
    }
    return obj;
  };

  // If the extracted JSON contains changes field, use that directly
  if (extractedJson.changes) {
    return cleanJson(extractedJson.changes);
  }

  // If the extracted JSON is a complete resume or section, merge it with current resume
  if (extractedJson.basics || extractedJson.work || extractedJson.education) {
    return cleanJson(extractedJson);
  }

  // If it's a specific field update (e.g., basics.name), create the proper structure
  const changes = {};
  Object.entries(cleanJson(extractedJson)).forEach(([key, value]) => {
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
          - When suggesting changes, only include fields that have actual values
          - Do not include fields with placeholder text or comments
          - Remove any fields that would be null, undefined, or contain placeholders
          
          Response format example:
          {
            "message": "I've updated your location and added your education details. To make your education section more comprehensive, could you please provide your graduation date and any notable courses or projects?",
            "changes": {
              "basics": {
                "location": {
                  "city": "Guatemala City",
                  "countryCode": "GT"
                }
              },
              "education": [
                {
                  "institution": "University of Guatemala",
                  "area": "Software Engineering",
                  "studyType": "Bachelors",
                  "startDate": "2025"
                }
              ]
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
    
    // Split the message into changes explanation and follow-up questions
    let finalMessage = '';
    if (parsedResponse?.message) {
      finalMessage = parsedResponse.message;
    } else {
      // Extract text outside of code blocks as the message
      const textParts = assistantMessage.split('```');
      finalMessage = textParts.filter((_, i) => i % 2 === 0).join(' ').trim();
    }

    // Always append follow-up questions if there are missing details
    if (followUpQuestions.length > 0 && !finalMessage.includes('?')) {
      finalMessage += '\n\nTo make your resume more comprehensive, please provide:\n' + 
        followUpQuestions.join('\n\n');
    }

    // Clean up any suggested changes to remove placeholders and comments
    const cleanChanges = (changes) => {
      if (!changes) return {};
      
      const clean = {};
      for (const [key, value] of Object.entries(changes)) {
        if (value === null || value === undefined) continue;
        if (typeof value === 'string' && (value.includes('XX') || value.includes('Please specify'))) continue;
        if (Array.isArray(value)) {
          const cleanArray = value.map(item => {
            if (typeof item === 'object') return cleanChanges(item);
            return item;
          }).filter(item => item !== null && item !== undefined);
          if (cleanArray.length > 0) clean[key] = cleanArray;
        } else if (typeof value === 'object') {
          const cleanObj = cleanChanges(value);
          if (Object.keys(cleanObj).length > 0) clean[key] = cleanObj;
        } else {
          clean[key] = value;
        }
      }
      return clean;
    };

    const suggestedChanges = cleanChanges(
      parsedResponse?.changes || formatSuggestedChanges(assistantMessage, currentResume)
    );

    return Response.json({
      suggestedChanges,
      message: finalMessage,
    });
  } catch (error) {
    console.error('Error in chat route:', error);
    return Response.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
