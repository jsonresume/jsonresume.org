import { TestDatabase } from '@repo/database/testing';
import { Effect, Layer } from 'effect';
import { SqlClient } from 'effect/sql';
import { describe, expect, it } from 'vitest';
import { SkillCatalog } from './services';
import { mergePlan, mergeSkills } from './skillMerge';
import { SkillCatalogLive } from './skills';
import { insertJob, posting } from './test/fixtures';

const s = (id: number, key: string, name: string) => ({ id, key, name });

describe('merging stored skills', () => {
  it('plans one skill per key, keeping the row at the key and a good name', () => {
    const plan = mergePlan([
      s(1, 'open source', 'open source'),
      s(2, 'open-source', 'Open-source'),
      s(3, 'ml', 'Machine learning'),
      s(4, 'ai/ml', 'AI/ML'),
      s(5, 'c', 'C'),
      s(6, 'cpp', 'C++'),
      s(7, 'csharp', 'C#'),
      s(8, 'java', 'Java'),
      s(9, 'javascript', 'JavaScript'),
      s(10, 'observability', 'observability'),
      s(11, 'nestjs', 'NestJS'),
    ]);
    expect(plan).toEqual([
      { keep: 1, key: 'open source', name: 'Open source', drop: [2] },
      { keep: 3, key: 'ml', name: 'Machine Learning', drop: [4] },
      { keep: 11, key: 'nest.js', name: 'NestJS', drop: [] },
    ]);
  });

  it('moves evidence, requirements, aliases and strengths to the skill kept', async () => {
    const result = await Effect.runPromise(
      Effect.gen(function* () {
        const sql = yield* SqlClient.SqlClient;
        const skills = [
          s(1, 'open source', 'open source'),
          s(2, 'open-source', 'open-source'),
          s(3, 'ml', 'Machine learning'),
          s(4, 'ai/ml', 'AI/ML'),
          s(5, 'react native', 'react native'),
          s(6, 'c', 'C'),
          s(7, 'cpp', 'C++'),
        ];
        yield* sql`INSERT INTO app.skills ${sql.insert(skills)}`;
        yield* sql`INSERT INTO app.skill_aliases ${sql.insert(
          skills.map((k) => ({ alias: k.key, skill_id: k.id }))
        )}`;
        const strengths = {
          themes: [
            { name: 'Models', summary: '', entries: [], skills: [4, 7, 3] },
          ],
          roles: {},
        };
        yield* sql`
          INSERT INTO app.resume_insights (resume_key, level, strengths, foundations, model)
          VALUES ('r1', 'senior', ${JSON.stringify(
            strengths
          )}::jsonb, '[]'::jsonb, 'm')
        `;
        yield* sql`INSERT INTO app.resume_evidence ${sql.insert([
          ev('work:0', 3, 1, 'listed ML'),
          ev('work:0', 4, 3, 'Led AI/ML work'),
          ev('work:1', 2, 2, 'open-source maintainer'),
          ev('work:1', 1, 1, 'open source'),
        ])}`;
        yield* insertJob(1, '<p>Acme</p>', posting());
        yield* sql`
          INSERT INTO app.job_roles (job_id, idx, title, family, seniority, summary, model)
          VALUES (1, 0, 'ML Engineer', 'ai', 'senior', '', 'roles-1')
        `;
        yield* sql`INSERT INTO app.job_requirements ${sql.insert([
          need(1, 'nice'),
          need(2, 'required'),
          need(3, 'nice'),
          need(4, 'nice'),
          need(6, 'required'),
        ])}`;

        const first = yield* mergeSkills();
        const again = yield* mergeSkills();
        const resolved = yield* (yield* SkillCatalog).resolve([
          'Open-Source',
          'ML',
          'AI/ML',
          'React-Native',
          'C',
          'C++',
        ]);
        return {
          first,
          again,
          resolved: Object.fromEntries(
            [...resolved].map(([n, k]) => [n, k.id])
          ),
          skills: yield* sql`SELECT id, key, name FROM app.skills ORDER BY id`,
          evidence: yield* sql`
            SELECT entry, skill_id, strength, quote FROM app.resume_evidence ORDER BY entry`,
          needs: yield* sql`
            SELECT skill_id, need FROM app.job_requirements ORDER BY skill_id`,
          aliases: yield* sql`
            SELECT alias, skill_id FROM app.skill_aliases ORDER BY alias`,
          strengths: yield* sql`SELECT strengths FROM app.resume_insights`,
        };
      }).pipe(
        Effect.provide(SkillCatalogLive.pipe(Layer.provideMerge(TestDatabase)))
      )
    );
    expect(result.first).toEqual({ merged: 2, renamed: 1 });
    expect(result.again).toEqual({ merged: 0, renamed: 0 });
    expect(result.skills).toEqual([
      s(1, 'open source', 'Open source'),
      s(3, 'ml', 'Machine Learning'),
      s(5, 'react native', 'React Native'),
      s(6, 'c', 'C'),
      s(7, 'cpp', 'C++'),
    ]);
    // The strongest evidence per entry stays.
    expect(result.evidence).toEqual([
      { entry: 'work:0', skill_id: 3, strength: 3, quote: 'Led AI/ML work' },
      {
        entry: 'work:1',
        skill_id: 1,
        strength: 2,
        quote: 'open-source maintainer',
      },
    ]);
    // "required" wins over "nice"; C is not folded into anything.
    expect(result.needs).toEqual([
      { skill_id: 1, need: 'required' },
      { skill_id: 3, need: 'nice' },
      { skill_id: 6, need: 'required' },
    ]);
    expect(result.aliases).toContainEqual({
      alias: 'open-source',
      skill_id: 1,
    });
    expect(result.aliases).toContainEqual({ alias: 'ai/ml', skill_id: 3 });
    expect(result.strengths[0]).toMatchObject({
      strengths: { themes: [{ skills: [3, 7] }] },
    });
    expect(result.resolved).toEqual({
      'Open-Source': 1,
      ML: 3,
      'AI/ML': 3,
      'React-Native': 5,
      C: 6,
      'C++': 7,
    });
  });
});

const ev = (entry: string, skill: number, strength: number, quote: string) => ({
  resume_key: 'r1',
  entry,
  skill_id: skill,
  strength,
  last_year: null,
  quote,
});
const need = (skill: number, need: 'required' | 'nice') => ({
  job_id: 1,
  idx: 0,
  skill_id: skill,
  need,
  years: null,
});
