import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import rehypeShiki from '@shikijs/rehype'


export default defineConfig(({ isSsrBuild }) => ({
  build: {
    rollupOptions: isSsrBuild ? { input: "./server/app.ts" } : undefined,
  },
  plugins: [mdx({
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypeShiki, { theme: 'catppuccin-mocha' }]],
  }), tailwindcss(), reactRouter(), tsconfigPaths()],
}));
