import { Badge } from '@jsonresume/ui';

export default function BadgeTones() {
  return (
    <>
      <Badge>Neutral</Badge>
      <Badge tone="brand">Official</Badge>
      <Badge tone="outline">Community</Badge>
      <Badge tone="info">Beta</Badge>
      <Badge tone="success">Valid</Badge>
      <Badge tone="warning">Deprecated</Badge>
      <Badge tone="danger">Invalid</Badge>
    </>
  );
}
