// @todo - shows a list of all cached github gists

const { Client } = require('pg');
const gravatar = require('gravatar');

export default async function handler(req, res) {
  const client = new Client(process.env.DATABASE_URL_RAW);

  await client.connect();
  const results = await client.query(
    `SELECT username, resume, updated_at from resumes ORDER BY updated_at DESC`
  );
  const resumes = results.rows.map((row) => {
    const resume = JSON.parse(row.resume);
    return {
      username: row.username,
      label: resume?.basics?.label,
      image:
        resume?.basics?.image ||
        gravatar.url(
          resume?.basics?.email,
          { s: '200', r: 'x', d: 'retro' },
          true
        ),
      updated_at: row.updated_at,
    };
  });
  return res.status(200).send(resumes);
}
