const { embed } = require('ai');
const { openai } = require('@ai-sdk/openai');

/**
 * Creates an embedding vector from text using Vercel AI SDK
 * @param {string} text - Text to embed
 * @returns {Promise<number[]>} Embedding vector (padded to 3072 dimensions)
 */
export async function createEmbedding(text) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing env var from OpenAI');
  }

  const { embedding: rawEmbedding } = await embed({
    model: openai.embedding('text-embedding-3-large'),
    value: text,
  });

  const desiredLength = 3072;
  let embedding = rawEmbedding;

  // Pad embedding if needed
  if (embedding.length < desiredLength) {
    embedding = embedding.concat(
      Array(desiredLength - embedding.length).fill(0)
    );
  }

  return embedding;
}
