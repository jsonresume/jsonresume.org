async function createEmbedding(openai, job, supabase) {
  console.log(`Creating embedding for job ID: ${job.id}`);
  try {
    console.log({ job });
    const completion1 = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: job.gpt_content,
    });

    const desiredLength = 3072;
    let embedding = completion1.data[0].embedding;

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
