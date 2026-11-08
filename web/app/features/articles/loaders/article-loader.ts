import { compile } from "@mdx-js/mdx";
import rehypeShiki from "@shikijs/rehype";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { remarkLinkCard } from "~/features/mdx/plugins/remark-link-card";
import { extractURLsFromMarkdown, fetchMultipleOGP } from "./ogp";

export function fetchOgpMap(contentBody: string) {
  // URL抽出
  const urls = extractURLsFromMarkdown(contentBody);

  // OGP取得
  const ogpMap = fetchMultipleOGP(urls);

  return ogpMap;
}

export async function compileArticle(contentBody: string) {
  return String(
    await compile(contentBody, {
      remarkPlugins: [remarkFrontmatter, remarkGfm, remarkLinkCard],
      rehypePlugins: [[rehypeShiki, { theme: "catppuccin-mocha" }]],
      outputFormat: "function-body",
    }),
  );
}
