const { createClient } = require('@supabase/supabase-js');
import { ChatGPTAPI } from 'chatgpt';

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const { username, focus } = req.body;

  const { data } = await supabase
    .from('resumes')
    .select()
    .eq('username', username);

  const resume = JSON.parse(data[0].resume);

  const resumeString = JSON.stringify(resume);

  const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4o',
    completionParams: {
      temperature: 0.9,
    },
  });

  const prompt = `
  Hi there, this is my resume in the JSON format.

  ${resumeString}

  Please give me detail suggestions on how to improve it e.g.
  - Bad spelling and grammar
  - Sentences that seem irrelvant
  - Better ways of saying things
  - Jobs and skills that I could have described better

  Format your answer in markdown

  Do not give general tips. Be as specific about my actual resume as possible.
  
  Focus on ${focus}
  `;

  const res2 = await api.sendMessage(prompt);

  return res.status(200).send(res2.text);
}
