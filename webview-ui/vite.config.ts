import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // emit to `build/` by default
    outDir: 'build',

    // turn off CSS code-splitting: produces a single CSS file
    cssCodeSplit: false,

    rollupOptions: {
      // all code (your app + deps) stays in one file
      output: {
        // no hashes, always `main.js`
        entryFileNames: 'main.js',
        // ensure that any chunk (if Rollup ever creates one) also is named `main.js`
        chunkFileNames: 'main.js',
        // pick out .css assets and name them `main.css`
        assetFileNames: assetInfo => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'main.css'
          }
          // leave other assets (images, fonts…) with their original name
          return assetInfo.name!
        },
        // force everything into one JS bundle
        manualChunks: () => 'main'
      }
    }
  }
})
