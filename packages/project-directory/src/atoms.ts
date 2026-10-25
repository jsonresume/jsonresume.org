import { projects } from '@repo/content/data';
import { Atom } from 'effect/reactivity';
import { filterProjects } from './catalog';

export const projectQueryAtom = Atom.make('');
export const projectCategoryAtom = Atom.make<string | null>(null);

export const visibleProjectsAtom = Atom.make((get) =>
  filterProjects(projects, {
    query: get(projectQueryAtom),
    category: get(projectCategoryAtom),
  })
);
