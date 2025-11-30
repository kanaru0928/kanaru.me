import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { useLoaderData } from "react-router";
import { apiClient } from "~/lib/apiClient";
import type { Route } from "./+types/articles.$slug";
import rehypeShiki from "@shikijs/rehype";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";

export async function loader({ params }: Route.LoaderArgs) {
  const { slug } = params;

  const { data: article, error } = await apiClient.GET("/api/articles/{slug}", {
    params: { path: { slug } },
  });

  if (error || !article) {
    throw new Response("Article not found", { status: 404 });
  }

  return { article };
}

export default async function ArticlesSlugRoute() {
  const { article } = useLoaderData<typeof loader>();

  const { default: MDXContent } = await evaluate(article.contentBody, {
    ...runtime,
    development: false,
    rehypePlugins: [[rehypeShiki, { theme: "catppuccin-mocha" }]],
    remarkPlugins: [remarkFrontmatter, remarkGfm],
  });

  return <MDXContent />;
}
