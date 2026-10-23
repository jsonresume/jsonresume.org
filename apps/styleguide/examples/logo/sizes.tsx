import { Logo, Stack } from '@jsonresume/ui';

export default function LogoSizes() {
  return (
    <Stack direction="row" gap={8} align="center" wrap>
      <Logo size="sm" />
      <Logo />
      <Logo size="lg" mark />
    </Stack>
  );
}
