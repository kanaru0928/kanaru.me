import { compile } from "@mdx-js/mdx";
import rehypeShiki from "@shikijs/rehype";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { remarkLinkCard } from "~/features/mdx/plugins/remark-link-card";
import { logger } from "~/lib/logger";
import { extractURLsFromMarkdown, fetchMultipleOGP } from "./ogp";

export async function compileArticleWithOGP(contentBody: string) {
  logger.debug("Extracting URLs from markdown content");

  // URL抽出
  const urls = extractURLsFromMarkdown(contentBody);

  logger.debug("Promissing OGP data for extracted URLs");

  // OGP取得
  const ogpMap = fetchMultipleOGP(urls);

  logger.debug("Compiling MDX content with OGP data");

  // MDXコンパイル
  const code = String(
    await compile(contentBody, {
      remarkPlugins: [remarkFrontmatter, remarkGfm, remarkLinkCard],
      rehypePlugins: [[rehypeShiki, { theme: "catppuccin-mocha" }]],
      outputFormat: "function-body",
    }),
  );

  logger.debug("MDX content compiled successfully");

  return { code, ogpMap };
}
