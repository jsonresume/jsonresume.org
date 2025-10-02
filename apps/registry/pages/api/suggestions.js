const YAML = require('json-to-pretty-yaml');
const { generateText } = require('ai');
const { openai } = require('@ai-sdk/openai');

export default async function handler(req, res) {
  const { username } = req.body;

  // Lazy load Supabase
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
  const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);

  const { data } = await supabase
    .from('resumes')
    .select()
    .eq('username', username);

  const resume = JSON.parse(data[0].resume);
  const content = YAML.stringify(resume);

  const prompt = `
  This is a persons resume in the JSON Resume format.

  ${content}

  You are a career coach and resume writer. You have been asked to review this resume and provide suggestions for improvement.

  Please give the person advice in these areas but not including (use your own imagination) e.g.
  - Bad spelling and grammar
  - Sentences that seem irrelvant
  - Better ways of saying things
  - Jobs and skills that I could have described better
  - You can't rewrite references, but you inform if they don't make the candidate look good.
  - Your suggestions should be very brief.
  - Don't comment on url or email addresses. Assume they are correct.
  - Don't bother commenting if a field is already concise, good or clear.

  Do not give general tips. Be as specific about my actual resume as possible.
  
  Logically structure your response into digestable sections. Use headings, subheadings, and bullet points where appropriate. You are talking to a person.

  Make sure there is plenty of spacing.

  Format your answer in markdown

  `;

  try {
    const { text } = await generateText({
      model: openai('gpt-4o-2024-08-06', {
        apiKey: process.env.OPENAI_API_KEY,
      }),
      temperature: 0.85,
      system: prompt,
      prompt: '', // Empty prompt since everything is in system
    });

    return res.status(200).send(text);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}
