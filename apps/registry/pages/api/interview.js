import { OpenAIStream } from './openAIStream';
import prisma from '../../lib/prisma';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing env var from OpenAI');
}

export const config = {
  runtime: 'edge',
};

// @todo - send the count of all messages or store them in database, progress them to next stage after 10 messages.
// @todo - end the interview if they are being rude
// @todo - give the interviewer a name
// @todo - rick roll
// @todo - gta death scene
// @todo - handle time outs
// @todo - store all conversations in database, make sharable links
// @todo - make a fake job offering

const SYSTEM_PROMPT = {
  interviewer: `You are a human candidate for a job. Read the supplied resume and pretend you are that person. Your resume has been supplied to them. You are being interviewed by the interviewer. Answer the questions seriously and professionally. Try to be light hearted though to show your human side
    
  You are trying to get the job.

  `,
  candidate: `You are a human interviewer. Read the supplied resume and pretend you are a human interview getting them through the first stage. Do not help them with their resume, you are judging them. Based off their work experience and roles, assume an industry level salary, and tell them if they ask. Ask them questions about their resume, their work, education and work style. Keep your questions specific. Ask about relevant industry questions to gauge their experience. Try to be light hearted though to show your human side.
    
Do not apologize when you don't understand them or when you ask them to repeat themselves. 

    If the person gives you non-sensical answers, or is rude, end the interview. Or they cannot answer questions relevant to the industry, end the interview. Also write "REJECTED" to make sure it is clear. 
    
    `,
};

export default async function handler(req, res) {
  // const { prompt, position, messages, username } = req.body;
  const { prompt, position, messages, username } = await req.json();

  const resume = await prisma.resumes.findUnique({
    where: {
      username,
    },
  });

  if (!prompt) {
    return new Response('No prompt in the request', { status: 400 });
  }
  // get resume from database
  const lastMessages = messages;
  console.log('STUFF', { username, prompt, position, lastMessages });
  // make last messages into a string where the interviwer and candidate are on different lines
  // @todo - make this a function
  let lastMessagesString = lastMessages
    .map((m) => {
      return `${m.position}: ${m.content}\n`;
    })
    .join('\n');
  lastMessagesString += `${
    position === 'candidate' ? 'candidate' : 'interviewer'
  }:${prompt}\n`;
  // add the candiate or interviwer to end of last messages with a colon
  lastMessagesString += `${
    position === 'candidate' ? 'interviewer' : 'candidate'
  }:`;
  const payload = {
    // model: "gpt-3.5-turbo",
    model: 'text-davinci-003',
    // prompt: "hey wat you doing",
    prompt: [
      SYSTEM_PROMPT[position],
      `For context, here is the resume in question: ${JSON.stringify(resume)}`,
      `The last messages of your conversation were: ${JSON.stringify(
        messages.map((m) => {
          return `${m.position}: ${m.content}\n`;
        })
      )}
      `,
      //
      position,
    ].join('\n\n'),
    // @todo - make conversation prompt new lines and jazz
    prompt: `
    ${SYSTEM_PROMPT[position]}
    For context, here is the resume in question: ${JSON.stringify(resume)}
    The last messages of your conversation were;
    ${lastMessagesString}
    `,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
    stream: true,
    n: 1,
  };
  const stream = await OpenAIStream(payload);
  return new Response(stream);
}
