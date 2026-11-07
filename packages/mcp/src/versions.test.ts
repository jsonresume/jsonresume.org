import { afterEach, describe, expect, it } from 'vitest';
import { connect, disposeEndpoint, setup } from './test/endpoint';

afterEach(disposeEndpoint);

describe('resume history tools', () => {
  it('lists versions with who made them, reads one, and restores it', async () => {
    const { handler, key, access, events } = await setup();
    const agent = await connect(handler, key);
    const claude = await connect(handler, access);
    const resume = {
      basics: { name: 'Ada', label: 'Engineer' },
      work: [{ name: 'Analytical Engines', position: 'Programmer' }],
      skills: [{ name: 'Mathematics' }],
    };
    expect((await agent.call('save_resume', { resume })).isError).toBeFalsy();
    await claude.call('update_resume_section', {
      section: 'skills',
      value: [{ name: 'Poetry' }],
    });

    const listed = await claude.call('list_versions', { limit: 2 });
    expect(listed.value.next).toBe(2);
    expect(
      listed.value.versions.map(
        (v: { version: number; actor: unknown; changes: string[] }) => [
          v.version,
          v.actor,
          v.changes,
        ]
      )
    ).toEqual([
      [
        3,
        { kind: 'assistant', id: expect.any(String), name: 'Claude' },
        ['skills[0].name changed'],
      ],
      [
        2,
        { kind: 'assistant', id: expect.any(String), name: 'agent' },
        ['work added', 'skills added'],
      ],
    ]);

    const two = await claude.call('get_version', { version: 2 });
    expect(two.value.resume).toEqual(resume);
    expect((await claude.call('get_version', { version: 99 })).isError).toBe(
      true
    );

    const restored = await claude.call('restore_version', { version: 2 });
    expect(restored.value).toMatchObject({ restored: 2, version: 4 });
    expect((await claude.call('get_resume')).value.resume).toEqual(resume);
    const [latest] = (await claude.call('list_versions', { limit: 1 })).value
      .versions;
    expect(latest).toMatchObject({
      version: 4,
      actor: { kind: 'restore', name: 'Claude' },
      note: 'Restored version 2',
    });

    const saves = events.filter((e) => e.event === 'resume_saved');
    expect(saves.map((e) => e.properties)).toEqual([
      { via: 'mcp', source: 'mcp', real: true, first: false, sections: 3 },
      { via: 'mcp', source: 'mcp', real: true, first: false, sections: 3 },
    ]);
    expect(events.filter((e) => e.event === 'version_restored')).toEqual([
      { event: 'version_restored', properties: { actor: 'assistant' } },
    ]);
  });

  it('marks restore as a destructive write and the others as reads', async () => {
    const { handler, key } = await setup();
    const { send } = await connect(handler, key);
    type Listed = { name: string; annotations: Record<string, unknown> };
    const listed = (await send('tools/list')).tools as Listed[];
    const hint = (name: string) =>
      listed.find((t) => t.name === name)?.annotations;
    expect(hint('list_versions')).toMatchObject({ readOnlyHint: true });
    expect(hint('get_version')).toMatchObject({ readOnlyHint: true });
    expect(hint('restore_version')).toMatchObject({
      readOnlyHint: false,
      destructiveHint: true,
    });
  });
});

describe('connected apps', () => {
  it('counts the saves each app made, from its versions', async () => {
    const { handler, access } = await setup();
    const claude = await connect(handler, access);
    const before = (await claude.call('list_connected_apps')).value.apps;
    expect(before).toMatchObject([
      { name: 'Claude', changes: 0, last_change_at: null },
    ]);
    await claude.call('update_resume_section', {
      section: 'skills',
      value: [{ name: 'Poetry' }],
    });
    const after = (await claude.call('list_connected_apps')).value.apps;
    expect(after).toMatchObject([
      { name: 'Claude', changes: 1, last_change_at: expect.any(String) },
    ]);
  });
});
