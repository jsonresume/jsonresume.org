const { embed } = require('ai');
const { openai } = require('@ai-sdk/openai');

async function createEmbedding(job, supabase) {
  if (!job.gpt_content) {
    throw new Error('Job has no gpt_content to embed');
  }

  const contentLength = job.gpt_content.length;
  const { embedding: rawEmbedding } = await embed({
    model: openai.embedding('text-embedding-3-large'),
    value: job.gpt_content,
  });

  const desiredLength = 3072;
  let embedding = rawEmbedding;

  // Pad embedding if needed (rare case)
  if (embedding.length < desiredLength) {
    embedding = embedding.concat(
      Array(desiredLength - embedding.length).fill(0)
    );
  }

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
    `  ✓ Job #${job.id} (${contentLength} chars, ${embedding.length}D vector)`
  );
}

module.exports = { createEmbedding };
