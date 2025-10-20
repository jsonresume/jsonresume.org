import { useMDXComponents as getThemeMDXComponents } from 'nextra-theme-docs';

const themeComponents = getThemeMDXComponents();

export function useMDXComponents(components: any) {
  return {
    ...themeComponents,
    ...components,
  };
}
