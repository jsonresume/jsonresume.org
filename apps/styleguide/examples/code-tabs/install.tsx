import { CodeTabs } from '@jsonresume/ui';

export default function CodeTabsInstall() {
  return (
    <CodeTabs
      label="Install with"
      tabs={[
        { label: 'npm', code: 'npm install -g resume-cli' },
        { label: 'pnpm', code: 'pnpm add -g resume-cli' },
        { label: 'npx', code: 'npx resume-cli --help' },
      ]}
    />
  );
}
