import { Avatar, Stack } from '@jsonresume/ui';

export default function AvatarBasic() {
  return (
    <Stack direction="row" gap={4} align="center">
      <Avatar
        name="Thomas Davis"
        src="https://avatars.githubusercontent.com/u/416209?v=4"
        size="lg"
      />
      <Avatar
        name="Thomas Davis"
        src="https://avatars.githubusercontent.com/u/416209?v=4"
      />
      <Avatar name="Ada Lovelace" />
      <Avatar name="Grace Hopper" size="sm" shape="circle" />
    </Stack>
  );
}
