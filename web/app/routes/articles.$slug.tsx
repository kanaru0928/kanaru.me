"use client";

import { runSync } from "@mdx-js/mdx";
import { formatISO9075 } from "date-fns";
import { useMemo } from "react";
import * as runtime from "react/jsx-runtime";
import { compileArticleWithOGP } from "~/features/articles/loaders/article-loader";
import { SuspenseLinkCard } from "~/features/mdx/components/SuspenseLinkCard";
import { mdxComponents } from "~/features/mdx/mdx-components";
import { apiClient } from "~/lib/apiClient";
import { logger } from "~/lib/logger";
import type { Route } from "./+types/articles.$slug";

export async function loader({ params }: Route.LoaderArgs) {
  const { slug } = params;

  logger.debug("Fetching article with slug:", slug);

  const { data: article, error } = await apiClient.GET("/api/articles/{slug}", {
    params: { path: { slug } },
  });

  logger.debug("Article fetch successful for slug:", slug);

  if (error || !article) {
    throw new Response("Article not found", { status: 404 });
  }

  logger.debug("Compiling article content for slug:", slug);

  // 共通関数を使用
  const { code, ogpMap } = await compileArticleWithOGP(article.contentBody);

  logger.debug("Article compiled successfully for slug:", slug);

  return { article, code, ogpMap };
}

export default function ArticlesSlugRoute({
  loaderData,
}: Route.ComponentProps) {
  const { article, code, ogpMap } = loaderData;

  const Content = useMemo(() => {
    const mdxModule = runSync(code, {
      ...runtime,
      baseUrl: import.meta.url,
    });
    return mdxModule.default;
  }, [code]);

  // OGP情報を注入したmdxComponentsを作成
  const customComponents = {
    ...mdxComponents,
    LinkCard: ({ url }: { url: string }) => (
      <SuspenseLinkCard url={url} ogpMap={ogpMap} />
    ),
  };

  return (
    <>
      <title>{article.title}</title>
      <meta property="og:title" content={article.title} />
      <meta
        property="og:image"
        content={`${import.meta.env.VITE_BASE_URL}/api/og/articles/${
          article.slug
        }`}
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
