import { BarList } from '@jsonresume/ui';

export default function BarListEmpty() {
  return (
    <BarList
      title="Top sources"
      items={[]}
      emptyLabel="No visits in this period yet"
    />
  );
}
