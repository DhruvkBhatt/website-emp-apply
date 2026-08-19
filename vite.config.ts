import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

// §6: project-page base. Switch to '/' if you attach a custom domain
// (and add public/CNAME at the same time). Default to this repo's Pages
// subpath so builds on GitHub Actions publish correct asset URLs.
const base = process.env.VITE_BASE ?? '/website-emp-apply/';

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // §6/§7 — keep the initial bundle under budget. React is pinned to its
        // own long-cached chunk; motion and confetti are deliberately NOT
        // manually chunked, because a manualChunks entry would pull the whole
        // library back into the eagerly-preloaded graph and defeat the
        // LazyMotion split in components/MotionProvider.tsx.
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
});
