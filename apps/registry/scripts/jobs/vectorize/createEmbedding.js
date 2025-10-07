const { embed } = require('ai');
const { openai } = require('@ai-sdk/openai');

async function createEmbedding(job, supabase) {
  console.log(`Creating embedding for job ID: ${job.id}`);
  try {
    console.log({ job });
    const { embedding: rawEmbedding } = await embed({
      model: openai.embedding('text-embedding-3-large'),
      value: job.gpt_content,
    });

    const desiredLength = 3072;
    let embedding = rawEmbedding;

    if (embedding.length < desiredLength) {
      console.log(`Padding embedding for job ID: ${job.id}`);
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
      console.error(`Error updating job ID: ${job.id}`, updateError);
    } else {
      console.log(`Successfully updated job ID: ${job.id}`);
    }
  } catch (e) {
    console.error(`Error creating embedding for job ID: ${job.id}`, e);
  }
}

module.exports = { createEmbedding };
