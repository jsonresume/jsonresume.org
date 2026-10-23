import { useAtom, useAtomValue } from '@effect/atom-react';
import {
  Badge,
  ChipGroup,
  EmptyState,
  Field,
  FilterBar,
  LinkCard,
  SearchField,
} from '@jsonresume/ui';
import { projectCategories, projects } from '@repo/content/data';
import { optionParam, textParam, useAtomsInUrl } from '@repo/url-state';
import {
  projectCategoryAtom,
  projectQueryAtom,
  visibleProjectsAtom,
} from './atoms';
import { categoryLabel, groupByCategory } from './catalog';
import * as s from './directory.css';

const chips = groupByCategory(projects, projectCategories).map(
  ({ category, items }) => ({
    value: category,
    label: categoryLabel[category],
    count: items.length,
  })
);

const urlBindings = [
  textParam('q', projectQueryAtom),
  optionParam('category', projectCategoryAtom),
];

/** Every community project, searchable and filterable, grouped by category. */
export function ProjectDirectory() {
  useAtomsInUrl(urlBindings);
  const [query, setQuery] = useAtom(projectQueryAtom);
  const [category, setCategory] = useAtom(projectCategoryAtom);
  const visible = useAtomValue(visibleProjectsAtom);
  const groups = groupByCategory(visible, projectCategories);

  return (
    <>
      <div className={s.filters}>
        <FilterBar
          label="Filter projects"
          resultCount={visible.length}
          resultLabel={(n) => `${n} ${n === 1 ? 'project' : 'projects'}`}
          onClearAll={() => {
            setQuery('');
            setCategory(null);
          }}
        >
          <Field label="Search" className={s.search}>
            <SearchField
              value={query}
              onValueChange={setQuery}
              placeholder="Name, language or purpose"
            />
          </Field>
        </FilterBar>
        <ChipGroup
          label="Category"
          allLabel="All"
          options={chips}
          value={category}
          onValueChange={setCategory}
        />
      </div>
      {groups.length ? (
        groups.map(({ category: key, items }) => (
          <section
            key={key}
            id={key}
            className={s.group}
            aria-labelledby={`${key}-title`}
          >
            <h2 id={`${key}-title`} className={s.groupTitle}>
              {categoryLabel[key]}
            </h2>
            <ul className={s.grid}>
              {items.map((project) => (
                <li key={project.link + project.name}>
                  <LinkCard
                    href={project.link}
                    title={project.name}
                    description={project.description}
                    meta={
                      project.language !== 'N/A' ? (
                        <Badge>{project.language}</Badge>
                      ) : undefined
                    }
                  />
                </li>
              ))}
            </ul>
          </section>
        ))
      ) : (
        <EmptyState title="No projects match">
          Try another word, or clear the filters.
        </EmptyState>
      )}
    </>
  );
}
