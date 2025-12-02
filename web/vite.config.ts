import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import rehypeShiki from "@shikijs/rehype";
import tailwindcss from "@tailwindcss/vite";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ isSsrBuild }) => ({
  build: {
    rollupOptions: isSsrBuild ? { input: "./server/app.ts" } : undefined,
  },
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkGfm],
      rehypePlugins: [[rehypeShiki, { theme: "catppuccin-mocha" }]],
      providerImportSource: "@mdx-js/react",
    }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
}));
