import { defineConfig } from 'vite'

// The browser bundle is self-contained; Node and bundler builds use the
// package's runtime dependencies instead of including their own copies.
export default defineConfig(({ mode }) => {
  const browser = mode === 'umd'

  return {
    build: {
      emptyOutDir: false,
      lib: {
        entry: 'src/main.js',
        name: 'cuts',
        formats: browser ? ['umd'] : ['cjs', 'es'],
        fileName: format => ({
          cjs: 'cuts.cjs',
          es: 'cuts.esm.mjs',
          umd: 'cuts.umd.js',
        })[format],
      },
      rolldownOptions: {
        external: browser ? [] : [
          'ask-for-promise',
          '@peter.naydenov/log',
          '@peter.naydenov/shortcuts',
        ],
      },
    },
  }
})
