const { Client } = require('pg');
import { ChatGPTAPI } from 'chatgpt';

/*
#todo
 - add an input box to post the job description
  - save JD in local storage
 - buttons that can change tone of the letter
  - save settings in local storage




#wishlist
 - google the company, and include as much up to date information as possible in the prompt

*/

export default async function handler(req, res) {
  const { username, jobDescription, tone } = req.body;

  const client = new Client(process.env.DATABASE_URL_RAW);
  await client.connect();

  const results = await client.query(
    `SELECT username, resume, updated_at from resumes WHERE username = $1 ORDER BY updated_at DESC`,
    [username]
  );

  const resume = results.rows[0];

  const data = JSON.stringify(resume);

  const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY,
    completionParams: {
      temperature: 0.9,
      top_p: 0.8,
    },
  });

  let prompt = [
    `
You are a human candidate for a job. Read the supplied resume and pretend you are that person. Your resume has been supplied to them.

This is your resume in the JSON format. Reference it for the cover letter.

  ${data}

  `,
  ];

  if (jobDescription) {
    prompt.push(`

    Here is the job description I am applying for;
     ${jobDescription}.

    `);
  }

  prompt.push(
    `Using a ${tone} tonality. Format your response using Markdown. Don't be afraid to name your lack of experience the candidate might have but focus on your strengths. Keep it two a couple short paragraphs only 300 words.`
  );

  prompt.push('Please write a short cover letter');

  console.log({ tone });

  const res2 = await api.sendMessage(prompt.join(''));

  return res.status(200).send(res2.text);
}
