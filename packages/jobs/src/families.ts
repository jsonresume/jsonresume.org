import { dot } from './vectors';

/** Above this cosine, two posts by one company are the same role reposted. */
export const SAME_ROLE = 0.9;

export interface FamilyInput {
  id: number;
  company: string;
  postedAt: Date;
  vector: Float32Array;
}

export interface Family {
  id: number;
  /** The family's first post. */
  familyId: number;
  /** Distinct months the role was posted in. */
  months: number;
}

const SUFFIXES =
  /\b(inc|llc|ltd|limited|gmbh|corp|corporation|co|company|plc|sa|ag|bv|pty)\b/g;

/** "Acme, Inc." and "ACME" are one company. */
export const companyKey = (company: string): string =>
  company
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')
    .replace(SUFFIXES, ' ')
    .replace(/[^a-z0-9]+/g, '');

const month = (d: Date) => `${d.getUTCFullYear()}-${d.getUTCMonth()}`;

/**
 * Companies repost a role in every monthly thread. Posts by the same
 * company, from different months, whose vectors are nearly the same, form a
 * family (transitively); every post gets its family's first id and count
 * of months.
 */
export const repostFamilies = (posts: ReadonlyArray<FamilyInput>): Family[] => {
  const parent = new Map<number, number>();
  const find = (x: number): number => {
    let root = x;
    while ((parent.get(root) ?? root) !== root) root = parent.get(root) ?? root;
    parent.set(x, root);
    return root;
  };
  const union = (a: number, b: number) => {
    const [ra, rb] = [find(a), find(b)];
    if (ra !== rb) parent.set(Math.max(ra, rb), Math.min(ra, rb));
  };

  const byCompany = new Map<string, FamilyInput[]>();
  for (const post of posts) {
    parent.set(post.id, post.id);
    const key = companyKey(post.company);
    if (!key) continue;
    byCompany.set(key, [...(byCompany.get(key) ?? []), post]);
  }
  for (const group of byCompany.values()) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const [a, b] = [group[i], group[j]];
        if (!a || !b || month(a.postedAt) === month(b.postedAt)) continue;
        if (dot(a.vector, b.vector) > SAME_ROLE) union(a.id, b.id);
      }
    }
  }

  const months = new Map<number, Set<string>>();
  for (const post of posts) {
    const root = find(post.id);
    months.set(root, (months.get(root) ?? new Set()).add(month(post.postedAt)));
  }
  return posts.map((post) => {
    const root = find(post.id);
    return { id: post.id, familyId: root, months: months.get(root)?.size ?? 1 };
  });
};
