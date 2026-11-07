import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { componentDocs } from './components';

const root = fileURLToPath(new URL('..', import.meta.url));
const uiIndex = join(root, '../../packages/ui/src/index.ts');

/**
 * Providers mounted once at the root rather than shown in an example. The
 * styleguide's own layout is their live example; their pages say so.
 */
const ROOT_MOUNTED = ['Toaster', 'TooltipProvider'];

const parse = (file: string) =>
  ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest);

/** Value (not type) names exported by the package entry. */
function exportedValues(): string[] {
  return parse(uiIndex).statements.flatMap((s) =>
    ts.isExportDeclaration(s) &&
    !s.isTypeOnly &&
    s.exportClause &&
    ts.isNamedExports(s.exportClause)
      ? s.exportClause.elements
          .filter((e) => !e.isTypeOnly)
          .map((e) => e.name.text)
      : []
  );
}

/** Names a file imports from @jsonresume/ui. */
function uiImports(file: string): string[] {
  return parse(file).statements.flatMap((s) =>
    ts.isImportDeclaration(s) &&
    ts.isStringLiteral(s.moduleSpecifier) &&
    s.moduleSpecifier.text === '@jsonresume/ui' &&
    s.importClause?.namedBindings &&
    ts.isNamedImports(s.importClause.namedBindings) &&
    !s.importClause.isTypeOnly
      ? s.importClause.namedBindings.elements
          .filter((e) => !e.isTypeOnly)
          .map((e) => (e.propertyName ?? e.name).text)
      : []
  );
}

// Components are the PascalCase exports; tokens, hooks and helpers aren't.
const components = exportedValues().filter((n) => /^[A-Z][a-z]/.test(n));
const exampleFiles = componentDocs.flatMap((doc) =>
  doc.examples.map((e) => join(root, 'examples', doc.slug, `${e.id}.tsx`))
);

describe('styleguide coverage', () => {
  it('finds the exported components', () => {
    expect(components.length).toBeGreaterThan(100);
    expect(components).toContain('Button');
  });

  it('has a file for every example a page lists', () => {
    expect(exampleFiles.filter((f) => !existsSync(f))).toEqual([]);
  });

  it('shows every exported component in an example', () => {
    const shown = new Set(exampleFiles.flatMap(uiImports));
    const missing = components.filter(
      (c) => !shown.has(c) && !ROOT_MOUNTED.includes(c)
    );
    expect(missing, 'add an example under examples/<slug>/').toEqual([]);
  });

  it('mounts the root providers in the layout and documents them', () => {
    const layout = uiImports(join(root, 'app/layout.tsx'));
    const docs = readFileSync(join(root, 'lib/components.ts'), 'utf8');
    for (const name of ROOT_MOUNTED) {
      expect(components).toContain(name);
      expect(layout).toContain(name);
      expect(docs).toContain(name);
    }
  });

  it('documents props only for components the package exports', () => {
    const listed = componentDocs.flatMap((d) => d.components);
    expect(listed.filter((c) => !components.includes(c))).toEqual([]);
  });
});
