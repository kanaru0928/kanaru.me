"use client";

import { compile, run } from "@mdx-js/mdx";
import rehypeShiki from "@shikijs/rehype";
import { formatISO9075 } from "date-fns";
import { Fragment, useEffect, useState } from "react";
import * as runtime from "react/jsx-runtime";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "~/features/mdx/mdx-components";
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
    }),
  );

  return { article, code };
}

export default function ArticlesSlugRoute({
  loaderData,
}: Route.ComponentProps) {
  const { article, code } = loaderData;

  const [mdxModule, setMdxModule] = useState<Awaited<
    ReturnType<typeof run>
  > | null>(null);
  const Content = mdxModule ? mdxModule.default : Fragment;

  useEffect(() => {
    (async () => {
      setMdxModule(
        await run(code, {
          ...runtime,
          baseUrl: import.meta.url,
        }),
      );
    })();
  }, [code]);

  return (
    <>
      <title>{article.title}</title>
      <meta property="og:title" content={article.title} />
      <meta
        property="og:image"
        content={`${import.meta.env.VITE_BASE_URL}/api/og/${article.slug}`}
      />
      <meta property="og:type" content="article" />
      <meta property="og:description" content={"kanaru.me の投稿記事"} />
      <div className="not-prose">
        <p className="text-sm">作成日: {formatISO9075(article.createdAt)}</p>
        {article.createdAt !== article.updatedAt && (
          <p className="text-sm">更新日: {formatISO9075(article.updatedAt)}</p>
        )}
        <p className="text-sm">{article.pv} views</p>
        <div className="mt-2 mb-8 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <div
              key={tag}
              className="badge badge-sm lg:badge-md overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
      <Content components={mdxComponents} />
    </>
  );
}
