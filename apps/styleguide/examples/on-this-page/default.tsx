import { OnThisPage } from '@jsonresume/ui';

export default function OnThisPageDefault() {
  return (
    <OnThisPage
      items={[
        { id: 'install', label: 'Install' },
        { id: 'commands', label: 'Commands' },
        { id: 'themes', label: 'Themes' },
      ]}
    />
  );
}
