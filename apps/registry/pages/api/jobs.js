import { PineconeClient } from '@pinecone-database/pinecone';
const { Configuration, OpenAIApi } = require('openai');
const { Client } = require('pg');

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing env var from OpenAI');
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const openai = new OpenAIApi(configuration);

  const indexName = 'jsonresume-jobs';
  const pinecone = new PineconeClient();
  const { username } = req.body;

  const client = new Client(process.env.DATABASE_URL_RAW);
  await client.connect();

  const results = await client.query(
    `SELECT username, resume, updated_at from resumes WHERE username = $1 ORDER BY updated_at DESC`,
    [username]
  );

  const resume = results.rows[0];

  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });

  const index = await pinecone.Index(indexName);

  const completion1 = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input: JSON.stringify(resume),
  });

  const desiredLength = 2048;
  const namespace = 'jsonresume_jobs';

  let embedding = completion1.data.data[0].embedding;

  if (embedding.length < desiredLength) {
    embedding = embedding.concat(
      Array(desiredLength - embedding.length).fill(0)
    );
  }

  const vector = embedding;

  const queryRequest = {
    topK: 10,
    vector,
    namespace,
    includeMetadata: true,
    includeValues: false,
  };

  const queryResponse = await index.query({ queryRequest });
  const matches = queryResponse.matches.map((match) => {
    console.log(match.metadata.job);
    return JSON.parse(match.metadata.job);
  });
  return res.status(200).send(matches);
}
