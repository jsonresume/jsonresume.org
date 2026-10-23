import { Badge, Table, Td, Th } from '@jsonresume/ui';

const fields = [
  { name: 'basics.name', type: 'string', status: 'Stable' },
  { name: 'work[].highlights', type: 'string[]', status: 'Stable' },
  { name: 'publications[].authors', type: 'string[]', status: 'New' },
];

export default function TableBasic() {
  return (
    <Table caption="A few schema fields">
      <thead>
        <tr>
          <Th>Field</Th>
          <Th>Type</Th>
          <Th>Status</Th>
        </tr>
      </thead>
      <tbody>
        {fields.map((f) => (
          <tr key={f.name}>
            <Td>
              <code>{f.name}</code>
            </Td>
            <Td>{f.type}</Td>
            <Td>
              <Badge tone={f.status === 'New' ? 'brand' : 'neutral'}>
                {f.status}
              </Badge>
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
