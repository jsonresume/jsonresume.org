import { Sparkline, Table, Td, Th } from '@jsonresume/ui';

const pages = [
  {
    path: '/@thomasdavis',
    views: 1284,
    daily: [22, 31, 28, 35, 41, 38, 52, 49, 61, 68],
  },
  {
    path: '/@thomasdavis.pdf',
    views: 312,
    daily: [42, 39, 44, 31, 28, 30, 26, 27, 22, 23],
  },
  {
    path: '/@thomasdavis/timeline',
    views: 87,
    daily: [6, 7, 7, 8, 8, 8, 9, 9, 10, 11],
  },
];

// The number says how many; the sparkline says which way it is heading.
export default function SparklineInline() {
  return (
    <Table caption="Views in the last 10 days">
      <thead>
        <tr>
          <Th>Page</Th>
          <Th>Views</Th>
          <Th>Trend</Th>
        </tr>
      </thead>
      <tbody>
        {pages.map((p) => (
          <tr key={p.path}>
            <Td>
              <code>{p.path}</code>
            </Td>
            <Td>{p.views.toLocaleString('en')}</Td>
            <Td>
              <Sparkline values={p.daily} />
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
