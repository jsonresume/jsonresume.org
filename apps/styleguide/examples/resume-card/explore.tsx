import { Grid, ResumeCard } from '@jsonresume/ui';

export default function ResumeCardExplore() {
  return (
    <Grid minColumnWidth="16rem" gap={4}>
      <ResumeCard
        name="Thomas Davis"
        label="Full Stack Developer & AI Engineer"
        avatarUrl="https://avatars.githubusercontent.com/u/416209?v=4"
        location="Cairns, Australia"
        updated="Updated 2 days ago"
        href="#thomasdavis"
        skills={[
          'TypeScript',
          'React',
          'Node.js',
          'Rust',
          'Postgres',
          'LLMs',
          'Go',
          'Kubernetes',
        ]}
      />
      <ResumeCard
        name="Ada Lovelace"
        label="Analyst"
        location="London"
        href="#ada"
        skills={['Mathematics', 'Algorithms']}
      />
    </Grid>
  );
}
