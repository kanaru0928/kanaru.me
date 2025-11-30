"use client";

import { compile, run } from "@mdx-js/mdx";
import rehypeShiki from "@shikijs/rehype";
import { Fragment, useEffect, useState } from "react";
import * as runtime from "react/jsx-runtime";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { apiClient } from "~/lib/apiClient";
import type { Route } from "./+types/articles.$slug";

export async function loader({ params }: Route.LoaderArgs) {
  const { slug } = params;

  const { data: article, error } = await apiClient.GET("/api/articles/{slug}", {
    params: { path: { slug } },
  });

  if (error || !article) {
    throw new Response("Article not found", { status: 404 });
  }

  const code = String(
    await compile(article.contentBody, {
      remarkPlugins: [remarkFrontmatter, remarkGfm],
      rehypePlugins: [[rehypeShiki, { theme: "catppuccin-mocha" }]],
      outputFormat: "function-body",
    })
  );

  return { article, code };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { article } = loaderData;
  return [
    { title: article.title },
    {
      name: "description",
      content: article.contentBody.slice(0, 150).replace(/\n/g, " "),
    },
  ]
}

export default function ArticlesSlugRoute({
  loaderData,
}: Route.ComponentProps) {
  const { code } = loaderData;

  const [mdxModule, setMdxModule] = useState<Awaited<
    ReturnType<typeof run>
  > | null>(null);
  const Content = mdxModule ? mdxModule.default : Fragment;

  useEffect(() => {
    (async () => {
      setMdxModule(await run(code, { ...runtime, baseUrl: import.meta.url }));
    })();
  }, [code]);

  return <Content />;
}
