import { Banner } from '@jsonresume/ui';

export default function BannerTones() {
  return (
    <>
      <Banner tone="info" label="Maintenance">
        The registry will be read-only for 10 minutes at 02:00 UTC.
      </Banner>
      <Banner tone="warning" label="Schema warning">
        Your resume uses fields deprecated in schema 1.7.
      </Banner>
      <Banner tone="neutral" label="Beta">
        Pathways is in beta. Results may change.
      </Banner>
    </>
  );
}
