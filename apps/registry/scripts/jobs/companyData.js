require('dotenv').config({ path: __dirname + '/./../../.env' });
const fs = require('fs');
const path = require('path');

const requestBody = {
  model: 'sonar-pro',
  messages: [
    {
      role: 'user',
      content:
        'Generate a paragraph and recent news for beamible.com. Use markdown. Only add a heading for Recent news',
    },
  ],
  max_tokens: 2000,
  temperature: 0.9,
  top_p: 0.9,
  search_domain_filter: null,
  return_images: false,
  return_related_questions: false,
  search_recency_filter: 'year',
  top_k: 0,
  stream: false,
  presence_penalty: 0,
  frequency_penalty: 1,
  response_format: null,
};

const options = {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(requestBody),
};

fetch('https://api.perplexity.ai/chat/completions', options)
  .then((response) => response.json())
  .then((response) => {
    const outputPath = path.join(__dirname, 'companyData.json');
    fs.writeFileSync(outputPath, JSON.stringify(response, null, 2));
    console.log(`Response written to ${outputPath}`);
    return response;
  })
  .catch((err) => console.error(err));
