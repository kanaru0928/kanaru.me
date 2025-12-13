"use client";

import { run } from "@mdx-js/mdx";
import { formatISO9075 } from "date-fns";
import { Fragment, useEffect, useState } from "react";
import * as runtime from "react/jsx-runtime";
import { compileArticleWithOGP } from "~/features/articles/loaders/article-loader";
import { LinkCard } from "~/features/mdx/components/LinkCard";
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

  // 共通関数を使用
  const { code, ogpMap } = await compileArticleWithOGP(article.contentBody);

  return { article, code, ogpMap };
}

export default function ArticlesSlugRoute({
  loaderData,
}: Route.ComponentProps) {
  const { article, code, ogpMap } = loaderData;

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

  // OGP情報を注入したmdxComponentsを作成
  const customComponents = {
    ...mdxComponents,
    LinkCard: ({ url }: { url: string }) => {
      const ogpData = ogpMap.get(url);
      return <LinkCard url={url} {...ogpData} />;
    },
  };

  return (
    <>
      <title>{article.title}</title>
      <meta property="og:title" content={article.title} />
      <meta
        property="og:image"
        content={`${import.meta.env.VITE_BASE_URL}/api/og/articles/${article.slug}`}
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
      <Content components={customComponents} />
    </>
  );
}
