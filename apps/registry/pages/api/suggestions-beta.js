const { createClient } = require('@supabase/supabase-js');
const YAML = require('json-to-pretty-yaml');
const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/*
 @todo
- create a list of all posssible num key values for the schema
- add a suggestion level, critical, warning, info
- add a suggestion sentiment, modest, factual, beginner etc
- add a suggestion brevity, terse, moderate, verbose
- add a suggestion type, spelling, grammar, clarity, relevance, conciseness, tone, style, formatting
- add the above configurable options to the prompt
- add an example to each possible schemaKey
*/

const BREVITY = {
  terse: 'terse',
  moderate: 'moderate',
  verbose: 'verbose',
};

const functions = [
  {
    name: 'jsonresumeSuggestion',
    description:
      'Given a jsonresume schema property, this format recommends improvements to the resume.',
    parameters: {
      type: 'object',
      properties: {
        suggestions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              schemaKey: {
                type: 'string',
                description:
                  'The key of the schema property to suggest improvements for e.g. basics.summary, work[1].name, work[1].highlights[0], skills[2].keywords[2] etc',
              },
              suggestion: { type: 'string' },
            },
          },
        },
      },
      required: [],
    },
  },
];

export default async function handler(req, res) {
  const username = req.body.username || 'thomasdavis';
  const brevity = req.body.brevity || BREVITY.verbose;
  const sentiment = req.body.sentiment || 'modest';

  const { data } = await supabase
    .from('resumes')
    .select()
    .eq('username', username);

  const resume = JSON.parse(data[0].resume);
  const content = YAML.stringify(resume);

  const prompt = [
    `
  This is a persons resume in the JSON Resume format.

  ${content}

  You are a career coach and resume writer. You have been asked to review this resume and provide suggestions for improvement.

  Please give the person advice in these areas but not including (use your own imagination) e.g.
  - Bad spelling and grammar
  - Sentences that seem irrelvant
  - Better ways of saying things
  - Jobs and skills that I could have described better
  - You can't rewrite references, but you inform if they don't make the candidate look good.
`,
  ];

  switch (brevity) {
    case BREVITY.terse:
      prompt.push(`
        - Your suggestions should be very brief and terse. No one likes reading long resumes. Rule of thumb: 1-2 sentences per suggestion.
      `);
      break;
    case BREVITY.moderate:
      prompt.push(`
        - Your suggestions should be moderate in length. Not too long, not too short. Rule of thumb 2-3 sentences per suggestion.
      `);

      break;
    case BREVITY.verbose:
      prompt.push(`
        - Your suggestions can be verbose. Feel free to provide detailed feedback. Rule of thumb: 3-4 sentences per suggestion.
      `);
      break;
  }

  switch (sentiment) {
    case 'modest':
      prompt.push(`
        - Be modest in your suggestions. Don't be too harsh or critical. Remember, you are here to help the person improve their resume.
      `);
      break;
    case 'factual':
      prompt.push(`
        - Be factual in your suggestions. Stick to the facts and avoid making assumptions or generalizations.
      `);
      break;
    case 'beginner':
      prompt.push(`
        - Assume the person is a beginner and provide suggestions accordingly. Use simple language and avoid jargon.
      `);
      break;
  }

  prompt.push(`

  - Your suggestions should be very brief and terse. No one likes reading long resumes.
  - Don't comment on url or email addresses. Assume they are correct.
  - Don't bother commenting if a field is already concise, good or clear.
  - If you say something is wrong, suggest a better way to say it.

  Do not give general tips. Be as specific about my actual resume as possible.
  

  Make sure you reference which aspect of the json resume that you are talking about for each critcisim.

  e.g. basics.name, work[0].position, projects[1].highlights[1] etc.

  Suggest!
  `);

  const messages = [
    {
      role: 'system',
      content: prompt.join(''),
    },
  ];

  const chat = await openai.chat.completions.create({
    model: 'gpt-4o-2024-08-06',
    temperature: 0.7,
    messages,
    functions,
  });

  console.log(JSON.stringify(chat, undefined, 4));

  try {
    // get open ai function response
    const functionCall = chat.choices[0].message.function_call;
    const results = JSON.parse(functionCall.arguments);
    console.log(results);
    return res.status(200).send(results);
  } catch (e) {
    console.error(e);
    return res.status(200).send('it failed');
  }
}
