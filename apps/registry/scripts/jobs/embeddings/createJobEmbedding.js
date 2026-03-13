const { embed } = require('ai');
const { openai } = require('@ai-sdk/openai');

// Track embedding fingerprints to detect duplicates within a batch
const seenEmbeddings = new Map();

function getEmbeddingFingerprint(embedding) {
  // Use first 20 values as fingerprint
  return embedding
    .slice(0, 20)
    .map((v) => v.toFixed(6))
    .join(',');
}

async function createEmbedding(job, supabase) {
  // Prefer gpt_content_full (human-readable NL description) over raw JSON
  // gpt_content_full is designed for semantic matching and avoids JSON noise
  const embeddingInput = job.gpt_content_full || job.gpt_content;
  if (!embeddingInput) {
    throw new Error('Job has no content to embed');
  }

  const contentLength = embeddingInput.length;
  const inputType = job.gpt_content_full ? 'NL' : 'JSON';

  // Call OpenAI embedding API with explicit error handling
  let rawEmbedding;
  try {
    const result = await embed({
      model: openai.embedding('text-embedding-3-large'),
      value: embeddingInput,
    });
    rawEmbedding = result.embedding;
  } catch (apiError) {
    throw new Error(`OpenAI API failed: ${apiError.message}`);
  }

  // Validate embedding was actually returned
  if (
    !rawEmbedding ||
    !Array.isArray(rawEmbedding) ||
    rawEmbedding.length === 0
  ) {
    throw new Error('OpenAI returned empty or invalid embedding');
  }

  const desiredLength = 3072;
  let embedding = rawEmbedding;

  // Pad embedding if needed (rare case)
  if (embedding.length < desiredLength) {
    embedding = embedding.concat(
      Array(desiredLength - embedding.length).fill(0)
    );
  }

  // Check for duplicate embeddings (indicates API issue or caching bug)
  const fingerprint = getEmbeddingFingerprint(embedding);
  if (seenEmbeddings.has(fingerprint)) {
    const previousJobId = seenEmbeddings.get(fingerprint);
    console.warn(
      `  ⚠️ WARNING: Job #${job.id} has same embedding as Job #${previousJobId}!`
    );
    console.warn(`     This may indicate an API or caching issue.`);
    // Still save it, but log the warning for investigation
  }
  seenEmbeddings.set(fingerprint, job.id);

  const { error: updateError } = await supabase
    .from('jobs')
    .update({
      embedding_v5: embedding,
    })
    .eq('id', job.id);

  if (updateError) {
    throw new Error(`Database update failed: ${updateError.message}`);
  }

  console.log(
    `  ✓ Job #${job.id} [${inputType}] (${contentLength} chars, ${embedding.length}D vector)`
  );
}

// Reset seen embeddings (call between batch runs)
function resetEmbeddingCache() {
  seenEmbeddings.clear();
}

module.exports = { createEmbedding, resetEmbeddingCache };
