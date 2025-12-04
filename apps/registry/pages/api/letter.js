const { generateText } = require('ai');
const { openai } = require('@ai-sdk/openai');
const { notifyFeatureUsage } = require('../../lib/discord/notifiers.js');

/*
#wishlist
 - Google the company, and include as much up to date information as possible in the prompt
*/

export default async function handler(req, res) {
  const { username, jobDescription, tone } = req.body;

  // Lazy load Supabase
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
  const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);

  // pull from the cache
  const { data } = await supabase
    .from('resumes')
    .select()
    .eq('username', username);

  const resume = JSON.parse(data[0].resume);

  const resumeString = JSON.stringify(resume);

  let prompt = [
    `
  You are a human candidate for a job. Read the supplied resume and pretend you are that person. Your resume has been supplied to them.

  This is your resume in the JSON format. Reference it for the cover letter.

  ${resumeString}

  `,
  ];

  if (jobDescription) {
    prompt.push(`
    Here is the job description I am applying for;
     ${jobDescription}.
    `);
  }

  prompt.push(
    `Using a ${tone} tonality. Format your response using Markdown. Don't be afraid to name your lack of experience the candidate might have but focus on your strengths. Keep it two a couple short paragraphs only 300 words.

    Please write a short cover letter. Make sure you write a cover letter.`
  );

  try {
    const { text } = await generateText({
      model: openai('gpt-4o-2024-08-06', {
        apiKey: process.env.OPENAI_API_KEY,
      }),
      temperature: 0.85,
      prompt: prompt.join(''),
    });

    // Send Discord notification for AI feature usage
    try {
      await notifyFeatureUsage('cover_letter_generated', {
        username,
        tone,
        hasJobDescription: !!jobDescription,
        wordCount: text.split(' ').length,
      });
    } catch (discordError) {
      // Don't fail the request if Discord notification fails
      console.error('Discord notification failed:', discordError.message);
    }

    return res.status(200).send(text);
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return res.status(500).json({ error: error.message });
  }
}
