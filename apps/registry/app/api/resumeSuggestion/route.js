import { generateText, tool } from 'ai';
import { NextResponse } from 'next/server';
const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const body = await req.json();

  const { text, resume } = body;

  const tools = [
    {
      type: 'function',
      function: {
        name: 'suggest_resume_changes',
        description:
          'Suggests changes to resume sections based on the provided text in the JSON Resume format. This happens anytime the user talks.',
        parameters: {
          type: 'object',
          properties: {
            jsonresume: {
              type: 'string',
              description:
                'A partial JSON Resume with suggested sections filled out in JSON',
            },
            followup: {
              type: 'string',
              description:
                'A thanks and follow up question to make the user fill out more information ',
            },
          },
          required: ['jsonresume', 'followup'],
        },
      },
    },
    // {
    //   type: 'function',
    //   function: {
    //     name: 'get_current_weather',
    //     description: 'Get the current weather in a given location',
    //     parameters: {
    //       type: 'object',
    //       properties: {
    //         location: {
    //           type: 'string',
    //           description: 'The city and state, e.g. San Francisco, CA',
    //         },
    //         unit: { type: 'string', enum: ['celsius', 'fahrenheit'] },
    //       },
    //       required: ['location'],
    //     },
    //   },
    // },
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    tools,
    messages: [
      {
        role: 'system',
        content: `You write peoples resume into a format called JSON Resume. 

      When they speak about themselves, you return the valid section of a JSON Resume.

      If there sections are not filled out enough, ask them more about that section.
      
      Your reply in JSON.`,
      },
      {
        role: 'assistant',
        content: `I will help you with that. Here is the JSON Resume you provided me: ${resume}`,
      },
      { role: 'user', content: text },
      {
        role: 'assistant',
        content: `Now suggest to the user how they could change their JSON resume.
        
        Make sure you fill out the top level propertie of json resume.
        
        Don't include sections you didn't change.
        
       
        `,
      },
    ],
  });
  console.log({ completion });
  console.log(completion.choices);
  const response = completion.choices[0];

  let result = {};

  if (response.finish_reason === 'tool_calls') {
    // {
    //     registry:dev:     id: 'call_1WZ17WDopC9Zb7Xd7mhPoq02',
    //     registry:dev:     type: 'function',
    //     registry:dev:     function: {
    //     registry:dev:       name: 'get_current_weather',
    //     registry:dev:       arguments: '{"location":"Melbourne, AU"}'
    //     registry:dev:     }
    //     registry:dev:   }
    //     registry:dev: ]

    console.log('whatt', response.message.tool_calls);
    result = response.message.tool_calls[0].function.arguments;
  }
  console.log({ result });
  return NextResponse.json(result);
}
