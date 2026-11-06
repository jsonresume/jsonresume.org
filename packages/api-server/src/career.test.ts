import { afterEach, expect, it } from 'vitest';
import { testServer } from './test/server';

let server: ReturnType<typeof testServer>;
afterEach(() => server?.dispose());

it('serves the career graph, keeps a month, and makes and edits plans', async () => {
  server = testServer();
  await server.post('/api/auth/signup', {
    email: 'ada@example.com',
    password: 'correct horse battery',
    username: 'ada',
  });
  await server.fetch('/api/account/resume', {
    method: 'PUT',
    body: JSON.stringify({
      resume: {
        basics: { name: 'Ada', label: 'Engineer' },
        work: [{ name: 'Acme', position: 'Engineer' }],
        skills: [{ name: 'Backend', keywords: ['TypeScript'] }],
      },
    }),
  });

  const graph = await (await server.fetch('/api/me/career')).json();
  expect(graph.pending).toBe(false);
  expect(graph.nodes.map((n: { kind: string }) => n.kind)).toContain(
    'evidence'
  );
  expect(graph.bands.meaning[0]).toBe('Foundations');
  expect(graph.snapshots).toHaveLength(1);

  const made = await server.post('/api/me/career/plans', {
    destination: 'Engineering manager',
  });
  expect(made.status).toBe(201);
  const plan = await made.json();
  expect(plan.destination).toBe('Engineering manager');

  const plans = await (await server.fetch('/api/me/career/plans')).json();
  expect(plans).toHaveLength(1);
  expect(
    (await server.fetch('/api/me/career/plans/nope', { method: 'DELETE' }))
      .status
  ).toBe(404);
  expect(
    (
      await server.fetch(`/api/me/career/plans/${plan.id}`, {
        method: 'DELETE',
      })
    ).status
  ).toBe(204);

  const month = graph.snapshots[0];
  const then = await server.fetch(`/api/me/career/snapshots/${month}`);
  expect(then.status).toBe(200);
});
