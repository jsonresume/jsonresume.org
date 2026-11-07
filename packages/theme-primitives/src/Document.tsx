import { classes as c } from './base.css.js';
import { defaultDesign } from './tokens.css.js';
import { Header } from './Header.js';
import { Sections } from './Sections.js';
import type { DocumentModel, ThemeOptions } from './types.js';

export function Document({
  model,
  options,
}: {
  model: DocumentModel;
  options: ThemeOptions;
}) {
  const sidebar = options.sidebarSections ?? [
    'skills',
    'languages',
    'interests',
    'certificates',
  ];
  const split =
    !model.settings.singleColumn &&
    !['single', 'academic', 'european'].includes(options.layout);
  const secondary = split
    ? model.sections.filter((section) => sidebar.includes(section.id))
    : [];
  const primary = split
    ? model.sections.filter((section) => !sidebar.includes(section.id))
    : model.sections;
  const layout =
    secondary.length > 0 || options.layout === 'left'
      ? options.layout
      : ['academic', 'european'].includes(options.layout)
      ? options.layout
      : 'single';
  return (
    <main
      className={`${defaultDesign} ${c.page} ${options.className}`}
      data-theme={options.slug}
      data-layout={model.settings.singleColumn ? 'single' : layout}
      data-density={model.settings.compact ? 'compact' : 'comfortable'}
      data-monochrome={model.settings.monochrome}
    >
      <Header model={model} />
      <div className={c.body}>
        <div className={c.primary}>
          <Sections sections={primary} language={model.headingLanguage} />
        </div>
        {secondary.length > 0 && (
          <aside className={c.secondary} aria-label={secondary[0]?.title}>
            <Sections sections={secondary} language={model.headingLanguage} />
          </aside>
        )}
      </div>
    </main>
  );
}
