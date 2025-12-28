import { compile } from "@mdx-js/mdx";
import rehypeShiki from "@shikijs/rehype";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { remarkLinkCard } from "~/features/mdx/plugins/remark-link-card";
import type { Route } from "./+types/articles.code.$hash";

export async function loader({ params }: Route.LoaderArgs) {
  const { hash } = params;

  const hashRegex = /^[a-zA-Z0-9_=-]{43}\.mdx?$/;
  if (!hashRegex.test(hash)) {
    throw new Response("Invalid article hash", { status: 400 });
  }

  console.log(
    "Fetching article with url:",
    `${process.env.API_BASE_URL}/static/articles/${hash}`
  );
  const data = await fetch(
    `${process.env.API_BASE_URL}/static/articles/${hash}`
  );
  if (!data.ok) {
    throw new Response("Article not found", { status: 404 });
  }
  const contentBody = await data.text();

  const code = String(
    await compile(contentBody, {
      remarkPlugins: [remarkFrontmatter, remarkGfm, remarkLinkCard],
      rehypePlugins: [[rehypeShiki, { theme: "catppuccin-mocha" }]],
      outputFormat: "function-body",
    })
  );

  return { code };
}
