import { Avatar, Link, Stack, Text } from '@jsonresume/ui';

const team = [
  {
    name: 'Thomas Davis',
    role: 'Founder',
    github: 'thomasdavis',
    photo: 'https://avatars.githubusercontent.com/u/416209?v=4',
  },
  { name: 'Ada Lovelace', role: 'Maintainer', github: 'ada', photo: null },
];

// The team page pattern: square avatar, name, role, one link.
export default function AvatarTeam() {
  return (
    <Stack gap={4}>
      {team.map((p) => (
        <Stack key={p.name} direction="row" gap={3} align="center">
          <Avatar name={p.name} src={p.photo} />
          <Stack gap={0}>
            <Text weight="semibold">{p.name}</Text>
            <Text size="xs" tone="muted">
              {p.role} ·{' '}
              <Link href={`https://github.com/${p.github}`}>@{p.github}</Link>
            </Text>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
