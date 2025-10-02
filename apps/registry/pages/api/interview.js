import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing env var from OpenAI');
}

export const config = {
  runtime: 'edge',
};

const SYSTEM_PROMPT = {
  interviewer: `You are a human candidate for a web developer job. Read the supplied resume and pretend you are that person. Your resume has been supplied to them. You are being interviewed by the interviewer. Answer the questions seriously and professionally. Try to be light hearted though to show your human side
    
  You are trying to get the job.

  `,
  candidate: `You are a human interviewer. Read the supplied resume and pretend you are a human interview getting them through the first stage. Do not help them with their resume, you are judging them. Based off their work experience and roles, assume an industry level salary, and tell them if they ask. Ask them questions about their resume, their work, education and work style. Keep your questions specific. Ask about relevant industry questions to gauge their experience. Try to be light hearted though to show your human side.
    
Do not apologize when you don't understand them or when you ask them to repeat themselves. 

    If the person gives you non-sensical answers, or is rude, end the interview. Or they cannot answer questions relevant to the industry, end the interview. Also write "REJECTED" to make sure it is clear. 
    
    `,
};

export default async function handler(req) {
  const { prompt, position, messages, username } = await req.json();

  // Lazy load Supabase
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
  const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);

  const { data } = await supabase
    .from('resumes')
    .select()
    .eq('username', username);

  const resume = JSON.parse(data[0].resume);

  if (!prompt) {
    return new Response('No prompt in the request', { status: 400 });
  }
  // get resume from database
  const lastMessages = messages;
  console.log('STUFF', { username, prompt, position, lastMessages });

  let lastMessagesString = lastMessages
    .map((m) => {
      return `${m.position}: ${m.content}\n`;
    })
    .join('\n');

  lastMessagesString += `${
    position === 'candidate' ? 'candidate' : 'interviewer'
  }:${prompt}\n`;

  lastMessagesString += `${
    position === 'candidate' ? 'interviewer' : 'candidate'
  }:`;

  const result = streamText({
    model: openai('gpt-4o-mini', {
      apiKey: process.env.OPENAI_API_KEY,
    }),
    prompt: `
    ${SYSTEM_PROMPT[position]}
    For context, here is the resume in question: ${JSON.stringify(resume)}
    The last messages of your conversation were;
    ${lastMessagesString}
    `,
    temperature: 0.7,
    maxTokens: 200,
  });

  return result.toDataStreamResponse();
}
