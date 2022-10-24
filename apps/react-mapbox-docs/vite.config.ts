import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import fs from 'fs/promises';
import { getHighlighter, loadTheme } from 'shiki';

const highlightCode = async (path: string) => {
  const fileContent = (await fs.readFile(path)).toString();

  return getHighlighter({
    theme: 'github-dark',
    langs: ['ts', 'tsx'],
  }).then((highlighter) => {
    return highlighter.codeToHtml(fileContent, { lang: 'tsx' });
  });
};

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    examples: {
      DisplayMap: await highlightCode('./src/examples/DisplayMap.tsx'),
      CustomTheme: await highlightCode('./src/examples/CustomTheme.tsx'),
      DisplayMarker: await highlightCode('./src/examples/DisplayMarker.tsx'),
    },
  },
  plugins: [react(), checker({ typescript: true })],
  publicDir: 'public',
  envPrefix: 'PUBLIC_',
  base: './',
  build: {
    chunkSizeWarningLimit: 1000,
  },
});
