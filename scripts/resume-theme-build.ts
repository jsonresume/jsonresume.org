import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig, type Plugin } from 'vite';

/** Embed build-time vanilla-extract CSS in HTML without runtime file access. */
function inlineDocumentCss(): Plugin {
  return {
    name: 'jsonresume-inline-document-css',
    enforce: 'post',
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        const css = Object.values(bundle)
          .filter(
            (file) => file.type === 'asset' && file.fileName.endsWith('.css')
          )
          .map((file) => (file.type === 'asset' ? String(file.source) : ''))
          .join('\n');
        if (!css)
          this.error('A resume theme must contain its compiled stylesheet.');
        for (const file of Object.values(bundle)) {
          if (file.type === 'asset' && file.fileName.endsWith('.css')) {
            delete bundle[file.fileName];
          } else if (file.type === 'chunk') {
            file.code = file.code.replace(
              /(["'])__JSONRESUME_INLINE_CSS__\1/g,
              JSON.stringify(css)
            );
          }
        }
      },
    },
  };
}

export function resumeThemeBuild() {
  return defineConfig({
    plugins: [
      vanillaExtractPlugin({ identifiers: 'short' }),
      inlineDocumentCss(),
    ],
    build: {
      ssr: true,
      ssrEmitAssets: true,
      target: 'node18',
      minify: false,
      cssCodeSplit: false,
      lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'index' },
      rollupOptions: {
        external: (id) =>
          id !== '@jsonresume/core/ssr' &&
          /^(react(?:\/|$)|react-dom(?:\/|$)|effect(?:\/|$)|@jsonresume\/)/.test(
            id
          ),
      },
    },
    ssr: {
      noExternal: [
        '@jsonresume/core',
        'styled-components',
        '@emotion/is-prop-valid',
        'stylis',
        'shallowequal',
      ],
    },
  });
}
