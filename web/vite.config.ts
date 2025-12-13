import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import rehypeShiki from "@shikijs/rehype";
import tailwindcss from "@tailwindcss/vite";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { remarkLinkCard } from "./app/features/mdx/plugins/remark-link-card";

export default defineConfig(({ isSsrBuild }) => ({
  build: {
    rollupOptions: isSsrBuild ? { input: "./server/app.ts" } : undefined,
  },
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkGfm, remarkLinkCard],
      rehypePlugins: [[rehypeShiki, { theme: "catppuccin-mocha" }]],
      providerImportSource: "@mdx-js/react",
    }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
  ssr: isSsrBuild
    ? {
        noExternal: true,
        external: [
          "@react-router/fs-routes",
          "@react-router/node",
          "@react-router/express",
          "express",
          "compression",
          "isbot",
          "morgan",
          "serverless-http",
          "react",
          "react-dom",
          "react-router",
        ],
      }
    : undefined,
}));
