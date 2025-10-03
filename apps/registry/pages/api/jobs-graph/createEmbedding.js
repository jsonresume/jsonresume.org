const OpenAI = require('openai');

/**
 * Creates an embedding vector from text using OpenAI
 * @param {string} text - Text to embed
 * @returns {Promise<number[]>} Embedding vector (padded to 3072 dimensions)
 */
export async function createEmbedding(text) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing env var from OpenAI');
  }

  const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = await openaiClient.embeddings.create({
    model: 'text-embedding-3-large',
    input: text,
  });

  const desiredLength = 3072;
  let embedding = completion.data[0].embedding;

  // Pad embedding if needed
  if (embedding.length < desiredLength) {
    embedding = embedding.concat(
      Array(desiredLength - embedding.length).fill(0)
    );
  }

  return embedding;
}
