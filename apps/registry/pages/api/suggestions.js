const { Client } = require('pg');
import { ChatGPTAPI } from 'chatgpt';

export default async function handler(req, res) {
  const { username } = req.body;

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

  const prompt = `
  Hi there, this is my resume in the JSON format.

  ${data}

  Please give me detail suggestions on how to improve it e.g.
  - Bad spelling and grammar
  - Sentences that seem irrelvant
  - Better ways of saying things
  - Jobs and skills that I could have described better

  Do not give general tips. Be as specific about my actual resume as possible.
  
  `;

  const res2 = await api.sendMessage(prompt);

  return res.status(200).send(res2.text);
}
