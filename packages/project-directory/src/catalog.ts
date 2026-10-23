import type { Project, ProjectCategory } from '@repo/domain';

/** Category names for people, in the order the directory shows them. */
export const categoryLabel: Record<ProjectCategory, string> = {
  integration: 'Integrations',
  framework: 'Libraries and frameworks',
  validator: 'Validators',
  hosting: 'Hosting',
  ai: 'AI',
  transfer: 'Import and export',
  github: 'GitHub',
  editor: 'Editors',
  cli: 'Command-line tools',
  visualization: 'Visualisation',
  generator: 'Generators',
  parser: 'Parsers',
  ats: 'Applicant tracking',
};

export interface ProjectFilter {
  query: string;
  category: string | null;
}

const haystack = (p: Project) =>
  [p.name, p.description, p.language, categoryLabel[p.category]]
    .join(' ')
    .toLowerCase();

/** Projects matching every word of the query, in the chosen category. */
export function filterProjects(
  list: ReadonlyArray<Project>,
  { query, category }: ProjectFilter
) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return list.filter(
    (p) =>
      (category === null || p.category === category) &&
      words.every((w) => haystack(p).includes(w))
  );
}

/** Projects grouped by category, in category order, skipping empty groups. */
export function groupByCategory(
  list: ReadonlyArray<Project>,
  categories: ReadonlyArray<ProjectCategory>
) {
  return categories
    .map((category) => ({
      category,
      items: list.filter((p) => p.category === category),
    }))
    .filter((group) => group.items.length > 0);
}
